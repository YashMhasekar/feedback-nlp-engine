"""
NLP Engine - Feedback Analysis
Uses Google Gemini API for sentiment analysis and category classification.
No local ML models (torch/transformers) are loaded.
Memory footprint: ~40-80 MB (pandas + google-generativeai only).
"""
import pandas as pd
import random
import re
import os
import json
import logging
from colorama import Fore, Style, init
import google.generativeai as genai

# Initialize colorama for colored terminal output
init(autoreset=True)

# Set up module-level logger
logger = logging.getLogger(__name__)

# ============================
# Configure Gemini API
# ============================
_gemini_model = None  # Lazy singleton

def _get_gemini_model():
    """Return (and lazily initialise) the Gemini model singleton."""
    global _gemini_model
    if _gemini_model is None:
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key or api_key == "your_api_key_here":
            raise RuntimeError(
                "GOOGLE_API_KEY environment variable is not set. "
                "Please configure it in Render Environment Variables."
            )
        logger.info("[NLP] Initialising Gemini model (first use)...")
        genai.configure(api_key=api_key)
        _gemini_model = genai.GenerativeModel("models/gemini-2.5-flash")
        logger.info("[NLP] Gemini model ready.")
    return _gemini_model


# ============================
# Keyword-based fallbacks
# (used when Gemini API is unavailable or rate-limited)
# ============================

_POSITIVE_WORDS = {
    'excellent', 'great', 'good', 'love', 'helpful', 'best', 'amazing',
    'wonderful', 'fantastic', 'outstanding', 'superb', 'perfect', 'brilliant',
    'clear', 'engaging', 'effective', 'useful', 'knowledgeable', 'supportive',
    'enjoys', 'enjoyed', 'appreciate', 'appreciated', 'thorough', 'well',
    'satisfied', 'happy', 'comfortable', 'easy', 'smooth', 'informative',
}

_NEGATIVE_WORDS = {
    'bad', 'poor', 'difficult', 'slow', 'need', 'too', 'boring', 'confusing',
    'unclear', 'unhelpful', 'terrible', 'awful', 'worst', 'hate', 'dislike',
    'disappointing', 'insufficient', 'inadequate', 'problem', 'issue', 'fail',
    'failed', 'frustrating', 'unfair', 'harsh', 'rude', 'absent', 'missing',
    'broken', 'outdated', 'incomplete', 'lack', 'lacks', 'waste',
    # Alert/sensitive words are inherently negative sentiment
    'harassment', 'discrimination', 'unsafe', 'abuse', 'bullying', 'violence',
    'threat', 'intimidation', 'humiliation', 'misconduct', 'inappropriate',
    'offensive', 'insult', 'disrespect', 'exploitation',
}

_CATEGORY_KEYWORDS = {
    "Teaching": {
        'teach', 'teacher', 'professor', 'lecture', 'explain', 'explanation',
        'teaching', 'instructor', 'faculty', 'pace', 'method', 'style',
        'communicate', 'communication', 'clarity', 'doubt', 'question',
        'interaction', 'interactive', 'engaging', 'boring',
    },
    "Infrastructure": {
        'lab', 'equipment', 'computer', 'classroom', 'facility', 'facilities',
        'projector', 'board', 'wifi', 'internet', 'seating', 'bench',
        'building', 'room', 'library', 'infrastructure', 'maintenance',
        'cleanliness', 'lighting', 'ac', 'air', 'condition',
    },
    "Behavior": {
        'behavior', 'behaviour', 'attitude', 'rude', 'respectful', 'kind',
        'support', 'supportive', 'bully', 'bullying', 'harass', 'harassment',
        'discrimination', 'abuse', 'threat', 'violence', 'misconduct',
        'inappropriate', 'offensive', 'insult', 'disrespect', 'approach',
    },
    "Course Content": {
        'content', 'course', 'material', 'syllabus', 'curriculum', 'subject',
        'topic', 'chapter', 'module', 'assignment', 'project', 'deadline',
        'exam', 'test', 'quiz', 'notes', 'textbook', 'book', 'resource',
        'practical', 'theory', 'concept', 'learning', 'knowledge',
    },
}


def _keyword_sentiment(feedback: str) -> str:
    """Fast keyword-based sentiment fallback."""
    words = set(feedback.lower().split())
    pos = len(words & _POSITIVE_WORDS)
    neg = len(words & _NEGATIVE_WORDS)
    if pos > neg:
        return "POSITIVE"
    if neg > pos:
        return "NEGATIVE"
    return "NEUTRAL"


def _keyword_category(feedback: str) -> str:
    """Fast keyword-based category fallback."""
    feedback_lower = feedback.lower()
    scores = {}
    for cat, kws in _CATEGORY_KEYWORDS.items():
        scores[cat] = sum(1 for kw in kws if kw in feedback_lower)
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "General"


# ============================
# Gemini-powered analysis
# ============================

def _analyse_with_gemini(feedback: str) -> dict:
    """
    Call Gemini ONCE per feedback row to get sentiment + category.
    Returns dict: {"sentiment": "POSITIVE"|"NEGATIVE"|"NEUTRAL",
                   "category": "Teaching"|"Course Content"|"Behavior"|"Infrastructure"}
    Falls back to keyword rules on any API error.
    """
    prompt = (
        "Analyse the following student feedback and return a JSON object with exactly "
        "two keys:\n"
        "  \"sentiment\": one of POSITIVE, NEGATIVE, NEUTRAL\n"
        "  \"category\": one of Teaching, Course Content, Behavior, Infrastructure\n\n"
        "Return ONLY the raw JSON object, no markdown, no explanation.\n\n"
        f"Feedback: {feedback}"
    )
    try:
        model = _get_gemini_model()
        response = model.generate_content(prompt)
        raw = response.text.strip()

        # Strip markdown code fences if present
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

        parsed = json.loads(raw)

        sentiment = str(parsed.get("sentiment", "")).upper()
        if sentiment not in ("POSITIVE", "NEGATIVE", "NEUTRAL"):
            sentiment = _keyword_sentiment(feedback)

        category = str(parsed.get("category", ""))
        if category not in ("Teaching", "Course Content", "Behavior", "Infrastructure"):
            category = _keyword_category(feedback)

        return {"sentiment": sentiment, "category": category}

    except Exception as e:
        logger.warning(
            "[NLP] Gemini analysis failed (%s). Using keyword fallback.", e
        )
        return {
            "sentiment": _keyword_sentiment(feedback),
            "category": _keyword_category(feedback),
        }


# ============================
# Suggestion Generator
# (unchanged — pure Python, no models)
# ============================
def generate_suggestion(feedback, sentiment, category):
    feedback = feedback.lower()

    suggestions = {
        "Teaching": {
            "POSITIVE": [
                "Keep up the engaging and student-centered teaching style.",
                "Continue using real-life examples to explain concepts clearly.",
                "Your enthusiasm in class creates a great learning atmosphere.",
                "Maintain your effective pace and clarity during lectures.",
                "Students appreciate your interactive teaching — keep it up!",
            ],
            "NEGATIVE": [
                "Consider slowing down your teaching pace for better understanding.",
                "Try incorporating more interactive examples and student questions.",
                "Simplify complex concepts and provide summaries after each topic.",
                "Ensure all students are following before moving to next topics.",
                "Include visual aids or demos to make lessons more engaging.",
            ],
            "NEUTRAL": [
                "Maintain clarity and consistency in your teaching methods.",
                "Encourage more class participation to increase engagement.",
                "You can try short recaps to strengthen topic retention.",
                "Balance between theory and practical aspects for better grasp.",
                "Regular feedback sessions could help fine-tune delivery.",
            ],
        },
        "Course Content": {
            "POSITIVE": [
                "Course material seems well-structured and relevant.",
                "Keep providing up-to-date examples and case studies.",
                "Your course content is well-aligned with learning goals.",
                "Students find the materials helpful — maintain the quality.",
                "Continue enhancing the curriculum with real-world applications.",
            ],
            "NEGATIVE": [
                "Consider updating outdated topics to match current trends.",
                "Simplify overly complex modules to improve student understanding.",
                "Add more real-life or practical examples to theoretical content.",
                "Reorganize topics for smoother flow and clarity.",
                "Collect student feedback to identify confusing sections.",
            ],
            "NEUTRAL": [
                "You could add optional reading resources for deeper learning.",
                "Include short quizzes to reinforce key concepts.",
                "Maintain consistency across units and modules.",
                "Encourage collaborative activities tied to course objectives.",
                "Balance depth and breadth of topics effectively.",
            ],
        },
        "Behavior": {
            "POSITIVE": [
                "Your respectful communication makes students feel valued.",
                "Maintaining supportive behavior has built student trust.",
                "Keep your approachable and professional attitude.",
                "Students appreciate your empathy and understanding.",
                "Your positive interaction contributes to a good classroom culture.",
            ],
            "NEGATIVE": [
                "Work on improving tone and patience during discussions.",
                "Try to be more open to student opinions and feedback.",
                "Ensure respectful and calm communication at all times.",
                "Foster a more encouraging and motivating environment.",
                "Avoid showing frustration; instead, guide students patiently.",
            ],
            "NEUTRAL": [
                "Continue maintaining professional and consistent behavior.",
                "Balance assertiveness with empathy in student interactions.",
                "Encourage students to communicate concerns freely.",
                "Practice active listening to build stronger rapport.",
                "Keep focusing on constructive classroom communication.",
            ],
        },
        "Infrastructure": {
            "POSITIVE": [
                "Maintain the excellent facilities and cleanliness.",
                "Keep up the smooth operation of classroom equipment.",
                "Students appreciate the well-maintained learning environment.",
                "Continue ensuring a comfortable and resourceful atmosphere.",
                "Your management of lab/classroom facilities is commendable.",
            ],
            "NEGATIVE": [
                "Address maintenance issues promptly to improve facilities.",
                "Upgrade outdated lab equipment or classroom tools.",
                "Ensure proper lighting and seating arrangements.",
                "Improve access to digital tools and stable Wi-Fi.",
                "Check and resolve recurring infrastructure complaints quickly.",
            ],
            "NEUTRAL": [
                "Maintain consistency in facility upkeep and maintenance.",
                "Schedule regular infrastructure inspections to avoid issues.",
                "Provide clear reporting channels for maintenance requests.",
                "Ensure resource availability remains stable across semesters.",
                "Monitor classroom comfort and make small improvements regularly.",
            ],
        },
    }

    category_suggestions = suggestions.get(category, {})
    sentiment_suggestions = category_suggestions.get(sentiment, [])
    if not sentiment_suggestions:
        return "No suggestion available."
    return random.choice(sentiment_suggestions)


# ============================
# Alert Detection
# (unchanged — pure keyword matching)
# ============================
ALERT_KEYWORDS = [
    # English sensitive keywords
    "harassment", "discrimination", "unsafe", "abuse", "bullying", "violence",
    "threat", "intimidation", "humiliation", "insult", "verbal abuse",
    "offensive language", "inappropriate behavior", "sexual comment",
    "physical assault", "mental torture", "ragging", "teasing", "touching",
    "misconduct", "exploitation", "blackmail",
    # Hindi transliterated
    "bhedbhaav", "beizzati", "dhamki", "maar", "pitai", "dhakka",
    "chhedkhani", "gussa", "anuchit", "badtameezi", "galat harkat",
    "daraana", "dhoka", "apmaan", "sadakchaap", "pareshani", "apatti",
    "anadar", "zulm", "torture", "jhagda",
    # Marathi transliterated
    "trass", "pareshan", "maramari", "adharm", "apman",
    "upadrav", "chheda", "asurakshit", "ladhaai",
    "durvyavahar", "gairvyavahar", "ghatana", "traas",
    "vikar", "anaitik", "apratishtha", "badnami", "doka", "tanaav",
]

PROFANITY_KEYWORDS = [
    # Hindi/Urdu
    "madarchod", "behenchod", "behen chod", "mader chod", "mc", "bc",
    "chutiya", "chutiye", "gandu", "harami", "kamina", "kutta", "kutte",
    "saala", "saali", "randi", "bhosdi", "lodu", "laude", "gaandu",
    "bhenchod", "maa ki", "teri maa", "bhosdike", "chod", "chodu",
    # English
    "fuck", "fucking", "shit", "bitch", "bastard", "asshole", "dick",
    "pussy", "cunt", "whore", "slut", "motherfucker", "fucker",
    # Marathi
    "zhavadya", "zhavadi", "randya", "randichi", "pucchi",
    "ghaan", "lavdya", "takli", "jhavadya", "jhavadi",
    "aai", "aai chi", "aai la", "aaichi", "lavda", "lavde",
]


def detect_alert(feedback: str) -> bool:
    """Detect if feedback contains alert keywords."""
    feedback_lower = feedback.lower()
    return any(word in feedback_lower for word in ALERT_KEYWORDS)


def detect_profanity(feedback: str) -> bool:
    """Detect if feedback contains profanity."""
    feedback_lower = feedback.lower()
    return any(word in feedback_lower for word in PROFANITY_KEYWORDS)


def censor_profanity(text: str) -> str:
    """
    Censor profanity in text by replacing with asterisks.
    Example: 'madarchod' -> 'ma*******'
    """
    censored_text = text
    text_lower = text.lower()

    for profanity in PROFANITY_KEYWORDS:
        if profanity in text_lower:
            pattern = re.compile(re.escape(profanity), re.IGNORECASE)

            def replace_with_censored(match):
                word = match.group()
                if len(word) <= 2:
                    return '*' * len(word)
                return word[:2] + '*' * (len(word) - 2)

            censored_text = pattern.sub(replace_with_censored, censored_text)

    return censored_text


# ============================
# Gemini Summary
# (unchanged)
# ============================
def generate_summary(feedback_list: list) -> str:
    """Generate an overall summary of all feedback using Gemini."""
    prompt = (
        "Analyse the following feedback comments and write a natural, easy-to-understand "
        "summary in 2-3 lines describing the overall insights and suggestions:\n\n"
        + "\n".join(feedback_list)
    )
    try:
        model = _get_gemini_model()
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.warning("[NLP] Summary generation failed: %s", e)
        print(f"{Fore.RED}⚠️ Error generating summary via Gemini: {e}{Style.RESET_ALL}")
        return "Summary generation failed."


# ============================
# File Reader (CSV, XLSX, XLS, TSV)
# (unchanged)
# ============================
def read_feedback_file(input_file: str) -> pd.DataFrame:
    ext = os.path.splitext(input_file)[1].lower()
    if ext == ".csv":
        return pd.read_csv(input_file)
    elif ext in [".xlsx", ".xls"]:
        return pd.read_excel(input_file)
    elif ext == ".tsv":
        return pd.read_csv(input_file, sep="\t")
    else:
        raise ValueError("Unsupported file type. Please provide CSV, XLSX, XLS, or TSV.")


# ============================
# CSV/XLSX/TSV Processing
# ============================
def analyze_feedback_csv(
    input_file: str,
    feedback_column: str = "Feedback",
    output_file: str = "analyzed_feedback.csv",
):
    """
    Analyse a feedback file and write results to output_file.

    Sentiment and category are determined by a single Gemini API call per row
    (with keyword-based fallback).  No local ML models are loaded.
    """
    try:
        df = read_feedback_file(input_file)
    except Exception as e:
        print(f"{Fore.RED}⚠️ Failed to read input file: {e}{Style.RESET_ALL}")
        return None

    if feedback_column not in df.columns:
        print(f"{Fore.RED}Error: '{feedback_column}' column not found in input file.{Style.RESET_ALL}")
        return None

    # Add result columns
    df["Sentiment"] = ""
    df["Category"] = ""
    df["Suggestion"] = ""
    df["Alert"] = ""
    df["Censored_Feedback"] = ""
    df["Summary"] = ""

    print(f"\nProcessing {len(df)} feedback rows...\n")
    feedback_texts = []

    for idx, row in df.iterrows():
        feedback = str(row[feedback_column])
        feedback_texts.append(feedback)

        # --- Single Gemini call: sentiment + category ---
        analysis = _analyse_with_gemini(feedback)
        sentiment = analysis["sentiment"]
        category = analysis["category"]

        # Suggestion (pure Python)
        suggestion = generate_suggestion(feedback, sentiment, category)

        # Alert detection (pure keyword matching)
        alert_flag = detect_alert(feedback) or detect_profanity(feedback)
        alert_symbol = (
            f"{Fore.RED}❌ ALERT{Style.RESET_ALL}"
            if alert_flag
            else f"{Fore.GREEN}✅ OK{Style.RESET_ALL}"
        )

        # Censor profanity for storage
        censored_feedback = censor_profanity(feedback)

        # Fill row
        df.at[idx, "Sentiment"] = sentiment
        df.at[idx, "Category"] = category
        df.at[idx, "Suggestion"] = suggestion
        df.at[idx, "Alert"] = "Yes" if alert_flag else "No"
        df.at[idx, "Censored_Feedback"] = censored_feedback

        print("=" * 80)
        print(f"Feedback:   {feedback}")
        print(f"Sentiment → {sentiment}")
        print(f"Category  → {category}")
        print(f"Suggestion→ {suggestion}")
        print(f"Alert     → {alert_symbol}")
        print("=" * 80)

    # Overall summary via Gemini
    summary_text = generate_summary(feedback_texts)
    print(f"\n📝 Overall Summary from Gemini:\n{summary_text}\n")
    df["Summary"] = summary_text

    # Save results
    ext = os.path.splitext(output_file)[1].lower()
    try:
        if ext == ".csv":
            df.to_csv(output_file, index=False)
        elif ext in [".xlsx", ".xls"]:
            df.to_excel(output_file, index=False)
        elif ext == ".json":
            df.to_json(output_file, orient="records", indent=4)
        else:
            df.to_csv(output_file, index=False)
        print(f"\n✅ Analysis complete! Results saved to '{output_file}'")
    except Exception as e:
        print(f"{Fore.RED}⚠️ Failed to save output file: {e}{Style.RESET_ALL}")
        return None

    return {
        "status": "ok",
        "summary": summary_text,
        "output_file": output_file,
    }


# ============================
# Run Example
# ============================
if __name__ == "__main__":
    input_file = "student_feedback.xlsx"
    feedback_column = "Feedback"
    output_file = "analyzed_feedback.xlsx"
    analyze_feedback_csv(input_file, feedback_column, output_file)

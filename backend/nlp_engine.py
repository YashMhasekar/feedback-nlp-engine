import pandas as pd
from transformers import pipeline
import random
from colorama import Fore, Style, init
import os
import google.generativeai as genai

# Initialize colorama for colored terminal output
init(autoreset=True)

# ============================
# Configure Gemini API
# ============================
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
gemini_model = genai.GenerativeModel("models/gemini-2.5-flash")

# ============================
# Load NLP Models
# ============================
print("Loading NLP models...")

sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli"
)

print("✅ Models loaded successfully!\n")

# ============================
# Suggestion Generator
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
                "Students appreciate your interactive teaching — keep it up!"
            ],
            "NEGATIVE": [
                "Consider slowing down your teaching pace for better understanding.",
                "Try incorporating more interactive examples and student questions.",
                "Simplify complex concepts and provide summaries after each topic.",
                "Ensure all students are following before moving to next topics.",
                "Include visual aids or demos to make lessons more engaging."
            ],
            "NEUTRAL": [
                "Maintain clarity and consistency in your teaching methods.",
                "Encourage more class participation to increase engagement.",
                "You can try short recaps to strengthen topic retention.",
                "Balance between theory and practical aspects for better grasp.",
                "Regular feedback sessions could help fine-tune delivery."
            ]
        },
        "Course Content": {
            "POSITIVE": [
                "Course material seems well-structured and relevant.",
                "Keep providing up-to-date examples and case studies.",
                "Your course content is well-aligned with learning goals.",
                "Students find the materials helpful — maintain the quality.",
                "Continue enhancing the curriculum with real-world applications."
            ],
            "NEGATIVE": [
                "Consider updating outdated topics to match current trends.",
                "Simplify overly complex modules to improve student understanding.",
                "Add more real-life or practical examples to theoretical content.",
                "Reorganize topics for smoother flow and clarity.",
                "Collect student feedback to identify confusing sections."
            ],
            "NEUTRAL": [
                "You could add optional reading resources for deeper learning.",
                "Include short quizzes to reinforce key concepts.",
                "Maintain consistency across units and modules.",
                "Encourage collaborative activities tied to course objectives.",
                "Balance depth and breadth of topics effectively."
            ]
        },
        "Behavior": {
            "POSITIVE": [
                "Your respectful communication makes students feel valued.",
                "Maintaining supportive behavior has built student trust.",
                "Keep your approachable and professional attitude.",
                "Students appreciate your empathy and understanding.",
                "Your positive interaction contributes to a good classroom culture."
            ],
            "NEGATIVE": [
                "Work on improving tone and patience during discussions.",
                "Try to be more open to student opinions and feedback.",
                "Ensure respectful and calm communication at all times.",
                "Foster a more encouraging and motivating environment.",
                "Avoid showing frustration; instead, guide students patiently."
            ],
            "NEUTRAL": [
                "Continue maintaining professional and consistent behavior.",
                "Balance assertiveness with empathy in student interactions.",
                "Encourage students to communicate concerns freely.",
                "Practice active listening to build stronger rapport.",
                "Keep focusing on constructive classroom communication."
            ]
        },
        "Infrastructure": {
            "POSITIVE": [
                "Maintain the excellent facilities and cleanliness.",
                "Keep up the smooth operation of classroom equipment.",
                "Students appreciate the well-maintained learning environment.",
                "Continue ensuring a comfortable and resourceful atmosphere.",
                "Your management of lab/classroom facilities is commendable."
            ],
            "NEGATIVE": [
                "Address maintenance issues promptly to improve facilities.",
                "Upgrade outdated lab equipment or classroom tools.",
                "Ensure proper lighting and seating arrangements.",
                "Improve access to digital tools and stable Wi-Fi.",
                "Check and resolve recurring infrastructure complaints quickly."
            ],
            "NEUTRAL": [
                "Maintain consistency in facility upkeep and maintenance.",
                "Schedule regular infrastructure inspections to avoid issues.",
                "Provide clear reporting channels for maintenance requests.",
                "Ensure resource availability remains stable across semesters.",
                "Monitor classroom comfort and make small improvements regularly."
            ]
        }
    }

    category_suggestions = suggestions.get(category, {})
    sentiment_suggestions = category_suggestions.get(sentiment, [])
    
    if not sentiment_suggestions:
        return "No suggestion available."

    return random.choice(sentiment_suggestions)

# ============================
# Alert Detection
# ============================
# Alert Keywords - Multilingual (English, Hindi, Marathi)
ALERT_KEYWORDS = [
    # English sensitive keywords
    "harassment", "discrimination", "unsafe", "abuse", "bullying", "violence",
    "threat", "intimidation", "humiliation", "insult", "verbal abuse",
    "offensive language", "inappropriate behavior", "sexual comment",
    "physical assault", "mental torture", "ragging", "teasing", "touching",
    "misconduct", "exploitation", "blackmail",
    
    # Hindi transliterated sensitive words
    "bhedbhaav", "beizzati", "dhamki", "maar", "pitai", "dhakka",
    "chhedkhani", "gussa", "anuchit", "badtameezi", "galat harkat",
    "daraana", "dhoka", "apmaan", "sadakchaap", "pareshani", "apatti",
    "anadar", "zulm", "torture", "jhagda",
    
    # Marathi transliterated sensitive words
    "trass", "pareshan", "maramari", "adharm", "apman",
    "upadrav", "chheda", "asurakshit", "ladhaai",
    "durvyavahar", "gairvyavahar", "ghatana", "traas",
    "vikar", "anaitik", "apratishtha", "badnami", "doka", "tanaav"
]

# Profanity/Abusive words to censor (add more as needed)
PROFANITY_KEYWORDS = [
    # Hindi/Urdu profanity
    "madarchod", "behenchod", "behen chod", "mader chod", "mc", "bc",
    "chutiya", "chutiye", "gandu", "harami", "kamina", "kutta", "kutte",
    "saala", "saali", "randi", "bhosdi", "lodu", "laude", "gaandu",
    "bhenchod", "maa ki", "teri maa", "bhosdike", "chod", "chodu",
    
    # English profanity
    "fuck", "fucking", "shit", "bitch", "bastard", "asshole", "dick",
    "pussy", "cunt", "whore", "slut", "motherfucker", "fucker",
    
    # Marathi profanity
    "zhavadya", "zhavadi", "randya", "randichi", "pucchi",
    "ghaan", "lavdya", "takli", "jhavadya", "jhavadi",
    "aai", "aai chi", "aai la", "aaichi", "lavda", "lavde"
]

def detect_alert(feedback):
    """Detect if feedback contains alert keywords"""
    feedback_lower = feedback.lower()
    for word in ALERT_KEYWORDS:
        if word in feedback_lower:
            return True
    return False

def detect_profanity(feedback):
    """Detect if feedback contains profanity"""
    feedback_lower = feedback.lower()
    for word in PROFANITY_KEYWORDS:
        if word in feedback_lower:
            return True
    return False

def censor_profanity(text):
    """
    Censor profanity in text by replacing with asterisks
    Example: "madarchod" -> "ma********"
    """
    censored_text = text
    text_lower = text.lower()
    
    for profanity in PROFANITY_KEYWORDS:
        if profanity in text_lower:
            # Find all occurrences (case-insensitive)
            import re
            pattern = re.compile(re.escape(profanity), re.IGNORECASE)
            
            def replace_with_censored(match):
                word = match.group()
                if len(word) <= 2:
                    return '*' * len(word)
                # Keep first 2 characters, replace rest with asterisks
                return word[:2] + '*' * (len(word) - 2)
            
            censored_text = pattern.sub(replace_with_censored, censored_text)
    
    return censored_text

# ============================
# Gemini Summary
# ============================
def generate_summary(feedback_list):
    prompt = (
        "Analyze the following feedback comments and write a natural, easy-to-understand "
        "summary in 2-3 lines describing the overall insights and suggestions:\n\n"
        + "\n".join(feedback_list)
    )
    try:
        response = gemini_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"{Fore.RED}⚠️ Error generating summary via Gemini: {e}{Style.RESET_ALL}")
        return "Summary generation failed."

# ============================
# File Reader (CSV, XLSX, XLS, TSV)
# ============================
def read_feedback_file(input_file):
    ext = os.path.splitext(input_file)[1].lower()
    if ext == ".csv":
        df = pd.read_csv(input_file)
    elif ext in [".xlsx", ".xls"]:
        df = pd.read_excel(input_file)
    elif ext == ".tsv":
        df = pd.read_csv(input_file, sep="\t")
    else:
        raise ValueError("Unsupported file type. Please provide CSV, XLSX, XLS, or TSV.")
    return df

# ============================
# CSV/XLSX/TSV Processing
# ============================
def analyze_feedback_csv(input_file, feedback_column="Feedback", output_file="analyzed_feedback.csv"):
    try:
        df = read_feedback_file(input_file)
    except Exception as e:
        print(f"{Fore.RED}⚠️ Failed to read input file: {e}{Style.RESET_ALL}")
        return

    if feedback_column not in df.columns:
        print(f"{Fore.RED}Error: '{feedback_column}' column not found in input file.{Style.RESET_ALL}")
        return

    candidate_labels = ["Teaching", "Course Content", "Behavior", "Infrastructure"]

    # Add new columns
    df["Sentiment"] = ""
    df["Category"] = ""
    df["Suggestion"] = ""
    df["Alert"] = ""
    df["Summary"] = ""

    print(f"\nProcessing {len(df)} feedback rows...\n")
    feedback_texts = []

    for idx, row in df.iterrows():
        feedback = str(row[feedback_column])
        feedback_texts.append(feedback)

        # Sentiment
        sentiment = sentiment_analyzer(feedback)[0]["label"]

        # Category
        category = classifier(feedback, candidate_labels)["labels"][0]

        # Suggestion
        suggestion = generate_suggestion(feedback, sentiment, category)

        # Alert detection (sensitive keywords OR profanity)
        alert_flag = detect_alert(feedback) or detect_profanity(feedback)
        alert_symbol = f"{Fore.RED}❌ ALERT{Style.RESET_ALL}" if alert_flag else f"{Fore.GREEN}✅ OK{Style.RESET_ALL}"
        
        # Censor profanity in feedback for storage
        censored_feedback = censor_profanity(feedback)

        # Fill new columns
        df.at[idx, "Sentiment"] = sentiment
        df.at[idx, "Category"] = category
        df.at[idx, "Suggestion"] = suggestion
        df.at[idx, "Alert"] = "Yes" if alert_flag else "No"
        df.at[idx, "Censored_Feedback"] = censored_feedback  # Add censored version

        # Print feedback summary in terminal
        print("="*80)
        print(f"Feedback: {feedback}")
        print(f"Sentiment → {sentiment}")
        print(f"Category → {category}")
        print(f"Suggestion → {suggestion}")
        print(f"Alert → {alert_symbol}")
        print("="*80)

    # Generate overall Gemini summary
    summary_text = generate_summary(feedback_texts)
    print(f"\n📝 Overall Summary from Gemini:\n{summary_text}\n")

    # Fill the summary column with the same overall summary
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
    
    # Return result with summary for API usage
    return {
        "status": "ok",
        "summary": summary_text,
        "output_file": output_file
    }

# ============================
# Run Example
# ============================
if __name__ == "__main__":
    input_file = "student_feedback.xlsx"   # Can be CSV, XLSX, XLS, TSV
    feedback_column = "Feedback"
    output_file = "analyzed_feedback.xlsx"  # Can be CSV, XLSX, JSON

    analyze_feedback_csv(input_file, feedback_column, output_file)

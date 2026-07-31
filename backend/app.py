from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import pandas as pd
import os
import sys
from dotenv import load_dotenv
from database import init_db
from feedback_database import init_feedback_db, save_feedback_analysis
from alerts_database import init_alerts_db, save_alert
from student_feedback_database import init_student_feedback_db, save_student_feedback
from analyze_wrapper import run_nlp_analysis
from auth import auth_bp
from admin_api import admin_bp
from analytics_api import analytics_bp
from alerts_api import alerts_api_bp

# Load environment variables from .env file
load_dotenv()

# Initialize databases on startup
init_db()  # Authentication database
init_feedback_db()  # Feedback analysis database
init_alerts_db()  # Alerts database
init_student_feedback_db()  # Student feedback submissions database

# Import NLP engine
from nlp_engine import analyze_feedback_csv
    print("✓ Successfully imported analyze_feedback_csv from nlp_test.py")
    
    # Check if Gemini API key is configured
    api_key = os.environ.get("GOOGLE_API_KEY")
    if api_key and api_key != "your_api_key_here":
        print("✓ Gemini API key loaded successfully")
    else:
        print("⚠️  WARNING: Gemini API key not configured!")
        print("   Set GOOGLE_API_KEY in .env file for AI summary generation")
except ImportError:
    print("⚠ Warning: nlp_test.py not found. Using mock function for testing.")
    
    def analyze_feedback_csv(input_file, feedback_column, output_file):
        """
        Mock function for testing when nlp_test.py is not available
        Creates a properly formatted analyzed CSV file
        """
        import pandas as pd
        import random
        
        print(f"[MOCK] Reading input file: {input_file}")
        
        # Read the input CSV
        df = pd.read_csv(input_file)
        
        print(f"[MOCK] Processing {len(df)} feedback entries")
        
        # Add analysis columns
        sentiments = []
        categories = []
        suggestions = []
        alerts = []
        
        for idx, row in df.iterrows():
            feedback = str(row.get(feedback_column, ""))
            
            # Simple sentiment analysis based on keywords
            feedback_lower = feedback.lower()
            if any(word in feedback_lower for word in ['excellent', 'great', 'good', 'love', 'helpful', 'best']):
                sentiment = "POSITIVE"
                suggestion = "Continue with current teaching methods."
            elif any(word in feedback_lower for word in ['bad', 'poor', 'difficult', 'slow', 'need', 'too']):
                sentiment = "NEGATIVE"
                suggestion = "Address the concerns raised by students."
            else:
                sentiment = "NEUTRAL"
                suggestion = "Monitor feedback for improvements."
            
            # Categorize based on keywords
            if any(word in feedback_lower for word in ['teach', 'professor', 'lecture', 'explain']):
                category = "Teaching"
            elif any(word in feedback_lower for word in ['lab', 'equipment', 'computer', 'classroom']):
                category = "Infrastructure"
            elif any(word in feedback_lower for word in ['assignment', 'project', 'deadline', 'work']):
                category = "Coursework"
            elif any(word in feedback_lower for word in ['content', 'course', 'material']):
                category = "Course Content"
            else:
                category = "General"
            
            # Check for alerts
            alert = any(word in feedback_lower for word in ['harassment', 'unsafe', 'discrimination', 'threat'])
            
            sentiments.append(sentiment)
            categories.append(category)
            suggestions.append(suggestion)
            alerts.append(alert)
        
        # Add columns to dataframe
        df['Sentiment'] = sentiments
        df['Category'] = categories
        df['Suggestion'] = suggestions
        df['Alert'] = alerts
        
        # Save to output file
        df.to_csv(output_file, index=False)
        print(f"[MOCK] Saved analyzed file to: {output_file}")
        
        # Calculate stats
        sentiment_counts = pd.Series(sentiments).value_counts().to_dict()
        
        # Return result
        return {
            "status": "ok",
            "summary": f"Analysis completed successfully. Processed {len(df)} feedback entries. Overall sentiment is mostly positive with some areas for improvement in infrastructure and coursework.",
            "stats": {
                "total": len(df),
                "positive": sentiment_counts.get("POSITIVE", 0),
                "neutral": sentiment_counts.get("NEUTRAL", 0),
                "negative": sentiment_counts.get("NEGATIVE", 0),
                "alerts": sum(alerts)
            },
            "analyzed_file": output_file
        }

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
# Increase JWT token expiration to 24 hours (default is 15 minutes)
from datetime import timedelta
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
CORS(app, 
     origins=['http://localhost:4010', 'http://localhost:3011', 'http://localhost:3000'],
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(alerts_api_bp)

# Upload configuration
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls', 'tsv'}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/api/submit_feedback", methods=["POST"])
def submit_feedback():
    """
    Student feedback submission endpoint
    Accepts: JSON with student_id, course, faculty, feedback
    Returns: Analysis results
    """
    print("\n" + "="*60)
    print("📥 NEW STUDENT FEEDBACK SUBMISSION")
    print("="*60)
    
    try:
        data = request.json
        
        # Validate required fields
        required = ["student_id", "course", "faculty", "feedback"]
        if not all(field in data for field in required):
            missing = [f for f in required if f not in data]
            return jsonify({
                "status": "error",
                "message": f"Missing required fields: {', '.join(missing)}"
            }), 400
        
        print(f"Student: {data['student_id']}")
        print(f"Course: {data['course']}")
        print(f"Faculty: {data['faculty']}")
        print(f"Feedback: {data['feedback'][:100]}...")
        
        # Step 1: Save to student_feedback database
        print("\n1️⃣ Saving to student_feedback.db...")
        feedback_id = save_student_feedback(
            student_id=data['student_id'],
            course=data['course'],
            faculty=data['faculty'],
            feedback=data['feedback']
        )
        print(f"   ✓ Saved with ID: {feedback_id}")
        
        # Step 2: Prepare for NLP analysis
        print("\n2️⃣ Preparing for NLP analysis...")
        feedback_list = [{
            'id': feedback_id,
            'student_id': data['student_id'],
            'course': data['course'],
            'faculty': data['faculty'],
            'feedback': data['feedback']
        }]
        
        # Step 3: Run NLP analysis
        print("\n3️⃣ Running NLP analysis...")
        try:
            results = run_nlp_analysis(feedback_list)
            
            if not results:
                raise Exception("No results returned from NLP analysis")
            
            result = results[0]
            print(f"   ✓ Analysis complete")
            print(f"   Sentiment: {result['sentiment']}")
            print(f"   Category: {result['category']}")
            print(f"   Alert: {result['alert']}")
            
        except Exception as nlp_error:
            print(f"   ❌ NLP analysis failed: {nlp_error}")
            return jsonify({
                "status": "error",
                "message": f"Analysis failed: {str(nlp_error)}"
            }), 500
        
        # Step 4: Save to feedback_analysis database
        print("\n4️⃣ Saving analysis to feedback_analysis.db...")
        
        # Get faculty ID (try to find in users table)
        faculty_id = 1  # Default
        try:
            from database import get_db_connection
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id FROM users 
                WHERE LOWER(first_name || ' ' || last_name) = LOWER(?)
                OR LOWER(email) LIKE LOWER(?)
            ''', (data['faculty'], f"%{data['faculty']}%"))
            user = cursor.fetchone()
            if user:
                faculty_id = user['id']
            conn.close()
        except:
            pass
        
        # Save analysis result
        analysis_data = [{
            'student_id': result['student_id'],
            'course': data['course'],
            'faculty_name': data['faculty'],
            'feedback': result['censored_feedback'],
            'sentiment': result['sentiment'],
            'category': result['category'],
            'suggestion': result['suggestion'],
            'summary': result['summary'],
            'alert': result['alert']
        }]
        
        saved_count = save_feedback_analysis(faculty_id, analysis_data)
        print(f"   ✓ Saved {saved_count} analysis record")
        
        # Step 5: Create alert if needed
        if result['alert']:
            print("\n5️⃣ Creating alert...")
            try:
                # Determine alert keywords
                feedback_lower = data['feedback'].lower()
                alert_keywords = []
                
                for keyword in ["harassment", "discrimination", "unsafe", "abuse", "bullying", "threat", "violence"]:
                    if keyword in feedback_lower:
                        alert_keywords.append(keyword)
                
                # Check for profanity
                profanity_found = any(word in feedback_lower for word in [
                    "madarchod", "behenchod", "chutiya", "fuck", "shit"
                ])
                if profanity_found:
                    alert_keywords.append("profanity")
                
                # Get faculty details
                faculty_name = data['faculty']
                faculty_email = "unknown@university.edu"
                faculty_dept = "Unknown"
                
                try:
                    conn = get_db_connection()
                    cursor = conn.cursor()
                    cursor.execute('SELECT first_name, last_name, email, department FROM users WHERE id = ?', (faculty_id,))
                    faculty_user = cursor.fetchone()
                    conn.close()
                    
                    if faculty_user:
                        faculty_name = f"{faculty_user['first_name']} {faculty_user['last_name']}"
                        faculty_email = faculty_user['email']
                        faculty_dept = faculty_user['department']
                except:
                    pass
                
                alert_id = save_alert(
                    faculty_id=faculty_id,
                    faculty_name=faculty_name,
                    faculty_email=faculty_email,
                    department=faculty_dept,
                    student_id=result['student_id'],
                    feedback_text=result['censored_feedback'],
                    sentiment=result['sentiment'],
                    category=result['category'],
                    alert_keywords=', '.join(alert_keywords) if alert_keywords else 'flagged',
                    priority='High'
                )
                print(f"   ✓ Alert created with ID: {alert_id}")
            except Exception as alert_error:
                print(f"   ⚠️ Alert creation failed: {alert_error}")
        
        print("\n" + "="*60)
        print("✅ FEEDBACK SUBMISSION COMPLETE")
        print("="*60 + "\n")
        
        return jsonify({
            "status": "ok",
            "message": "Feedback submitted and analyzed successfully",
            "feedback_id": feedback_id,
            "analysis": {
                "sentiment": result['sentiment'],
                "category": result['category'],
                "alert": result['alert']
            }
        }), 200
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": f"An error occurred: {str(e)}"
        }), 500

@app.route("/", methods=["GET"])
def home():
    """Root endpoint - API documentation"""
    return jsonify({
        "status": "ok",
        "message": "Student Feedback Analysis API",
        "version": "1.0.0",
        "endpoints": {
            "health": {
                "url": "/api/health",
                "method": "GET",
                "description": "Check if the API is running"
            },
            "signup": {
                "url": "/api/signup",
                "method": "POST",
                "description": "Register a new user (admin or faculty)"
            },
            "login": {
                "url": "/api/login",
                "method": "POST",
                "description": "Login with email and password"
            },
            "me": {
                "url": "/api/me",
                "method": "GET",
                "description": "Get current user info (requires JWT token)"
            },
            "analyze": {
                "url": "/api/analyze-feedback",
                "method": "POST",
                "description": "Upload and analyze feedback CSV file",
                "accepts": "multipart/form-data with 'file' field"
            },
            "download": {
                "url": "/api/download-analyzed?file=<filepath>",
                "method": "GET",
                "description": "Download analyzed CSV file"
            },
            "test": {
                "url": "/api/test-read-analyzed",
                "method": "GET",
                "description": "Test reading analyzed file"
            }
        },
        "frontend_url": "http://localhost:4010",
        "cors_enabled": True
    }), 200

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Flask backend is running"}), 200

@app.route("/api/analyze-feedback", methods=["POST"])
def analyze_feedback():
    """
    Endpoint to analyze feedback file
    Accepts: CSV, XLSX, XLS, TSV files
    Returns: Analysis results with sentiment, category, suggestions, and alerts
    """
    print("\n" + "="*60)
    print("📥 NEW REQUEST: Analyze Feedback")
    print("="*60)
    
    try:
        # 1️⃣ Check if file is present in request
        if "file" not in request.files:
            return jsonify({
                "status": "error",
                "message": "No file uploaded. Please select a file."
            }), 400
        
        file = request.files["file"]
        
        # Check if filename is empty
        if file.filename == "":
            return jsonify({
                "status": "error",
                "message": "No file selected. Please choose a file."
            }), 400
        
        # 2️⃣ Validate file extension
        if not allowed_file(file.filename):
            return jsonify({
                "status": "error",
                "message": f"Unsupported file format. Please upload CSV, XLSX, XLS, or TSV files only."
            }), 400
        
        # 3️⃣ Save uploaded file
        filename = file.filename
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        print(f"✓ File saved: {filepath}")
        print(f"✓ File size: {os.path.getsize(filepath)} bytes")
        
        # 4️⃣ Prepare output file path
        output_filename = f"analyzed_{filename}"
        if not output_filename.endswith('.csv'):
            output_filename = output_filename.rsplit('.', 1)[0] + '.csv'
        output_filepath = os.path.join(UPLOAD_FOLDER, output_filename)
        
        # 5️⃣ Run NLP analysis
        print(f"\n🔍 Starting analysis...")
        print(f"   Input file: {filepath}")
        print(f"   Output file: {output_filepath}")
        
        # Read input file to check structure
        try:
            input_df = pd.read_csv(filepath)
            print(f"✓ Input file loaded. Shape: {input_df.shape}")
            print(f"✓ Columns: {list(input_df.columns)}")
        except Exception as e:
            print(f"❌ Error reading input file: {e}")
        
        # Determine feedback column name (you can make this configurable)
        feedback_column = "Feedback"  # Default column name
        
        # Call the NLP engine
        print(f"⚙️  Calling analyze_feedback_csv with column: {feedback_column}")
        result = analyze_feedback_csv(filepath, feedback_column, output_filepath)
        
        print(f"✅ Analysis completed successfully")
        print(f"   Result type: {type(result)}")
        print(f"   Result value: {result}")
        
        # Ensure result is a dict
        if not isinstance(result, dict):
            result = {
                "status": "ok",
                "summary": "Analysis completed successfully. The feedback has been processed and categorized."
            }
        
        # 6️⃣ Read the analyzed CSV file and prepare response
        try:
            print(f"\n📊 Reading analyzed file: {output_filepath}")
            
            # Check if file exists
            if not os.path.exists(output_filepath):
                print(f"ERROR: Analyzed file not found at {output_filepath}")
                print(f"Looking in directory: {os.path.dirname(output_filepath)}")
                print(f"Files in directory: {os.listdir(os.path.dirname(output_filepath)) if os.path.exists(os.path.dirname(output_filepath)) else 'Directory not found'}")
                raise FileNotFoundError(f"Analyzed file not found: {output_filepath}")
            
            analyzed_df = pd.read_csv(output_filepath)
            print(f"✓ Analyzed file loaded successfully")
            print(f"  Shape: {analyzed_df.shape}")
            print(f"  Columns: {list(analyzed_df.columns)}")
            
            # Convert DataFrame to list of dictionaries
            rows = []
            for idx, row in analyzed_df.iterrows():
                # Handle different column name variations - pandas Series.get() works differently
                def get_col_value(row, *col_names, default=""):
                    """Try multiple column names and return first found value"""
                    for col in col_names:
                        if col in row.index and pd.notna(row[col]):
                            return row[col]
                    return default
                
                student_id = get_col_value(row, "Student_ID", "student_id", "StudentID", default=f"S{idx+1}")
                feedback = get_col_value(row, "Feedback", "feedback", default="")
                censored_feedback = get_col_value(row, "Censored_Feedback", "censored_feedback", default=feedback)
                sentiment = get_col_value(row, "Sentiment", "sentiment", default="NEUTRAL")
                category = get_col_value(row, "Category", "category", default="General")
                suggestion = get_col_value(row, "Suggestion", "suggestion", default="No suggestion available")
                alert = get_col_value(row, "Alert", "alert", default="No")
                
                # Convert alert to boolean
                if isinstance(alert, str):
                    alert_lower = str(alert).lower()
                    alert = alert_lower in ['true', 'yes', '1', 'alert', 'y']
                elif pd.isna(alert):
                    alert = False
                else:
                    alert = bool(alert)
                
                row_data = {
                    "student_id": str(student_id),
                    "feedback": str(feedback),
                    "censored_feedback": str(censored_feedback),  # Add censored version
                    "sentiment": str(sentiment).upper(),
                    "category": str(category),
                    "suggestion": str(suggestion),
                    "alert": bool(alert)
                }
                rows.append(row_data)
            
            print(f"✓ Converted {len(rows)} rows to dictionary format")
            
            # Debug: Show alert status for each row
            alerts_in_rows = [r for r in rows if r.get('alert', False)]
            print(f"   Rows with alert=True: {len(alerts_in_rows)}")
            if len(alerts_in_rows) > 0:
                print(f"   Alert students: {[r.get('student_id') for r in alerts_in_rows]}")
            
            # 7️⃣ Extract summary FIRST (before database save)
            summary = None
            
            # First, try to get summary from the result dict (returned by analyze_feedback_csv)
            if isinstance(result, dict) and "summary" in result:
                summary = result.get("summary")
                print(f"✓ Got AI summary from NLP result")
            
            # If not in result, try to get from the Summary column in the analyzed CSV
            if not summary and "Summary" in analyzed_df.columns:
                summary_col = analyzed_df["Summary"].iloc[0] if len(analyzed_df) > 0 else None
                if summary_col and pd.notna(summary_col) and str(summary_col).strip():
                    summary = str(summary_col).strip()
                    print(f"✓ Got AI summary from CSV Summary column")
            
            # Fallback to default summary
            if not summary:
                summary = "Analysis completed successfully. The feedback has been processed and categorized."
                print(f"⚠️  Using fallback summary (no AI summary found)")
            
            print(f"📝 Summary preview: {summary[:100]}...")
            
            # 8️⃣ Save to feedback analysis database with extracted summary
            try:
                from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
                
                # Try to get faculty_id from JWT token
                faculty_id = None
                faculty_name = None
                faculty_email = None
                faculty_dept = None
                
                try:
                    verify_jwt_in_request(optional=True)
                    user_id = get_jwt_identity()
                    if user_id:
                        faculty_id = int(user_id)
                        print(f"✓ Got faculty_id from JWT: {faculty_id}")
                        
                        # Get faculty details for alerts
                        from database import get_db_connection
                        conn = get_db_connection()
                        cursor = conn.cursor()
                        cursor.execute('SELECT first_name, last_name, email, department FROM users WHERE id = ?', (faculty_id,))
                        faculty_user = cursor.fetchone()
                        conn.close()
                        
                        if faculty_user:
                            faculty_name = f"{faculty_user['first_name']} {faculty_user['last_name']}"
                            faculty_email = faculty_user['email']
                            faculty_dept = faculty_user['department']
                except:
                    print("⚠️  No JWT token found, using default faculty_id")
                    # If no token, try to get from request or use a default
                    faculty_id = request.form.get('faculty_id', 1)  # Default to 1 if not provided
                
                if not faculty_id:
                    print("⚠️  WARNING: No faculty_id available, skipping database save")
                    raise ValueError("No faculty_id available")
                
                # If faculty info not retrieved (no JWT), get it from database using faculty_id
                if not faculty_name or not faculty_email:
                    try:
                        from database import get_db_connection
                        conn = get_db_connection()
                        cursor = conn.cursor()
                        cursor.execute('SELECT first_name, last_name, email, department FROM users WHERE id = ?', (faculty_id,))
                        faculty_user = cursor.fetchone()
                        conn.close()
                        
                        if faculty_user:
                            faculty_name = f"{faculty_user['first_name']} {faculty_user['last_name']}"
                            faculty_email = faculty_user['email']
                            faculty_dept = faculty_user['department']
                            print(f"✓ Retrieved faculty info for ID {faculty_id}: {faculty_name}")
                        else:
                            # Use default values if user not found
                            faculty_name = "Unknown Faculty"
                            faculty_email = "unknown@university.edu"
                            faculty_dept = "Unknown"
                            print(f"⚠️  Faculty ID {faculty_id} not found, using default values")
                    except Exception as e:
                        print(f"⚠️  Error retrieving faculty info: {e}")
                        faculty_name = "Unknown Faculty"
                        faculty_email = "unknown@university.edu"
                        faculty_dept = "Unknown"
                
                # Prepare data for saving - add summary to each row
                feedback_data_with_summary = []
                alerts_detected = []
                
                for row in rows:
                    row_with_summary = row.copy()
                    row_with_summary['summary'] = summary  # Add overall summary
                    feedback_data_with_summary.append(row_with_summary)
                    
                    # Check if this feedback has an alert
                    if row.get('alert', False):
                        alerts_detected.append(row)
                
                # Save to feedback analysis database
                print(f"\n💾 Saving {len(feedback_data_with_summary)} entries to feedback_analysis.db...")
                saved_count = save_feedback_analysis(faculty_id, feedback_data_with_summary)
                
                print(f"✅ Successfully saved {saved_count}/{len(rows)} feedback entries to feedback_analysis.db")
                
                # 9️⃣ Save alerts to alerts database
                print(f"\n🔍 Alert check: {len(alerts_detected)} alerts detected")
                print(f"   Faculty ID: {faculty_id}")
                print(f"   Faculty name: {faculty_name}")
                print(f"   Faculty email: {faculty_email}")
                print(f"   Faculty dept: {faculty_dept}")
                
                if len(alerts_detected) > 0:
                    print(f"   Alert details:")
                    for i, alert in enumerate(alerts_detected):
                        print(f"     Alert {i+1}: Student {alert.get('student_id')}, Alert={alert.get('alert')}")
                
                if alerts_detected and faculty_name and faculty_email:
                    print(f"\n🚨 Detected {len(alerts_detected)} alerts! Saving to alerts database...")
                    saved_alerts_count = 0
                    
                    for idx, alert_row in enumerate(alerts_detected):
                        print(f"\n   Processing alert {idx+1}/{len(alerts_detected)}...")
                        try:
                            # Determine alert keywords (check original feedback for keywords)
                            feedback_lower = alert_row.get('feedback', '').lower()
                            alert_keywords = []
                            
                            # Check for sensitive keywords (English, Hindi, Marathi)
                            sensitive_keywords = [
                                # English sensitive keywords
                                "harassment", "discrimination", "unsafe", "abuse", "bullying", "violence",
                                "threat", "intimidation", "humiliation", "insult", "verbal abuse",
                                "offensive language", "inappropriate behavior", "sexual comment",
                                "physical assault", "mental torture", "ragging", "teasing", "touching",
                                "misconduct", "exploitation", "blackmail",
                                
                                # Hindi transliterated sensitive words
                                "bhedbhaav", "beizzati", "dhamki", "maar", "pitai", "dhakka",
                                "chhedkhani", "gussa", "behaviour", "anuchit", "badtameezi", "galat harkat",
                                "daraana", "dhoka", "apmaan", "sadakchaap", "pareshani", "apatti",
                                "anadar", "zulm", "torture", "jhagda",
                                
                                # Marathi transliterated sensitive words
                                "trass", "pareshan", "maramari", "adharm", "apman",
                                "upadrav", "chheda", "asurakshit", "ladhaai",
                                "durvyavahar", "gairvyavahar", "ghatana", "bhedbhaav", "traas",
                                "vikar", "anaitik", "apratishtha", "badnami", "doka", "tanaav"
                            ]
                            
                            for keyword in sensitive_keywords:
                                if keyword in feedback_lower:
                                    alert_keywords.append(keyword)
                            
                            # Check for profanity (Hindi, English, Marathi)
                            profanity_found = any(word in feedback_lower for word in [
                                # Hindi/Urdu profanity
                                "madarchod", "behenchod", "chutiya", "gandu", "harami",
                                "kamina", "kutta", "saala", "randi", "bhosdi", "lodu",
                                
                                # English profanity
                                "fuck", "fucking", "shit", "bitch", "bastard", "asshole",
                                
                                # Marathi profanity
                                "zhavadya", "zhavadi", "randya", "randichi", "pucchi",
                                "ghaan", "lavdya", "takli"
                            ])
                            
                            if profanity_found:
                                alert_keywords.append("profanity")
                            
                            print(f"      Keywords found: {alert_keywords}")
                            print(f"      Calling save_alert...")
                            
                            # Use censored feedback for display
                            display_feedback = alert_row.get('censored_feedback', alert_row.get('feedback', ''))
                            
                            alert_id = save_alert(
                                faculty_id=faculty_id,
                                faculty_name=faculty_name,
                                faculty_email=faculty_email,
                                department=faculty_dept or 'Unknown',
                                student_id=alert_row.get('student_id', 'Unknown'),
                                feedback_text=display_feedback,  # Use censored version
                                sentiment=alert_row.get('sentiment', 'NEGATIVE'),
                                category=alert_row.get('category', 'Behavior'),
                                alert_keywords=', '.join(alert_keywords) if alert_keywords else 'flagged',
                                priority='High'
                            )
                            print(f"      ✓ Saved alert #{alert_id} for student {alert_row.get('student_id')}")
                            saved_alerts_count += 1
                        except Exception as alert_error:
                            print(f"      ❌ Error saving alert: {alert_error}")
                            import traceback
                            traceback.print_exc()
                    
                    print(f"\n✅ Successfully saved {saved_alerts_count}/{len(alerts_detected)} alerts to alerts database")
                else:
                    if len(alerts_detected) > 0:
                        print(f"\n⚠️  WARNING: {len(alerts_detected)} alerts detected but NOT saved!")
                        print(f"   Reason: faculty_name={faculty_name}, faculty_email={faculty_email}")
                    else:
                        print(f"\n✓ No alerts detected in this batch")
                
            except Exception as db_error:
                print(f"❌ ERROR: Could not save to database: {db_error}")
                import traceback
                traceback.print_exc()
                print("   Analysis results will still be returned, but won't appear in Trends & Insights")
            
            # 9️⃣ Calculate stats - try different column name variations
            sentiment_col = None
            for col in ["Sentiment", "sentiment", "SENTIMENT"]:
                if col in analyzed_df.columns:
                    sentiment_col = col
                    break
            
            if sentiment_col:
                sentiments = analyzed_df[sentiment_col].str.upper().value_counts().to_dict()
                print(f"✓ Sentiment distribution: {sentiments}")
            else:
                print("⚠️  WARNING: No sentiment column found")
                sentiments = {}
            
            # Check for alerts
            alert_col = None
            for col in ["Alert", "alert", "ALERT"]:
                if col in analyzed_df.columns:
                    alert_col = col
                    break
            
            if alert_col:
                # Convert alert column to boolean before summing
                alert_series = analyzed_df[alert_col].astype(str).str.lower()
                alerts_count = alert_series.isin(['true', 'yes', '1', 'alert', 'y']).sum()
            else:
                alerts_count = 0
            
            # Prepare final result
            # Convert backslashes to forward slashes for URL
            download_path = output_filepath.replace("\\", "/")
            
            final_result = {
                "status": "ok",
                "summary": summary,
                "stats": {
                    "total": len(analyzed_df),
                    "positive": int(sentiments.get("POSITIVE", 0)),
                    "neutral": int(sentiments.get("NEUTRAL", 0)),
                    "negative": int(sentiments.get("NEGATIVE", 0)),
                    "alerts": int(alerts_count)
                },
                "rows": rows,
                "analyzed_file": output_filepath,
                "download_url": f"/api/download-analyzed?file={download_path}"
            }
            
            print(f"\n📈 RESULTS:")
            print(f"   Total: {final_result['stats']['total']}")
            print(f"   Positive: {final_result['stats']['positive']}")
            print(f"   Neutral: {final_result['stats']['neutral']}")
            print(f"   Negative: {final_result['stats']['negative']}")
            print(f"   Alerts: {final_result['stats']['alerts']}")
            print(f"✅ Returning {len(rows)} analyzed rows")
            print("="*60 + "\n")
            return jsonify(final_result), 200
            
        except Exception as read_error:
            import traceback
            print(f"❌ ERROR reading analyzed file: {str(read_error)}")
            print(f"Full traceback:")
            traceback.print_exc()
            print(f"\n🔍 DEBUG INFO:")
            print(f"   Output file path: {output_filepath}")
            print(f"   File exists: {os.path.exists(output_filepath)}")
            if os.path.exists(output_filepath):
                print(f"   File size: {os.path.getsize(output_filepath)} bytes")
                try:
                    test_df = pd.read_csv(output_filepath)
                    print(f"   Can read file: Yes")
                    print(f"   Rows: {len(test_df)}")
                    print(f"   Columns: {list(test_df.columns)}")
                except Exception as e:
                    print(f"   Can read file: No - {e}")
            
            # Return error instead of empty result
            return jsonify({
                "status": "error",
                "message": f"Error processing analyzed file: {str(read_error)}",
                "debug": {
                    "file_path": output_filepath,
                    "file_exists": os.path.exists(output_filepath)
                }
            }), 500
    
    except FileNotFoundError as e:
        return jsonify({
            "status": "error",
            "message": f"File processing error: {str(e)}"
        }), 500
    
    except pd.errors.EmptyDataError:
        return jsonify({
            "status": "error",
            "message": "The uploaded file is empty. Please upload a file with data."
        }), 400
    
    except KeyError as e:
        return jsonify({
            "status": "error",
            "message": f"Column not found: {str(e)}. Please ensure your file has a 'Feedback' column."
        }), 400
    
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"An error occurred during analysis: {str(e)}"
        }), 500

@app.route("/api/test-read-analyzed", methods=["GET"])
def test_read_analyzed():
    """Test endpoint to verify we can read the analyzed file"""
    try:
        import pandas as pd
        filepath = "uploads/analyzed_student_feedback.csv"
        
        if not os.path.exists(filepath):
            return jsonify({
                "status": "error",
                "message": f"File not found: {filepath}"
            }), 404
        
        df = pd.read_csv(filepath)
        
        # Test the conversion logic
        rows = []
        for idx, row in df.iterrows():
            def get_col_value(row, *col_names, default=""):
                for col in col_names:
                    if col in row.index and pd.notna(row[col]):
                        return row[col]
                return default
            
            student_id = get_col_value(row, "student_id", "Student_ID", "StudentID", default=f"S{idx+1}")
            feedback = get_col_value(row, "Feedback", "feedback", default="")
            sentiment = get_col_value(row, "Sentiment", "sentiment", default="NEUTRAL")
            category = get_col_value(row, "Category", "category", default="General")
            suggestion = get_col_value(row, "Suggestion", "suggestion", default="No suggestion available")
            alert = get_col_value(row, "Alert", "alert", default=False)
            
            if isinstance(alert, str):
                alert = alert.lower() in ['true', 'yes', '1', 'alert', 'y']
            elif pd.isna(alert):
                alert = False
            
            row_data = {
                "student_id": str(student_id),
                "feedback": str(feedback),
                "sentiment": str(sentiment).upper(),
                "category": str(category),
                "suggestion": str(suggestion),
                "alert": bool(alert)
            }
            rows.append(row_data)
        
        return jsonify({
            "status": "ok",
            "file": filepath,
            "shape": df.shape,
            "columns": list(df.columns),
            "rows_count": len(rows),
            "first_row": rows[0] if rows else None,
            "rows": rows
        }), 200
        
    except Exception as e:
        import traceback
        return jsonify({
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500

@app.route("/api/download-analyzed", methods=["GET"])
def download_analyzed():
    """
    Endpoint to download analyzed file
    Query param: file (path to analyzed file)
    """
    try:
        file_path = request.args.get("file", default="", type=str)
        
        print(f"\n📥 Download request received")
        print(f"   Requested file: {file_path}")
        
        if not file_path:
            return jsonify({
                "status": "error",
                "message": "No file path provided"
            }), 400
        
        # Normalize the path (handle both forward and backslashes)
        file_path = os.path.normpath(file_path)
        print(f"   Normalized path: {file_path}")
        
        # Check if file exists
        if not os.path.exists(file_path):
            print(f"   ❌ File not found at: {file_path}")
            print(f"   Current directory: {os.getcwd()}")
            print(f"   Absolute path: {os.path.abspath(file_path)}")
            
            return jsonify({
                "status": "error",
                "message": f"File not found: {file_path}"
            }), 404
        
        print(f"   ✓ File found, sending...")
        
        # Get absolute path for send_file
        abs_path = os.path.abspath(file_path)
        
        return send_file(
            abs_path,
            as_attachment=True,
            download_name=os.path.basename(file_path),
            mimetype='text/csv'
        )
    
    except Exception as e:
        import traceback
        print(f"   ❌ Download error: {str(e)}")
        traceback.print_exc()
        
        return jsonify({
            "status": "error",
            "message": f"Download error: {str(e)}"
        }), 500

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error"""
    return jsonify({
        "status": "error",
        "message": "File is too large. Maximum file size is 16MB."
    }), 413

@app.errorhandler(500)
def internal_server_error(error):
    """Handle internal server errors"""
    return jsonify({
        "status": "error",
        "message": "Internal server error occurred."
    }), 500

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 STUDENT FEEDBACK ANALYSIS API - BACKEND SERVER")
    print("=" * 60)
    print(f"✓ Server running on: http://localhost:5002")
    print(f"✓ API Documentation: http://localhost:5002/")
    print(f"✓ Health Check: http://localhost:5002/api/health")
    print(f"✓ CORS enabled for: http://localhost:4010")
    print(f"✓ Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    print("=" * 60)
    print("📝 Available Endpoints:")
    print("   POST /api/analyze-feedback  - Upload & analyze feedback")
    print("   GET  /api/health            - Health check")
    print("   GET  /api/download-analyzed - Download results")
    print("   GET  /api/test-read-analyzed - Test file reading")
    print("=" * 60)
    print("⏳ Waiting for requests...\n")
    
    # Run without debug mode to prevent constant reloading
    # Debug mode causes issues with transformers library file watching
    app.run(debug=False, host="0.0.0.0", port=5002)
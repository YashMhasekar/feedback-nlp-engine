"""
Insert test feedback data into database for testing Trends & Insights
This will create sample data so you can see the graphs immediately
"""
import sqlite3
import os
from datetime import datetime, timedelta
import random

db_path = os.path.join(os.path.dirname(__file__), 'database.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print('=' * 100)
print('INSERTING TEST FEEDBACK DATA')
print('=' * 100)

# Get faculty ID (use 5 for sayali khatkar, or change as needed)
faculty_id = 5  # Change this to your faculty ID

print(f'\n📝 Creating test data for Faculty ID: {faculty_id}')

# Sample feedback data
test_feedbacks = [
    # Positive feedback
    ("S001", "Excellent teaching methods and very helpful", "POSITIVE", "Teaching", "Keep up the good work", ""),
    ("S002", "Great explanations and clear concepts", "POSITIVE", "Teaching", "Continue with interactive sessions", ""),
    ("S003", "Very knowledgeable and approachable", "POSITIVE", "Behavior", "Maintain the positive attitude", ""),
    ("S004", "Course content is well structured", "POSITIVE", "Content", "Add more practical examples", ""),
    ("S005", "Excellent communication skills", "POSITIVE", "Communication", "Keep engaging with students", ""),
    ("S006", "Very helpful during office hours", "POSITIVE", "Behavior", "Continue being accessible", ""),
    ("S007", "Makes complex topics easy to understand", "POSITIVE", "Teaching", "Great teaching style", ""),
    ("S008", "Well organized lectures", "POSITIVE", "Content", "Keep the structure", ""),
    ("S009", "Responds to emails quickly", "POSITIVE", "Communication", "Maintain responsiveness", ""),
    ("S010", "Fair grading system", "POSITIVE", "Teaching", "Continue fair assessment", ""),
    
    # Neutral feedback
    ("S011", "Average teaching pace", "NEUTRAL", "Teaching", "Consider varying the pace", ""),
    ("S012", "Course is okay", "NEUTRAL", "Content", "Could add more examples", ""),
    ("S013", "Lectures are fine", "NEUTRAL", "Teaching", "More interaction would help", ""),
    ("S014", "Decent communication", "NEUTRAL", "Communication", "Be more available", ""),
    ("S015", "Classroom is adequate", "NEUTRAL", "Infrastructure", "Better facilities needed", ""),
    
    # Negative feedback
    ("S016", "Lectures are too fast", "NEGATIVE", "Teaching", "Slow down the pace", "ALERT: Student struggling with pace"),
    ("S017", "Need more examples", "NEGATIVE", "Content", "Add practical examples", ""),
    ("S018", "Difficult to understand", "NEGATIVE", "Teaching", "Simplify explanations", "ALERT: Comprehension issues"),
    ("S019", "Not enough time for questions", "NEGATIVE", "Communication", "Allocate Q&A time", ""),
    ("S020", "Assignments are unclear", "NEGATIVE", "Content", "Provide clear instructions", "ALERT: Assignment confusion"),
    
    # More positive to balance
    ("S021", "Best professor I've had", "POSITIVE", "Teaching", "Excellent work", ""),
    ("S022", "Very inspiring lectures", "POSITIVE", "Teaching", "Keep inspiring students", ""),
    ("S023", "Always willing to help", "POSITIVE", "Behavior", "Great support", ""),
    ("S024", "Clear and concise", "POSITIVE", "Communication", "Perfect clarity", ""),
    ("S025", "Engaging teaching style", "POSITIVE", "Teaching", "Maintain engagement", ""),
    ("S026", "Good use of technology", "POSITIVE", "Infrastructure", "Continue using tech", ""),
    ("S027", "Fair and understanding", "POSITIVE", "Behavior", "Great attitude", ""),
    ("S028", "Well prepared classes", "POSITIVE", "Content", "Excellent preparation", ""),
    ("S029", "Encourages participation", "POSITIVE", "Communication", "Keep encouraging", ""),
    ("S030", "Knowledgeable expert", "POSITIVE", "Teaching", "Great expertise", ""),
]

# Insert data with varying dates (last 6 months)
inserted = 0
base_date = datetime.now()

for i, (student_id, feedback, sentiment, category, suggestion, alert) in enumerate(test_feedbacks):
    # Spread data across last 6 months
    days_ago = random.randint(0, 180)
    upload_date = base_date - timedelta(days=days_ago)
    
    try:
        cursor.execute('''
            INSERT INTO feedback_analysis 
            (faculty_id, student_id, feedback_text, sentiment, category, suggestion, alert, summary, uploaded_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            faculty_id,
            student_id,
            feedback,
            sentiment,
            category,
            suggestion,
            alert if alert else None,
            "Test feedback data for demonstration",
            upload_date.strftime('%Y-%m-%d %H:%M:%S')
        ))
        inserted += 1
    except Exception as e:
        print(f'⚠️  Error inserting {student_id}: {e}')

conn.commit()

print(f'\n✅ Successfully inserted {inserted}/{len(test_feedbacks)} test feedback entries')

# Show summary
cursor.execute('''
    SELECT sentiment, COUNT(*) as count 
    FROM feedback_analysis 
    WHERE faculty_id = ?
    GROUP BY sentiment
''', (faculty_id,))

print('\n📊 Sentiment Distribution:')
for row in cursor.fetchall():
    print(f'   {row[0]}: {row[1]}')

cursor.execute('''
    SELECT category, COUNT(*) as count 
    FROM feedback_analysis 
    WHERE faculty_id = ?
    GROUP BY category
''', (faculty_id,))

print('\n📊 Category Distribution:')
for row in cursor.fetchall():
    print(f'   {row[0]}: {row[1]}')

cursor.execute('''
    SELECT COUNT(*) as count 
    FROM feedback_analysis 
    WHERE faculty_id = ? AND alert IS NOT NULL AND alert != ''
''', (faculty_id,))

alert_count = cursor.fetchone()[0]
print(f'\n🚨 Alerts: {alert_count}')

conn.close()

print('\n' + '=' * 100)
print('TEST DATA INSERTED SUCCESSFULLY!')
print('=' * 100)
print('\n✅ Now refresh the Trends & Insights page to see the graphs!')
print('   1. Go to Trends & Insights tab')
print('   2. Click the Refresh button')
print('   3. You should see all the charts with data!')
print('\n' + '=' * 100)

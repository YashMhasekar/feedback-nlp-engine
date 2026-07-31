"""
Dedicated database for NLP analysis outputs
Separate from authentication database
"""
import sqlite3
import os
from datetime import datetime

FEEDBACK_DB_PATH = os.path.join(os.path.dirname(__file__), 'feedback_analysis.db')

def get_feedback_db_connection():
    """Create and return a connection to the feedback analysis database."""
    conn = sqlite3.connect(FEEDBACK_DB_PATH)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    # Enable foreign key constraints
    conn.execute('PRAGMA foreign_keys = ON')
    return conn

def init_feedback_db():
    """Initialize the feedback analysis database with required schema."""
    conn = get_feedback_db_connection()
    cursor = conn.cursor()
    
    # Feedback analysis table for storing NLP outputs
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback_analysis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            faculty_id INTEGER NOT NULL,
            student_id TEXT,
            course TEXT,
            faculty_name TEXT,
            feedback_text TEXT NOT NULL,
            sentiment TEXT NOT NULL,
            category TEXT NOT NULL,
            suggestion TEXT,
            summary TEXT,
            alert_flag INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create indexes for better query performance
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_faculty_id 
        ON feedback_analysis(faculty_id)
    ''')
    
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_created_at 
        ON feedback_analysis(created_at)
    ''')
    
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_sentiment 
        ON feedback_analysis(sentiment)
    ''')
    
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_category 
        ON feedback_analysis(category)
    ''')
    
    conn.commit()
    conn.close()
    print(f"✓ Feedback analysis database initialized at {FEEDBACK_DB_PATH}")

def save_feedback_analysis(faculty_id, feedback_data_list):
    """
    Save NLP analysis results to the feedback database.
    
    Args:
        faculty_id (int): ID of the faculty member
        feedback_data_list (list): List of dicts with NLP analysis results
            Each dict should contain:
            - feedback: feedback text
            - sentiment: POSITIVE/NEGATIVE/NEUTRAL
            - category: Teaching/Course Content/Behavior/Infrastructure
            - suggestion: suggestion text
            - alert: boolean or string indicating alert status
            - summary: overall summary (optional, can be same for all)
    
    Returns:
        int: Number of records saved
    """
    conn = get_feedback_db_connection()
    cursor = conn.cursor()
    
    saved_count = 0
    
    for fb in feedback_data_list:
        try:
            # Convert alert to integer (1 or 0)
            alert_value = fb.get('alert', False)
            if isinstance(alert_value, str):
                alert_flag = 1 if alert_value.lower() in ['true', 'yes', '1', 'alert', 'y'] else 0
            else:
                alert_flag = 1 if alert_value else 0
            
            cursor.execute('''
                INSERT INTO feedback_analysis 
                (faculty_id, student_id, course, faculty_name, feedback_text, sentiment, category, suggestion, summary, alert_flag)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                faculty_id,
                fb.get('student_id', 'Unknown'),
                fb.get('course', 'N/A'),
                fb.get('faculty_name', 'N/A'),
                fb.get('feedback', ''),
                fb.get('sentiment', 'NEUTRAL').upper(),
                fb.get('category', 'General'),
                fb.get('suggestion', ''),
                fb.get('summary', ''),
                alert_flag
            ))
            saved_count += 1
        except Exception as e:
            print(f"⚠️  Error saving feedback row: {e}")
            continue
    
    conn.commit()
    conn.close()
    
    return saved_count

def get_sentiment_stats(faculty_id):
    """Get sentiment distribution for a faculty member."""
    conn = get_feedback_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT sentiment, COUNT(*) as count 
        FROM feedback_analysis 
        WHERE faculty_id = ? 
        GROUP BY sentiment
    ''', (faculty_id,))
    
    rows = cursor.fetchall()
    conn.close()
    
    result = {'POSITIVE': 0, 'NEGATIVE': 0, 'NEUTRAL': 0}
    for row in rows:
        if row['sentiment']:
            result[row['sentiment'].upper()] = row['count']
    
    return result

def get_category_distribution(faculty_id):
    """Get category distribution for a faculty member."""
    conn = get_feedback_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT category, COUNT(*) as count 
        FROM feedback_analysis 
        WHERE faculty_id = ? AND category IS NOT NULL AND category != ''
        GROUP BY category
    ''', (faculty_id,))
    
    rows = cursor.fetchall()
    conn.close()
    
    result = {}
    for row in rows:
        result[row['category']] = row['count']
    
    return result

def get_alert_count(faculty_id):
    """Get count of feedback with alerts."""
    conn = get_feedback_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT COUNT(*) as total 
        FROM feedback_analysis 
        WHERE faculty_id = ? AND alert_flag = 1
    ''', (faculty_id,))
    
    row = cursor.fetchone()
    conn.close()
    
    return row['total'] if row else 0

def get_feedback_trends(faculty_id, months=6):
    """Get sentiment trends over time."""
    conn = get_feedback_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT 
            DATE(created_at) as date,
            SUM(CASE WHEN UPPER(sentiment) = 'POSITIVE' THEN 1 ELSE 0 END) as positive,
            SUM(CASE WHEN UPPER(sentiment) = 'NEGATIVE' THEN 1 ELSE 0 END) as negative,
            SUM(CASE WHEN UPPER(sentiment) = 'NEUTRAL' THEN 1 ELSE 0 END) as neutral,
            COUNT(*) as total
        FROM feedback_analysis
        WHERE faculty_id = ? 
        AND created_at >= date('now', '-' || ? || ' months')
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
    ''', (faculty_id, months))
    
    rows = cursor.fetchall()
    conn.close()
    
    trend_data = []
    for row in rows:
        trend_data.append({
            'date': row['date'],
            'positive': row['positive'],
            'negative': row['negative'],
            'neutral': row['neutral'],
            'total': row['total']
        })
    
    return trend_data

if __name__ == '__main__':
    init_feedback_db()
    print("✓ Feedback analysis database setup complete!")

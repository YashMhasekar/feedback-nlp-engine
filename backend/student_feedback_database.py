"""
Student Feedback Database
Stores raw student feedback submissions
"""
import sqlite3
import os
from datetime import datetime

STUDENT_FEEDBACK_DB = os.path.join(os.path.dirname(__file__), 'student_feedback.db')

def get_student_feedback_connection():
    """Create and return a connection to the student feedback database."""
    conn = sqlite3.connect(STUDENT_FEEDBACK_DB)
    conn.row_factory = sqlite3.Row
    return conn

def init_student_feedback_db():
    """Initialize the student feedback database."""
    conn = get_student_feedback_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS student_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            course TEXT NOT NULL,
            faculty TEXT NOT NULL,
            feedback TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"✓ Student feedback database initialized at {STUDENT_FEEDBACK_DB}")

def save_student_feedback(student_id, course, faculty, feedback):
    """Save student feedback to database."""
    conn = get_student_feedback_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO student_feedback (student_id, course, faculty, feedback)
        VALUES (?, ?, ?, ?)
    ''', (student_id, course, faculty, feedback))
    
    feedback_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return feedback_id

def get_pending_feedbacks(limit=100):
    """Get pending feedbacks that haven't been analyzed yet."""
    conn = get_student_feedback_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM student_feedback 
        ORDER BY created_at DESC 
        LIMIT ?
    ''', (limit,))
    
    rows = cursor.fetchall()
    conn.close()
    
    feedbacks = []
    for row in rows:
        feedbacks.append({
            'id': row['id'],
            'student_id': row['student_id'],
            'course': row['course'],
            'faculty': row['faculty'],
            'feedback': row['feedback'],
            'created_at': row['created_at']
        })
    
    return feedbacks

if __name__ == '__main__':
    init_student_feedback_db()
    print("✓ Student feedback database setup complete!")

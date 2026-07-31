import sqlite3
import os
from datetime import datetime

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def get_db_connection():
    """Create and return a database connection."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    return conn

def init_db():
    """Initialize the database with required tables."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Users table for admin and faculty
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            department TEXT,
            employee_id TEXT,
            password TEXT NOT NULL,
            role TEXT CHECK(role IN ('admin','faculty')) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Feedback analysis table for storing NLP outputs
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback_analysis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            faculty_id INTEGER,
            student_id TEXT,
            feedback_text TEXT,
            sentiment TEXT,
            category TEXT,
            suggestion TEXT,
            alert TEXT,
            summary TEXT,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (faculty_id) REFERENCES users(id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"Database initialized at {DATABASE_PATH}")

if __name__ == '__main__':
    init_db()

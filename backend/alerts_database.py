"""
Alert System Database
Stores and manages critical alerts detected by NLP engine
Syncs with Firebase for real-time updates
"""
import sqlite3
import os
from datetime import datetime

ALERTS_DB_PATH = os.path.join(os.path.dirname(__file__), 'alerts.db')

# Import Firebase sync (optional - won't break if Firebase is unavailable)
try:
    from firebase_config import sync_alert_to_firebase
    FIREBASE_ENABLED = True
    print("✓ Firebase sync enabled for alerts")
except ImportError:
    FIREBASE_ENABLED = False
    print("⚠️ Firebase sync not available (firebase_config.py not found)")

def get_alerts_db_connection():
    """Create and return a connection to the alerts database."""
    conn = sqlite3.connect(ALERTS_DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON')
    return conn

def init_alerts_db():
    """Initialize the alerts database with required schema."""
    conn = get_alerts_db_connection()
    cursor = conn.cursor()
    
    # Alerts table for storing critical feedback
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            faculty_id INTEGER NOT NULL,
            faculty_name TEXT NOT NULL,
            faculty_email TEXT NOT NULL,
            department TEXT,
            student_id TEXT,
            feedback_text TEXT NOT NULL,
            sentiment TEXT NOT NULL,
            category TEXT NOT NULL,
            alert_keywords TEXT,
            priority TEXT DEFAULT 'High',
            status TEXT DEFAULT 'Pending',
            resolved_by INTEGER,
            resolved_at TIMESTAMP,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create indexes for better query performance
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_alerts_faculty_id 
        ON alerts(faculty_id)
    ''')
    
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_alerts_status 
        ON alerts(status)
    ''')
    
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_alerts_priority 
        ON alerts(priority)
    ''')
    
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_alerts_created_at 
        ON alerts(created_at)
    ''')
    
    conn.commit()
    conn.close()
    print(f"✓ Alerts database initialized at {ALERTS_DB_PATH}")

def save_alert(faculty_id, faculty_name, faculty_email, department, student_id, 
               feedback_text, sentiment, category, alert_keywords, priority='High'):
    """
    Save a critical alert to the database.
    
    Args:
        faculty_id: ID of the faculty member
        faculty_name: Name of the faculty member
        faculty_email: Email of the faculty member
        department: Department name
        student_id: Student identifier
        feedback_text: The feedback content
        sentiment: Sentiment analysis result
        category: Feedback category
        alert_keywords: Keywords that triggered the alert
        priority: Alert priority (High, Medium, Low)
    
    Returns:
        int: ID of the saved alert
    """
    conn = get_alerts_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO alerts 
        (faculty_id, faculty_name, faculty_email, department, student_id, 
         feedback_text, sentiment, category, alert_keywords, priority, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    ''', (
        faculty_id,
        faculty_name,
        faculty_email,
        department,
        student_id,
        feedback_text,
        sentiment,
        category,
        alert_keywords,
        priority
    ))
    
    alert_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    # Sync to Firebase if enabled
    if FIREBASE_ENABLED:
        try:
            alert_data = {
                'id': alert_id,
                'faculty_id': faculty_id,
                'faculty_name': faculty_name,
                'faculty_email': faculty_email,
                'department': department,
                'student_id': student_id,
                'feedback_text': feedback_text,
                'sentiment': sentiment,
                'category': category,
                'alert_keywords': alert_keywords,
                'priority': priority,
                'status': 'Pending',
                'created_at': datetime.now().isoformat()
            }
            print(f"         Syncing alert #{alert_id} to Firebase...")
            firebase_key = sync_alert_to_firebase(alert_data)
            if firebase_key:
                print(f"         ✓ Synced to Firebase with key: {firebase_key}")
            else:
                print(f"         ⚠️ Firebase sync returned None")
        except Exception as e:
            print(f"         ⚠️ Failed to sync alert to Firebase: {e}")
            import traceback
            traceback.print_exc()
    else:
        print(f"         ⚠️ Firebase sync disabled")
    
    return alert_id

def get_all_alerts(status=None, priority=None, limit=100):
    """
    Get all alerts with optional filtering.
    
    Args:
        status: Filter by status (Pending, Resolved, Dismissed)
        priority: Filter by priority (High, Medium, Low)
        limit: Maximum number of alerts to return
    
    Returns:
        list: List of alert dictionaries
    """
    conn = get_alerts_db_connection()
    cursor = conn.cursor()
    
    query = 'SELECT * FROM alerts WHERE 1=1'
    params = []
    
    if status:
        query += ' AND status = ?'
        params.append(status)
    
    if priority:
        query += ' AND priority = ?'
        params.append(priority)
    
    query += ' ORDER BY created_at DESC LIMIT ?'
    params.append(limit)
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    alerts = []
    for row in rows:
        alerts.append({
            'id': row['id'],
            'faculty_id': row['faculty_id'],
            'faculty_name': row['faculty_name'],
            'faculty_email': row['faculty_email'],
            'department': row['department'],
            'student_id': row['student_id'],
            'feedback_text': row['feedback_text'],
            'sentiment': row['sentiment'],
            'category': row['category'],
            'alert_keywords': row['alert_keywords'],
            'priority': row['priority'],
            'status': row['status'],
            'resolved_by': row['resolved_by'],
            'resolved_at': row['resolved_at'],
            'notes': row['notes'],
            'created_at': row['created_at']
        })
    
    return alerts

def get_alerts_by_faculty(faculty_id, status=None):
    """Get all alerts for a specific faculty member."""
    conn = get_alerts_db_connection()
    cursor = conn.cursor()
    
    query = 'SELECT * FROM alerts WHERE faculty_id = ?'
    params = [faculty_id]
    
    if status:
        query += ' AND status = ?'
        params.append(status)
    
    query += ' ORDER BY created_at DESC'
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    alerts = []
    for row in rows:
        alerts.append({
            'id': row['id'],
            'faculty_id': row['faculty_id'],
            'faculty_name': row['faculty_name'],
            'faculty_email': row['faculty_email'],
            'department': row['department'],
            'student_id': row['student_id'],
            'feedback_text': row['feedback_text'],
            'sentiment': row['sentiment'],
            'category': row['category'],
            'alert_keywords': row['alert_keywords'],
            'priority': row['priority'],
            'status': row['status'],
            'resolved_by': row['resolved_by'],
            'resolved_at': row['resolved_at'],
            'notes': row['notes'],
            'created_at': row['created_at']
        })
    
    return alerts

def update_alert_status(alert_id, status, resolved_by=None, notes=None):
    """
    Update the status of an alert.
    
    Args:
        alert_id: ID of the alert
        status: New status (Resolved, Dismissed, Pending)
        resolved_by: ID of admin who resolved it
        notes: Additional notes
    
    Returns:
        bool: True if successful
    """
    conn = get_alerts_db_connection()
    cursor = conn.cursor()
    
    if status in ['Resolved', 'Dismissed']:
        cursor.execute('''
            UPDATE alerts 
            SET status = ?, resolved_by = ?, resolved_at = ?, notes = ?
            WHERE id = ?
        ''', (status, resolved_by, datetime.now(), notes, alert_id))
    else:
        cursor.execute('''
            UPDATE alerts 
            SET status = ?, notes = ?
            WHERE id = ?
        ''', (status, notes, alert_id))
    
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    
    return affected > 0

def get_alert_stats():
    """Get statistics about alerts."""
    conn = get_alerts_db_connection()
    cursor = conn.cursor()
    
    # Total alerts
    cursor.execute('SELECT COUNT(*) as total FROM alerts')
    total = cursor.fetchone()['total']
    
    # Pending alerts
    cursor.execute("SELECT COUNT(*) as pending FROM alerts WHERE status = 'Pending'")
    pending = cursor.fetchone()['pending']
    
    # Resolved alerts
    cursor.execute("SELECT COUNT(*) as resolved FROM alerts WHERE status = 'Resolved'")
    resolved = cursor.fetchone()['resolved']
    
    # By priority
    cursor.execute('''
        SELECT priority, COUNT(*) as count 
        FROM alerts 
        WHERE status = 'Pending'
        GROUP BY priority
    ''')
    priority_rows = cursor.fetchall()
    priority_counts = {row['priority']: row['count'] for row in priority_rows}
    
    # Recent alerts (last 24 hours)
    cursor.execute('''
        SELECT COUNT(*) as recent 
        FROM alerts 
        WHERE created_at >= datetime('now', '-1 day')
    ''')
    recent = cursor.fetchone()['recent']
    
    conn.close()
    
    return {
        'total': total,
        'pending': pending,
        'resolved': resolved,
        'high_priority': priority_counts.get('High', 0),
        'medium_priority': priority_counts.get('Medium', 0),
        'low_priority': priority_counts.get('Low', 0),
        'recent_24h': recent
    }

def delete_alert(alert_id):
    """Delete an alert (use with caution)."""
    conn = get_alerts_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM alerts WHERE id = ?', (alert_id,))
    
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    
    return affected > 0

if __name__ == '__main__':
    init_alerts_db()
    print("✓ Alerts database setup complete!")

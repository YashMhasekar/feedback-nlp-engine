"""
Migration script to move existing feedback data from database.db to feedback_analysis.db
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import get_db_connection
from feedback_database import init_feedback_db, get_feedback_db_connection

def migrate_data():
    """Migrate feedback data from old database to new feedback_analysis.db"""
    print("\n" + "="*60)
    print("🔄 MIGRATING FEEDBACK DATA")
    print("="*60)
    
    # Initialize new database
    print("\n1️⃣ Initializing new feedback_analysis.db...")
    init_feedback_db()
    
    # Connect to old database
    print("\n2️⃣ Reading data from database.db...")
    old_conn = get_db_connection()
    old_cursor = old_conn.cursor()
    
    try:
        # Check if feedback_analysis table exists in old database
        old_cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='feedback_analysis'
        """)
        
        if not old_cursor.fetchone():
            print("⚠️  No feedback_analysis table found in database.db")
            print("   This is normal if you haven't uploaded any feedback yet.")
            old_conn.close()
            return
        
        # Read all existing feedback data
        old_cursor.execute("""
            SELECT 
                faculty_id, 
                student_id, 
                feedback_text, 
                sentiment, 
                category, 
                suggestion, 
                alert, 
                summary,
                uploaded_at
            FROM feedback_analysis
        """)
        
        rows = old_cursor.fetchall()
        old_conn.close()
        
        if not rows:
            print("ℹ️  No data to migrate (table is empty)")
            return
        
        print(f"✓ Found {len(rows)} feedback entries to migrate")
        
        # Connect to new database
        print("\n3️⃣ Migrating data to feedback_analysis.db...")
        new_conn = get_feedback_db_connection()
        new_cursor = new_conn.cursor()
        
        migrated_count = 0
        for row in rows:
            try:
                # Convert alert to integer
                alert_value = row['alert']
                if isinstance(alert_value, str):
                    alert_flag = 1 if alert_value.lower() in ['true', 'yes', '1', 'alert', 'y'] else 0
                else:
                    alert_flag = 1 if alert_value else 0
                
                # Insert into new database
                new_cursor.execute("""
                    INSERT INTO feedback_analysis 
                    (faculty_id, feedback_text, sentiment, category, suggestion, summary, alert_flag, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    row['faculty_id'],
                    row['feedback_text'],
                    row['sentiment'],
                    row['category'],
                    row['suggestion'],
                    row['summary'],
                    alert_flag,
                    row['uploaded_at']
                ))
                migrated_count += 1
            except Exception as e:
                print(f"⚠️  Error migrating row: {e}")
                continue
        
        new_conn.commit()
        new_conn.close()
        
        print(f"✓ Successfully migrated {migrated_count}/{len(rows)} entries")
        
        print("\n" + "="*60)
        print("✅ MIGRATION COMPLETE!")
        print("="*60)
        print(f"\n📊 Migrated {migrated_count} feedback entries")
        print("   From: database.db (feedback_analysis table)")
        print("   To: feedback_analysis.db (feedback_analysis table)")
        print("\n")
        
    except Exception as e:
        print(f"❌ Migration error: {e}")
        import traceback
        traceback.print_exc()
        old_conn.close()

if __name__ == '__main__':
    migrate_data()

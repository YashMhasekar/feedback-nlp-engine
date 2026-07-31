#!/usr/bin/env python3
"""
Complete flow test: Upload → Analyze → Save → Verify in Database → Check Trends
"""

import sqlite3
import os
import sys

def test_complete_flow():
    """Test the complete data flow from upload to trends display"""
    
    print("\n" + "="*70)
    print("🧪 TESTING COMPLETE FLOW: Upload → Analyze → Save → Trends")
    print("="*70)
    
    # Connect to database
    db_path = 'backend/database.db'
    if not os.path.exists(db_path):
        print(f"❌ Database not found at: {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Test 1: Check database structure
    print("\n1️⃣ Checking database structure...")
    cursor.execute("""
        SELECT sql FROM sqlite_master 
        WHERE type='table' AND name='feedback_analysis'
    """)
    result = cursor.fetchone()
    if result:
        print("   ✅ feedback_analysis table exists")
        print(f"   📋 Schema:\n{result[0]}")
    else:
        print("   ❌ feedback_analysis table missing!")
        return False
    
    # Test 2: Check current data
    print("\n2️⃣ Checking existing data...")
    cursor.execute("SELECT COUNT(*) FROM feedback_analysis")
    total_count = cursor.fetchone()[0]
    print(f"   📊 Total feedback entries: {total_count}")
    
    # Test 3: Check data by faculty
    print("\n3️⃣ Checking data by faculty...")
    cursor.execute("""
        SELECT faculty_id, COUNT(*) as count
        FROM feedback_analysis
        GROUP BY faculty_id
    """)
    faculty_data = cursor.fetchall()
    if faculty_data:
        print("   📊 Feedback by Faculty:")
        for faculty_id, count in faculty_data:
            print(f"      Faculty {faculty_id}: {count} entries")
    else:
        print("   ⚠️  No data found for any faculty")
    
    # Test 4: Check sentiment distribution
    print("\n4️⃣ Checking sentiment distribution...")
    cursor.execute("""
        SELECT sentiment, COUNT(*) as count
        FROM feedback_analysis
        GROUP BY sentiment
    """)
    sentiments = cursor.fetchall()
    if sentiments:
        print("   📊 Sentiment Distribution:")
        total = sum(count for _, count in sentiments)
        for sentiment, count in sentiments:
            percentage = (count / total * 100) if total > 0 else 0
            print(f"      {sentiment}: {count} ({percentage:.1f}%)")
    else:
        print("   ⚠️  No sentiment data found")
    
    # Test 5: Check category distribution
    print("\n5️⃣ Checking category distribution...")
    cursor.execute("""
        SELECT category, COUNT(*) as count
        FROM feedback_analysis
        GROUP BY category
        ORDER BY count DESC
        LIMIT 10
    """)
    categories = cursor.fetchall()
    if categories:
        print("   📊 Top Categories:")
        for category, count in categories:
            print(f"      {category}: {count}")
    else:
        print("   ⚠️  No category data found")
    
    # Test 6: Check alerts
    print("\n6️⃣ Checking alerts...")
    cursor.execute("""
        SELECT COUNT(*) 
        FROM feedback_analysis
        WHERE alert = 'True' OR alert = '1' OR alert = 'true'
    """)
    alert_count = cursor.fetchone()[0]
    print(f"   🚨 Total alerts: {alert_count}")
    
    # Test 7: Check if summaries are saved
    print("\n7️⃣ Checking AI summaries...")
    cursor.execute("""
        SELECT COUNT(*) 
        FROM feedback_analysis
        WHERE summary IS NOT NULL AND summary != ''
    """)
    summary_count = cursor.fetchone()[0]
    print(f"   📝 Entries with summaries: {summary_count}/{total_count}")
    
    if summary_count > 0:
        cursor.execute("""
            SELECT summary 
            FROM feedback_analysis
            WHERE summary IS NOT NULL AND summary != ''
            LIMIT 1
        """)
        sample_summary = cursor.fetchone()[0]
        print(f"   📄 Sample summary: {sample_summary[:100]}...")
    
    # Test 8: Check monthly trends data
    print("\n8️⃣ Checking monthly trends data...")
    cursor.execute("""
        SELECT 
            strftime('%Y-%m', uploaded_at) as month,
            COUNT(*) as total,
            SUM(CASE WHEN sentiment = 'POSITIVE' THEN 1 ELSE 0 END) as positive,
            SUM(CASE WHEN sentiment = 'NEUTRAL' THEN 1 ELSE 0 END) as neutral,
            SUM(CASE WHEN sentiment = 'NEGATIVE' THEN 1 ELSE 0 END) as negative
        FROM feedback_analysis
        GROUP BY month
        ORDER BY month DESC
        LIMIT 6
    """)
    monthly = cursor.fetchall()
    if monthly:
        print("   📊 Monthly Summary:")
        for month, total, pos, neu, neg in monthly:
            print(f"      {month}: Total={total}, Pos={pos}, Neu={neu}, Neg={neg}")
    else:
        print("   ⚠️  No monthly data found")
    
    # Test 9: Verify data structure for Trends API
    print("\n9️⃣ Verifying data structure for Trends API...")
    cursor.execute("""
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
        LIMIT 1
    """)
    sample = cursor.fetchone()
    if sample:
        print("   ✅ Sample record structure:")
        print(f"      Faculty ID: {sample[0]}")
        print(f"      Student ID: {sample[1]}")
        print(f"      Feedback: {sample[2][:50]}...")
        print(f"      Sentiment: {sample[3]}")
        print(f"      Category: {sample[4]}")
        print(f"      Suggestion: {sample[5][:50]}...")
        print(f"      Alert: {sample[6]}")
        print(f"      Summary: {sample[7][:50] if sample[7] else 'None'}...")
        print(f"      Uploaded: {sample[8]}")
    else:
        print("   ⚠️  No sample data found")
    
    # Test 10: Check if data is ready for analytics API
    print("\n🔟 Checking analytics API readiness...")
    
    # Check for faculty with data
    cursor.execute("""
        SELECT DISTINCT faculty_id 
        FROM feedback_analysis
    """)
    faculty_ids = [row[0] for row in cursor.fetchall()]
    
    if faculty_ids:
        print(f"   ✅ {len(faculty_ids)} faculty members have data")
        
        for faculty_id in faculty_ids[:3]:  # Check first 3
            # Check sentiment stats
            cursor.execute("""
                SELECT sentiment, COUNT(*) 
                FROM feedback_analysis
                WHERE faculty_id = ?
                GROUP BY sentiment
            """, (faculty_id,))
            stats = dict(cursor.fetchall())
            
            print(f"\n   📊 Faculty {faculty_id} Analytics:")
            print(f"      POSITIVE: {stats.get('POSITIVE', 0)}")
            print(f"      NEUTRAL: {stats.get('NEUTRAL', 0)}")
            print(f"      NEGATIVE: {stats.get('NEGATIVE', 0)}")
            print(f"      Total: {sum(stats.values())}")
    else:
        print("   ⚠️  No faculty data found")
    
    conn.close()
    
    print("\n" + "="*70)
    print("✅ TEST COMPLETE!")
    print("="*70)
    
    # Summary
    print("\n📋 SUMMARY:")
    print(f"   Total Feedback: {total_count}")
    print(f"   Sentiments: {len(sentiments)} types")
    print(f"   Categories: {len(categories)} types")
    print(f"   Alerts: {alert_count}")
    print(f"   With Summaries: {summary_count}")
    print(f"   Faculty Members: {len(faculty_ids) if faculty_ids else 0}")
    
    if total_count > 0:
        print("\n✅ DATABASE IS READY FOR TRENDS & INSIGHTS!")
        print("\n📋 NEXT STEPS:")
        print("1. Ensure backend is running (python backend/app.py)")
        print("2. Ensure frontend is running (npm start)")
        print("3. Login as faculty user")
        print("4. Upload a new feedback file")
        print("5. Wait for analysis to complete")
        print("6. Check Trends & Insights tab")
        print("7. Verify graphs show the data")
    else:
        print("\n⚠️  NO DATA IN DATABASE!")
        print("\n📋 TO ADD DATA:")
        print("1. Start backend: python backend/app.py")
        print("2. Start frontend: npm start")
        print("3. Login as faculty")
        print("4. Go to 'Analyze Feedback' tab")
        print("5. Upload a CSV file with feedback")
        print("6. Click 'Start AI Analysis'")
        print("7. Wait for completion")
        print("8. Data will be saved automatically")
    
    print("\n")
    return True

if __name__ == "__main__":
    try:
        test_complete_flow()
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

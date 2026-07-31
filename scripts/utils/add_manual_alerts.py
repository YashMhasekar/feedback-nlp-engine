"""
Manually add alerts to the system
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from alerts_database import save_alert

# Alert data
alerts = [
    {
        'faculty_id': 5,
        'faculty_name': 'sayali khatkar',
        'faculty_email': 's@gmail.com',
        'department': 'Computer Science',
        'student_id': 'S101',
        'feedback_text': 'The classroom is clean and well maintained. There was also an issue of unsafe in class. he gave me dhamki ani pitai keli majhi',
        'sentiment': 'NEGATIVE',
        'category': 'Behavior',
        'alert_keywords': 'unsafe, dhamki, pitai',
        'priority': 'High'
    },
    {
        'faculty_id': 5,
        'faculty_name': 'sayali khatkar',
        'faculty_email': 's@gmail.com',
        'department': 'Computer Science',
        'student_id': 'S102',
        'feedback_text': 'Some modules are too theoretical and boring. There was also an issue of harassment in class.',
        'sentiment': 'NEGATIVE',
        'category': 'Behavior',
        'alert_keywords': 'harassment',
        'priority': 'High'
    },
    {
        'faculty_id': 5,
        'faculty_name': 'sayali khatkar',
        'faculty_email': 's@gmail.com',
        'department': 'Computer Science',
        'student_id': 'S103',
        'feedback_text': 'Explains topics clearly and provides real-life examples. There was also an issue of asurakshit in class.',
        'sentiment': 'NEGATIVE',
        'category': 'Behavior',
        'alert_keywords': 'asurakshit',
        'priority': 'High'
    },
    {
        'faculty_id': 5,
        'faculty_name': 'sayali khatkar',
        'faculty_email': 's@gmail.com',
        'department': 'Computer Science',
        'student_id': 'S104',
        'feedback_text': 'The classroom is clean and well maintained. There was also an issue of bullying in class.',
        'sentiment': 'NEGATIVE',
        'category': 'Behavior',
        'alert_keywords': 'bullying',
        'priority': 'High'
    }
]

print("="*80)
print("ADDING MANUAL ALERTS")
print("="*80)

for i, alert in enumerate(alerts, 1):
    print(f"\n{i}. Adding alert for Student {alert['student_id']}...")
    print(f"   Keywords: {alert['alert_keywords']}")
    
    try:
        alert_id = save_alert(**alert)
        print(f"   ✓ Alert #{alert_id} created successfully")
        print(f"   ✓ Synced to Firebase")
    except Exception as e:
        print(f"   ❌ Error: {e}")

print("\n" + "="*80)
print("COMPLETE!")
print("="*80)
print("\n✅ All 4 alerts have been added to:")
print("   - SQLite database (alerts.db)")
print("   - Firebase Realtime Database")
print("\n📱 View them in:")
print("   - Admin Dashboard → Alerts tab")
print("   - Faculty Dashboard → Alerts & Reports tab")

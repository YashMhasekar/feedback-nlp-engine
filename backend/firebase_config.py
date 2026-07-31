"""
Firebase Integration for Alert System
Syncs alerts to Firebase Realtime Database for real-time updates
"""
import os
import json
from datetime import datetime
import requests

# Firebase configuration
FIREBASE_PROJECT_ID = "predictive-maintenance-8c9b1"
FIREBASE_DATABASE_URL = f"https://{FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com"

class FirebaseAlertSync:
    """Handles syncing alerts to Firebase Realtime Database"""
    
    def __init__(self):
        self.database_url = FIREBASE_DATABASE_URL
        self.alerts_path = "/alerts"
    
    def _get_url(self, path=""):
        """Construct Firebase REST API URL"""
        return f"{self.database_url}{self.alerts_path}{path}.json"
    
    def save_alert_to_firebase(self, alert_data):
        """
        Save an alert to Firebase Realtime Database
        
        Args:
            alert_data: Dictionary containing alert information
        
        Returns:
            str: Firebase key of the saved alert, or None if failed
        """
        try:
            # Prepare alert data for Firebase
            firebase_alert = {
                'id': alert_data.get('id'),
                'faculty_id': alert_data.get('faculty_id'),
                'faculty_name': alert_data.get('faculty_name'),
                'faculty_email': alert_data.get('faculty_email'),
                'department': alert_data.get('department', 'Unknown'),
                'student_id': alert_data.get('student_id', 'Unknown'),
                'feedback_text': alert_data.get('feedback_text', ''),
                'sentiment': alert_data.get('sentiment', 'NEGATIVE'),
                'category': alert_data.get('category', 'Behavior'),
                'alert_keywords': alert_data.get('alert_keywords', ''),
                'priority': alert_data.get('priority', 'High'),
                'status': alert_data.get('status', 'Pending'),
                'created_at': alert_data.get('created_at', datetime.now().isoformat()),
                'timestamp': datetime.now().isoformat()
            }
            
            # POST to Firebase
            response = requests.post(
                self._get_url(),
                json=firebase_alert,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                result = response.json()
                firebase_key = result.get('name')
                print(f"✓ Alert saved to Firebase with key: {firebase_key}")
                return firebase_key
            else:
                print(f"⚠️ Firebase save failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Error saving alert to Firebase: {e}")
            return None
    
    def get_all_alerts_from_firebase(self):
        """
        Fetch all alerts from Firebase
        
        Returns:
            list: List of alert dictionaries
        """
        try:
            response = requests.get(self._get_url(), timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if not data:
                    return []
                
                # Convert Firebase object to list
                alerts = []
                for firebase_key, alert in data.items():
                    alert['firebase_key'] = firebase_key
                    alerts.append(alert)
                
                # Sort by timestamp (newest first)
                alerts.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
                return alerts
            else:
                print(f"⚠️ Firebase fetch failed: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ Error fetching alerts from Firebase: {e}")
            return []
    
    def get_alerts_by_faculty(self, faculty_id):
        """
        Get alerts for a specific faculty member from Firebase
        
        Args:
            faculty_id: Faculty member ID
        
        Returns:
            list: List of alert dictionaries
        """
        try:
            all_alerts = self.get_all_alerts_from_firebase()
            faculty_alerts = [
                alert for alert in all_alerts 
                if alert.get('faculty_id') == faculty_id
            ]
            return faculty_alerts
        except Exception as e:
            print(f"❌ Error fetching faculty alerts from Firebase: {e}")
            return []
    
    def update_alert_status_in_firebase(self, firebase_key, status, resolved_by=None, notes=None):
        """
        Update alert status in Firebase
        
        Args:
            firebase_key: Firebase key of the alert
            status: New status
            resolved_by: ID of user who resolved it
            notes: Additional notes
        
        Returns:
            bool: True if successful
        """
        try:
            update_data = {
                'status': status,
                'updated_at': datetime.now().isoformat()
            }
            
            if resolved_by:
                update_data['resolved_by'] = resolved_by
                update_data['resolved_at'] = datetime.now().isoformat()
            
            if notes:
                update_data['notes'] = notes
            
            response = requests.patch(
                self._get_url(f"/{firebase_key}"),
                json=update_data,
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"✓ Alert {firebase_key} updated in Firebase")
                return True
            else:
                print(f"⚠️ Firebase update failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error updating alert in Firebase: {e}")
            return False
    
    def delete_alert_from_firebase(self, firebase_key):
        """
        Delete an alert from Firebase
        
        Args:
            firebase_key: Firebase key of the alert
        
        Returns:
            bool: True if successful
        """
        try:
            response = requests.delete(
                self._get_url(f"/{firebase_key}"),
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"✓ Alert {firebase_key} deleted from Firebase")
                return True
            else:
                print(f"⚠️ Firebase delete failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error deleting alert from Firebase: {e}")
            return False
    
    def get_pending_alerts_count(self):
        """Get count of pending alerts from Firebase"""
        try:
            alerts = self.get_all_alerts_from_firebase()
            pending = [a for a in alerts if a.get('status') == 'Pending']
            return len(pending)
        except Exception as e:
            print(f"❌ Error getting pending count from Firebase: {e}")
            return 0

# Create singleton instance
firebase_sync = FirebaseAlertSync()

# Helper functions for easy access
def sync_alert_to_firebase(alert_data):
    """Sync an alert to Firebase"""
    return firebase_sync.save_alert_to_firebase(alert_data)

def get_firebase_alerts(faculty_id=None):
    """Get alerts from Firebase"""
    if faculty_id:
        return firebase_sync.get_alerts_by_faculty(faculty_id)
    return firebase_sync.get_all_alerts_from_firebase()

def update_firebase_alert(firebase_key, status, resolved_by=None, notes=None):
    """Update alert status in Firebase"""
    return firebase_sync.update_alert_status_in_firebase(firebase_key, status, resolved_by, notes)

def delete_firebase_alert(firebase_key):
    """Delete alert from Firebase"""
    return firebase_sync.delete_alert_from_firebase(firebase_key)

if __name__ == '__main__':
    # Test Firebase connection
    print("Testing Firebase connection...")
    sync = FirebaseAlertSync()
    
    # Test saving an alert
    test_alert = {
        'id': 999,
        'faculty_id': 1,
        'faculty_name': 'Test Faculty',
        'faculty_email': 'test@example.com',
        'department': 'Computer Science',
        'student_id': 'S001',
        'feedback_text': 'Test feedback with harassment keyword',
        'sentiment': 'NEGATIVE',
        'category': 'Behavior',
        'alert_keywords': 'harassment',
        'priority': 'High',
        'status': 'Pending'
    }
    
    firebase_key = sync.save_alert_to_firebase(test_alert)
    if firebase_key:
        print(f"✓ Test alert saved successfully with key: {firebase_key}")
        
        # Test fetching
        alerts = sync.get_all_alerts_from_firebase()
        print(f"✓ Fetched {len(alerts)} alerts from Firebase")
        
        # Clean up test alert
        sync.delete_alert_from_firebase(firebase_key)
        print("✓ Test alert cleaned up")
    else:
        print("❌ Failed to save test alert")

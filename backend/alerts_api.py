"""
Alerts API Blueprint
Provides endpoints for managing alerts
Includes Firebase integration for real-time updates
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from alerts_database import (
    get_all_alerts, 
    get_alerts_by_faculty, 
    update_alert_status,
    get_alert_stats,
    delete_alert
)
from database import get_db_connection

# Import Firebase sync
try:
    from firebase_config import (
        get_firebase_alerts,
        update_firebase_alert,
        delete_firebase_alert,
        firebase_sync
    )
    FIREBASE_ENABLED = True
except ImportError:
    FIREBASE_ENABLED = False
    print("⚠️ Firebase integration not available")

alerts_api_bp = Blueprint('alerts_api', __name__, url_prefix='/api/alerts')

@alerts_api_bp.route('/all', methods=['GET'])
@jwt_required()
def get_alerts():
    """Get all alerts (admin only) or faculty-specific alerts."""
    try:
        user_id = get_jwt_identity()
        
        # Get user role
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        role = user['role']
        
        # Get query parameters
        status = request.args.get('status', None)
        priority = request.args.get('priority', None)
        limit = request.args.get('limit', 100, type=int)
        
        if role == 'admin':
            # Admin can see all alerts
            alerts = get_all_alerts(status=status, priority=priority, limit=limit)
        else:
            # Faculty can only see their own alerts
            alerts = get_alerts_by_faculty(user_id, status=status)
        
        return jsonify({
            'status': 'success',
            'alerts': alerts,
            'count': len(alerts)
        }), 200
        
    except Exception as e:
        print(f"Error fetching alerts: {e}")
        return jsonify({'error': str(e)}), 500

@alerts_api_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Get alert statistics (admin only)."""
    try:
        user_id = get_jwt_identity()
        
        # Verify admin role
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        conn.close()
        
        if not user or user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        stats = get_alert_stats()
        
        return jsonify({
            'status': 'success',
            'stats': stats
        }), 200
        
    except Exception as e:
        print(f"Error fetching alert stats: {e}")
        return jsonify({'error': str(e)}), 500

@alerts_api_bp.route('/<int:alert_id>/resolve', methods=['PUT'])
@jwt_required()
def resolve_alert(alert_id):
    """Resolve an alert (admin only)."""
    try:
        user_id = get_jwt_identity()
        
        # Verify admin role
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        conn.close()
        
        if not user or user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        notes = data.get('notes', '')
        
        success = update_alert_status(alert_id, 'Resolved', resolved_by=user_id, notes=notes)
        
        if success:
            return jsonify({
                'status': 'success',
                'message': 'Alert resolved successfully'
            }), 200
        else:
            return jsonify({'error': 'Alert not found'}), 404
        
    except Exception as e:
        print(f"Error resolving alert: {e}")
        return jsonify({'error': str(e)}), 500

@alerts_api_bp.route('/<int:alert_id>/dismiss', methods=['PUT'])
@jwt_required()
def dismiss_alert(alert_id):
    """Dismiss an alert (admin only)."""
    try:
        user_id = get_jwt_identity()
        
        # Verify admin role
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        conn.close()
        
        if not user or user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        notes = data.get('notes', '')
        
        success = update_alert_status(alert_id, 'Dismissed', resolved_by=user_id, notes=notes)
        
        if success:
            return jsonify({
                'status': 'success',
                'message': 'Alert dismissed successfully'
            }), 200
        else:
            return jsonify({'error': 'Alert not found'}), 404
        
    except Exception as e:
        print(f"Error dismissing alert: {e}")
        return jsonify({'error': str(e)}), 500

@alerts_api_bp.route('/<int:alert_id>', methods=['DELETE'])
@jwt_required()
def delete_alert_endpoint(alert_id):
    """Delete an alert (admin only)."""
    try:
        user_id = get_jwt_identity()
        
        # Verify admin role
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        conn.close()
        
        if not user or user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        success = delete_alert(alert_id)
        
        if success:
            return jsonify({
                'status': 'success',
                'message': 'Alert deleted successfully'
            }), 200
        else:
            return jsonify({'error': 'Alert not found'}), 404
        
    except Exception as e:
        print(f"Error deleting alert: {e}")
        return jsonify({'error': str(e)}), 500

@alerts_api_bp.route('/faculty/<int:faculty_id>', methods=['GET'])
@jwt_required()
def get_faculty_alerts(faculty_id):
    """Get alerts for a specific faculty member (admin only)."""
    try:
        user_id = get_jwt_identity()
        
        # Verify admin role or same faculty
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user['role'] != 'admin' and user_id != faculty_id:
            return jsonify({'error': 'Access denied'}), 403
        
        status = request.args.get('status', None)
        alerts = get_alerts_by_faculty(faculty_id, status=status)
        
        return jsonify({
            'status': 'success',
            'alerts': alerts,
            'count': len(alerts)
        }), 200
        
    except Exception as e:
        print(f"Error fetching faculty alerts: {e}")
        return jsonify({'error': str(e)}), 500

@alerts_api_bp.route('/firebase/all', methods=['GET'])
@jwt_required()
def get_firebase_alerts_endpoint():
    """Get all alerts from Firebase (real-time data)."""
    if not FIREBASE_ENABLED:
        return jsonify({'error': 'Firebase integration not available'}), 503
    
    try:
        user_id = get_jwt_identity()
        
        # Get user role
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT role FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        role = user['role']
        
        if role == 'admin':
            # Admin can see all alerts
            alerts = get_firebase_alerts()
        else:
            # Faculty can only see their own alerts
            alerts = get_firebase_alerts(faculty_id=user_id)
        
        return jsonify({
            'status': 'success',
            'alerts': alerts,
            'count': len(alerts),
            'source': 'firebase'
        }), 200
        
    except Exception as e:
        print(f"Error fetching Firebase alerts: {e}")
        return jsonify({'error': str(e)}), 500

@alerts_api_bp.route('/firebase/config', methods=['GET'])
def get_firebase_config():
    """Get Firebase configuration for frontend."""
    return jsonify({
        'apiKey': "AIzaSyB_YjGFJaR-J6Q5A2sYbN7wL9Hkd7GKKV0",
        'authDomain': "predictive-maintenance-8c9b1.firebaseapp.com",
        'projectId': "predictive-maintenance-8c9b1",
        'storageBucket': "predictive-maintenance-8c9b1.firebasestorage.app",
        'messagingSenderId': "275892451261",
        'appId': "1:275892451261:web:e01d4d8799afd1042704d4",
        'databaseURL': "https://predictive-maintenance-8c9b1-default-rtdb.firebaseio.com"
    }), 200

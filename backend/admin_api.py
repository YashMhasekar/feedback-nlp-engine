"""
Admin API Routes
Endpoints for admin dashboard functionality
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_db_connection
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__)

def is_admin():
    """Check if current user is admin"""
    user_id = get_jwt_identity()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT role FROM users WHERE id = ?', (int(user_id),))
    user = cursor.fetchone()
    conn.close()
    return user and user['role'] == 'admin'

@admin_bp.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    """Get overview statistics for admin dashboard"""
    if not is_admin():
        return jsonify({"status": "error", "message": "Admin access required"}), 403
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Total faculty registered
        cursor.execute("SELECT COUNT(*) as count FROM users WHERE role = 'faculty'")
        total_faculty = cursor.fetchone()['count']
        
        # Total feedbacks processed
        cursor.execute("SELECT COUNT(*) as count FROM feedback_analysis")
        total_feedbacks = cursor.fetchone()['count']
        
        # Active departments
        cursor.execute("SELECT COUNT(DISTINCT department) as count FROM users WHERE department IS NOT NULL AND department != ''")
        active_departments = cursor.fetchone()['count']
        
        # Alerts generated (from alerts database)
        from alerts_database import get_alert_stats
        alert_stats = get_alert_stats()
        alerts_count = alert_stats.get('pending', 0)
        
        # Recent activity (last 10 feedbacks)
        cursor.execute('''
            SELECT fa.*, u.first_name, u.last_name, u.department
            FROM feedback_analysis fa
            LEFT JOIN users u ON fa.faculty_id = u.id
            ORDER BY fa.uploaded_at DESC
            LIMIT 10
        ''')
        recent_activity = []
        for row in cursor.fetchall():
            recent_activity.append({
                'id': row['id'],
                'faculty_name': f"{row['first_name']} {row['last_name']}" if row['first_name'] else 'Unknown',
                'department': row['department'] or 'N/A',
                'sentiment': row['sentiment'],
                'category': row['category'],
                'uploaded_at': row['uploaded_at']
            })
        
        # Sentiment distribution
        cursor.execute('''
            SELECT sentiment, COUNT(*) as count
            FROM feedback_analysis
            GROUP BY sentiment
        ''')
        sentiment_dist = {}
        for row in cursor.fetchall():
            sentiment_dist[row['sentiment']] = row['count']
        
        # Department-wise sentiment
        cursor.execute('''
            SELECT u.department, fa.sentiment, COUNT(*) as count
            FROM feedback_analysis fa
            LEFT JOIN users u ON fa.faculty_id = u.id
            WHERE u.department IS NOT NULL AND u.department != ''
            GROUP BY u.department, fa.sentiment
        ''')
        dept_sentiment = {}
        for row in cursor.fetchall():
            dept = row['department']
            if dept not in dept_sentiment:
                dept_sentiment[dept] = {}
            dept_sentiment[dept][row['sentiment']] = row['count']
        
        conn.close()
        
        return jsonify({
            "status": "ok",
            "stats": {
                "total_faculty": total_faculty,
                "total_feedbacks": total_feedbacks,
                "active_departments": active_departments,
                "alerts_count": alerts_count
            },
            "recent_activity": recent_activity,
            "sentiment_distribution": sentiment_dist,
            "department_sentiment": dept_sentiment
        }), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@admin_bp.route('/api/admin/faculty', methods=['GET'])
@jwt_required()
def get_all_faculty():
    """Get all faculty members"""
    if not is_admin():
        return jsonify({"status": "error", "message": "Admin access required"}), 403
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, first_name, last_name, email, department, employee_id, created_at
            FROM users
            WHERE role = 'faculty'
            ORDER BY created_at DESC
        ''')
        
        faculty_list = []
        for row in cursor.fetchall():
            # Get feedback count for this faculty
            cursor.execute('SELECT COUNT(*) as count FROM feedback_analysis WHERE faculty_id = ?', (row['id'],))
            feedback_count = cursor.fetchone()['count']
            
            faculty_list.append({
                'id': row['id'],
                'name': f"{row['first_name']} {row['last_name']}",
                'email': row['email'],
                'department': row['department'] or 'N/A',
                'employee_id': row['employee_id'] or 'N/A',
                'created_at': row['created_at'],
                'feedback_count': feedback_count
            })
        
        conn.close()
        
        return jsonify({
            "status": "ok",
            "faculty": faculty_list
        }), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@admin_bp.route('/api/admin/feedbacks', methods=['GET'])
@jwt_required()
def get_all_feedbacks():
    """Get all feedback analysis results"""
    if not is_admin():
        return jsonify({"status": "error", "message": "Admin access required"}), 403
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get query parameters
        department = request.args.get('department')
        sentiment = request.args.get('sentiment')
        limit = request.args.get('limit', 100, type=int)
        
        query = '''
            SELECT fa.*, u.first_name, u.last_name, u.department, u.email
            FROM feedback_analysis fa
            LEFT JOIN users u ON fa.faculty_id = u.id
            WHERE 1=1
        '''
        params = []
        
        if department:
            query += ' AND u.department = ?'
            params.append(department)
        
        if sentiment:
            query += ' AND fa.sentiment = ?'
            params.append(sentiment)
        
        query += ' ORDER BY fa.uploaded_at DESC LIMIT ?'
        params.append(limit)
        
        cursor.execute(query, params)
        
        feedbacks = []
        for row in cursor.fetchall():
            feedbacks.append({
                'id': row['id'],
                'faculty_name': f"{row['first_name']} {row['last_name']}" if row['first_name'] else 'Unknown',
                'faculty_email': row['email'],
                'department': row['department'] or 'N/A',
                'student_id': row['student_id'],
                'feedback_text': row['feedback_text'],
                'sentiment': row['sentiment'],
                'category': row['category'],
                'suggestion': row['suggestion'],
                'alert': row['alert'],
                'uploaded_at': row['uploaded_at']
            })
        
        conn.close()
        
        return jsonify({
            "status": "ok",
            "feedbacks": feedbacks,
            "count": len(feedbacks)
        }), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@admin_bp.route('/api/admin/alerts', methods=['GET'])
@jwt_required()
def get_alerts():
    """Get all alerts from alerts database"""
    if not is_admin():
        return jsonify({"status": "error", "message": "Admin access required"}), 403
    
    try:
        from alerts_database import get_all_alerts
        
        # Get query parameters
        status = request.args.get('status', 'Pending')  # Default to pending alerts
        priority = request.args.get('priority')
        limit = request.args.get('limit', 100, type=int)
        
        alerts = get_all_alerts(status=status, priority=priority, limit=limit)
        
        return jsonify({
            "status": "ok",
            "alerts": alerts,
            "count": len(alerts)
        }), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@admin_bp.route('/api/admin/trends', methods=['GET'])
@jwt_required()
def get_trends():
    """Get trend data for charts"""
    if not is_admin():
        return jsonify({"status": "error", "message": "Admin access required"}), 403
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Sentiment trend over time (last 30 days)
        cursor.execute('''
            SELECT DATE(uploaded_at) as date, sentiment, COUNT(*) as count
            FROM feedback_analysis
            WHERE uploaded_at >= date('now', '-30 days')
            GROUP BY DATE(uploaded_at), sentiment
            ORDER BY date
        ''')
        
        sentiment_trend = {}
        for row in cursor.fetchall():
            date = row['date']
            if date not in sentiment_trend:
                sentiment_trend[date] = {}
            sentiment_trend[date][row['sentiment']] = row['count']
        
        # Category distribution
        cursor.execute('''
            SELECT category, COUNT(*) as count
            FROM feedback_analysis
            GROUP BY category
            ORDER BY count DESC
        ''')
        
        category_dist = {}
        for row in cursor.fetchall():
            category_dist[row['category']] = row['count']
        
        conn.close()
        
        return jsonify({
            "status": "ok",
            "sentiment_trend": sentiment_trend,
            "category_distribution": category_dist
        }), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@admin_bp.route('/api/admin/departments', methods=['GET'])
@jwt_required()
def get_departments():
    """Get list of all departments"""
    if not is_admin():
        return jsonify({"status": "error", "message": "Admin access required"}), 403
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT DISTINCT department
            FROM users
            WHERE department IS NOT NULL AND department != ''
            ORDER BY department
        ''')
        
        departments = [row['department'] for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            "status": "ok",
            "departments": departments
        }), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

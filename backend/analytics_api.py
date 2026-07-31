"""
Analytics API endpoints for Trends & Insights
Provides aggregated NLP data for faculty dashboards
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_db_connection
from feedback_database import get_feedback_db_connection
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/api/test-auth', methods=['GET'])
@jwt_required()
def test_auth():
    """Test endpoint to verify JWT authentication is working"""
    try:
        current_user_id = get_jwt_identity()
        return jsonify({
            "status": "ok",
            "message": "Authentication successful",
            "user_id": current_user_id
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@analytics_bp.route('/api/faculty/<int:faculty_id>/sentiment_stats', methods=['GET'])
@jwt_required()
def get_sentiment_stats(faculty_id):
    """
    Get sentiment distribution for a faculty member
    Returns: {POSITIVE: count, NEGATIVE: count, NEUTRAL: count}
    """
    try:
        # Verify the requesting user is the faculty member or an admin
        current_user_id = int(get_jwt_identity())
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if current user is admin or the faculty member
        cursor.execute('SELECT role FROM users WHERE id = ?', (current_user_id,))
        user = cursor.fetchone()
        
        if not user or (user['role'] != 'admin' and current_user_id != faculty_id):
            conn.close()
            return jsonify({"status": "error", "message": "Unauthorized"}), 403
        
        conn.close()
        
        # Get sentiment counts from feedback database
        feedback_conn = get_feedback_db_connection()
        feedback_cursor = feedback_conn.cursor()
        
        feedback_cursor.execute('''
            SELECT sentiment, COUNT(*) as count 
            FROM feedback_analysis 
            WHERE faculty_id = ? 
            GROUP BY sentiment
        ''', (faculty_id,))
        
        rows = feedback_cursor.fetchall()
        feedback_conn.close()
        
        # Format results
        result = {
            'POSITIVE': 0,
            'NEGATIVE': 0,
            'NEUTRAL': 0
        }
        
        for row in rows:
            if row['sentiment']:
                result[row['sentiment'].upper()] = row['count']
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@analytics_bp.route('/api/faculty/<int:faculty_id>/category_distribution', methods=['GET'])
@jwt_required()
def get_category_distribution(faculty_id):
    """
    Get category distribution for a faculty member
    Returns: {category: count, ...}
    """
    try:
        current_user_id = int(get_jwt_identity())
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check authorization
        cursor.execute('SELECT role FROM users WHERE id = ?', (current_user_id,))
        user = cursor.fetchone()
        
        if not user or (user['role'] != 'admin' and current_user_id != faculty_id):
            conn.close()
            return jsonify({"status": "error", "message": "Unauthorized"}), 403
        
        conn.close()
        
        # Get category counts from feedback database
        feedback_conn = get_feedback_db_connection()
        feedback_cursor = feedback_conn.cursor()
        
        feedback_cursor.execute('''
            SELECT category, COUNT(*) as count 
            FROM feedback_analysis 
            WHERE faculty_id = ? AND category IS NOT NULL AND category != ''
            GROUP BY category
        ''', (faculty_id,))
        
        rows = feedback_cursor.fetchall()
        feedback_conn.close()
        
        # Format results
        result = {}
        for row in rows:
            result[row['category']] = row['count']
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@analytics_bp.route('/api/faculty/<int:faculty_id>/alerts', methods=['GET'])
@jwt_required()
def get_alert_count(faculty_id):
    """
    Get count of feedback with alerts
    Returns: {alerts: count}
    """
    try:
        current_user_id = int(get_jwt_identity())
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check authorization
        cursor.execute('SELECT role FROM users WHERE id = ?', (current_user_id,))
        user = cursor.fetchone()
        
        if not user or (user['role'] != 'admin' and current_user_id != faculty_id):
            conn.close()
            return jsonify({"status": "error", "message": "Unauthorized"}), 403
        
        conn.close()
        
        # Count alerts from feedback database
        feedback_conn = get_feedback_db_connection()
        feedback_cursor = feedback_conn.cursor()
        
        feedback_cursor.execute('''
            SELECT COUNT(*) as total 
            FROM feedback_analysis 
            WHERE faculty_id = ? AND alert_flag = 1
        ''', (faculty_id,))
        
        row = feedback_cursor.fetchone()
        feedback_conn.close()
        
        return jsonify({"alerts": row['total'] if row else 0}), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@analytics_bp.route('/api/faculty/<int:faculty_id>/trends', methods=['GET'])
@jwt_required()
def get_feedback_trends(faculty_id):
    """
    Get sentiment trends over time
    Returns: [{date, positive, negative, neutral, total}, ...]
    """
    try:
        current_user_id = int(get_jwt_identity())
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check authorization
        cursor.execute('SELECT role FROM users WHERE id = ?', (current_user_id,))
        user = cursor.fetchone()
        
        if not user or (user['role'] != 'admin' and current_user_id != faculty_id):
            conn.close()
            return jsonify({"status": "error", "message": "Unauthorized"}), 403
        
        # Get time range from query params (default: 6 months)
        months = request.args.get('months', 6, type=int)
        
        conn.close()
        
        # Get sentiment trends from feedback database
        feedback_conn = get_feedback_db_connection()
        feedback_cursor = feedback_conn.cursor()
        
        feedback_cursor.execute('''
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
        
        rows = feedback_cursor.fetchall()
        feedback_conn.close()
        
        # Format results
        trend_data = []
        for row in rows:
            trend_data.append({
                'date': row['date'],
                'positive': row['positive'],
                'negative': row['negative'],
                'neutral': row['neutral'],
                'total': row['total']
            })
        
        return jsonify(trend_data), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@analytics_bp.route('/api/faculty/<int:faculty_id>/monthly_summary', methods=['GET'])
@jwt_required()
def get_monthly_summary(faculty_id):
    """
    Get monthly aggregated data for charts
    Returns: [{month, positive, negative, neutral, total}, ...]
    """
    try:
        current_user_id = int(get_jwt_identity())
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check authorization
        cursor.execute('SELECT role FROM users WHERE id = ?', (current_user_id,))
        user = cursor.fetchone()
        
        if not user or (user['role'] != 'admin' and current_user_id != faculty_id):
            conn.close()
            return jsonify({"status": "error", "message": "Unauthorized"}), 403
        
        conn.close()
        
        # Get monthly data from feedback database
        feedback_conn = get_feedback_db_connection()
        feedback_cursor = feedback_conn.cursor()
        
        feedback_cursor.execute('''
            SELECT 
                strftime('%Y-%m', created_at) as month,
                SUM(CASE WHEN UPPER(sentiment) = 'POSITIVE' THEN 1 ELSE 0 END) as positive,
                SUM(CASE WHEN UPPER(sentiment) = 'NEGATIVE' THEN 1 ELSE 0 END) as negative,
                SUM(CASE WHEN UPPER(sentiment) = 'NEUTRAL' THEN 1 ELSE 0 END) as neutral,
                COUNT(*) as total
            FROM feedback_analysis
            WHERE faculty_id = ? 
            AND created_at >= date('now', '-6 months')
            GROUP BY strftime('%Y-%m', created_at)
            ORDER BY strftime('%Y-%m', created_at)
        ''', (faculty_id,))
        
        rows = feedback_cursor.fetchall()
        feedback_conn.close()
        
        # Format results with month names
        monthly_data = []
        for row in rows:
            # Convert YYYY-MM to month name
            month_date = datetime.strptime(row['month'], '%Y-%m')
            month_name = month_date.strftime('%b')
            
            # Calculate percentages
            total = row['total']
            monthly_data.append({
                'month': month_name,
                'positive': round((row['positive'] / total * 100) if total > 0 else 0, 1),
                'negative': round((row['negative'] / total * 100) if total > 0 else 0, 1),
                'neutral': round((row['neutral'] / total * 100) if total > 0 else 0, 1),
                'total': total
            })
        
        return jsonify(monthly_data), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@analytics_bp.route('/api/faculty/<int:faculty_id>/category_scores', methods=['GET'])
@jwt_required()
def get_category_scores(faculty_id):
    """
    Get average scores by category (based on sentiment)
    Returns: [{category, current, previous, target}, ...]
    """
    try:
        current_user_id = int(get_jwt_identity())
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check authorization
        cursor.execute('SELECT role FROM users WHERE id = ?', (current_user_id,))
        user = cursor.fetchone()
        
        if not user or (user['role'] != 'admin' and current_user_id != faculty_id):
            conn.close()
            return jsonify({"status": "error", "message": "Unauthorized"}), 403
        
        conn.close()
        
        # Get data from feedback database
        feedback_conn = get_feedback_db_connection()
        feedback_cursor = feedback_conn.cursor()
        
        # Get current period scores (last 30 days)
        feedback_cursor.execute('''
            SELECT 
                category,
                COUNT(*) as total,
                SUM(CASE WHEN UPPER(sentiment) = 'POSITIVE' THEN 1 ELSE 0 END) as positive
            FROM feedback_analysis
            WHERE faculty_id = ? 
            AND category IS NOT NULL 
            AND category != ''
            AND created_at >= date('now', '-30 days')
            GROUP BY category
        ''', (faculty_id,))
        
        current_rows = feedback_cursor.fetchall()
        
        # Get previous period scores (30-60 days ago)
        feedback_cursor.execute('''
            SELECT 
                category,
                COUNT(*) as total,
                SUM(CASE WHEN UPPER(sentiment) = 'POSITIVE' THEN 1 ELSE 0 END) as positive
            FROM feedback_analysis
            WHERE faculty_id = ? 
            AND category IS NOT NULL 
            AND category != ''
            AND created_at >= date('now', '-60 days')
            AND created_at < date('now', '-30 days')
            GROUP BY category
        ''', (faculty_id,))
        
        previous_rows = feedback_cursor.fetchall()
        feedback_conn.close()
        
        # Process data
        current_scores = {}
        for row in current_rows:
            score = round((row['positive'] / row['total'] * 100) if row['total'] > 0 else 0)
            current_scores[row['category']] = score
        
        previous_scores = {}
        for row in previous_rows:
            score = round((row['positive'] / row['total'] * 100) if row['total'] > 0 else 0)
            previous_scores[row['category']] = score
        
        # Combine and format
        result = []
        for category in current_scores.keys():
            result.append({
                'category': category,
                'current': current_scores[category],
                'previous': previous_scores.get(category, current_scores[category]),
                'target': min(current_scores[category] + 10, 100)  # Target is 10% higher or 100
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@analytics_bp.route('/api/faculty/<int:faculty_id>/student_feedbacks', methods=['GET'])
@jwt_required()
def get_student_feedbacks(faculty_id):
    """
    Get all student-submitted feedbacks with analysis for a faculty member
    """
    try:
        from feedback_database import get_feedback_db_connection
        
        conn = get_feedback_db_connection()
        cursor = conn.cursor()
        
        # Get all feedback analysis for this faculty
        cursor.execute('''
            SELECT 
                id,
                student_id,
                course,
                faculty_name,
                feedback_text,
                sentiment,
                category,
                suggestion,
                summary,
                alert_flag,
                created_at
            FROM feedback_analysis
            WHERE faculty_id = ?
            ORDER BY created_at DESC
        ''', (faculty_id,))
        
        rows = cursor.fetchall()
        conn.close()
        
        feedbacks = []
        for row in rows:
            feedbacks.append({
                'id': row['id'],
                'student_id': row['student_id'] or 'Unknown',
                'course': row['course'] or 'N/A',
                'faculty': row['faculty_name'] or 'N/A',
                'feedback': row['feedback_text'],
                'sentiment': row['sentiment'],
                'category': row['category'],
                'suggestion': row['suggestion'],
                'summary': row['summary'],
                'alert': bool(row['alert_flag']),
                'created_at': row['created_at']
            })
        
        return jsonify({
            'status': 'success',
            'feedbacks': feedbacks,
            'count': len(feedbacks)
        }), 200
        
    except Exception as e:
        print(f"Error fetching student feedbacks: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@analytics_bp.route('/api/faculty/<int:faculty_id>/stats_summary', methods=['GET'])
@jwt_required()
def get_stats_summary(faculty_id):
    """
    Get overall statistics summary
    Returns: {total_feedback, avg_sentiment_score, response_rate, improvement}
    """
    try:
        current_user_id = int(get_jwt_identity())
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check authorization
        cursor.execute('SELECT role FROM users WHERE id = ?', (current_user_id,))
        user = cursor.fetchone()
        
        if not user or (user['role'] != 'admin' and current_user_id != faculty_id):
            conn.close()
            return jsonify({"status": "error", "message": "Unauthorized"}), 403
        
        conn.close()
        
        # Get data from feedback database
        feedback_conn = get_feedback_db_connection()
        feedback_cursor = feedback_conn.cursor()
        
        # Get total feedback count
        feedback_cursor.execute('''
            SELECT COUNT(*) as total FROM feedback_analysis WHERE faculty_id = ?
        ''', (faculty_id,))
        total = feedback_cursor.fetchone()['total']
        
        # Get sentiment distribution
        feedback_cursor.execute('''
            SELECT 
                SUM(CASE WHEN UPPER(sentiment) = 'POSITIVE' THEN 1 ELSE 0 END) as positive,
                SUM(CASE WHEN UPPER(sentiment) = 'NEGATIVE' THEN 1 ELSE 0 END) as negative,
                SUM(CASE WHEN UPPER(sentiment) = 'NEUTRAL' THEN 1 ELSE 0 END) as neutral
            FROM feedback_analysis
            WHERE faculty_id = ?
        ''', (faculty_id,))
        
        sentiment = feedback_cursor.fetchone()
        
        # Calculate average sentiment score (positive=100, neutral=50, negative=0)
        if total > 0:
            avg_score = round(
                (sentiment['positive'] * 100 + sentiment['neutral'] * 50) / total, 1
            )
        else:
            avg_score = 0
        
        # Get current month vs previous month for improvement
        feedback_cursor.execute('''
            SELECT COUNT(*) as current_month
            FROM feedback_analysis
            WHERE faculty_id = ? AND created_at >= date('now', 'start of month')
        ''', (faculty_id,))
        current_month = feedback_cursor.fetchone()['current_month']
        
        feedback_cursor.execute('''
            SELECT COUNT(*) as previous_month
            FROM feedback_analysis
            WHERE faculty_id = ? 
            AND created_at >= date('now', 'start of month', '-1 month')
            AND created_at < date('now', 'start of month')
        ''', (faculty_id,))
        previous_month = feedback_cursor.fetchone()['previous_month']
        
        feedback_conn.close()
        
        # Calculate improvement percentage
        if previous_month > 0:
            improvement = round(((current_month - previous_month) / previous_month) * 100, 1)
        else:
            improvement = 0
        
        return jsonify({
            'total_feedback': total,
            'avg_sentiment_score': avg_score,
            'positive_percentage': round((sentiment['positive'] / total * 100) if total > 0 else 0, 1),
            'response_rate': 94,  # This would need actual student count data
            'improvement': improvement
        }), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

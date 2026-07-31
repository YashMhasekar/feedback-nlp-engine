from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import re
from database import get_db_connection

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength (minimum 6 characters)"""
    return len(password) >= 6

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    """
    User registration endpoint
    Accepts: first_name, last_name, email, department, employee_id, password, confirm_password, role
    Returns: User info and JWT token
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'email', 'password', 'confirm_password', 'role']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    "status": "error",
                    "message": f"Missing required field: {field}"
                }), 400
        
        first_name = data['first_name'].strip()
        last_name = data['last_name'].strip()
        email = data['email'].strip().lower()
        department = data.get('department', '').strip()
        employee_id = data.get('employee_id', '').strip()
        password = data['password']
        confirm_password = data['confirm_password']
        role = data['role'].lower()
        
        # Validate email format
        if not validate_email(email):
            return jsonify({
                "status": "error",
                "message": "Invalid email format"
            }), 400
        
        # Validate password match
        if password != confirm_password:
            return jsonify({
                "status": "error",
                "message": "Passwords do not match"
            }), 400
        
        # Validate password strength
        if not validate_password(password):
            return jsonify({
                "status": "error",
                "message": "Password must be at least 6 characters long"
            }), 400
        
        # Validate role
        if role not in ['admin', 'faculty']:
            return jsonify({
                "status": "error",
                "message": "Invalid role. Must be 'admin' or 'faculty'"
            }), 400
        
        # Check if email already exists
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            conn.close()
            return jsonify({
                "status": "error",
                "message": "Email already registered"
            }), 400
        
        # Hash password
        hashed_password = generate_password_hash(password)
        
        # Insert new user
        cursor.execute('''
            INSERT INTO users (first_name, last_name, email, department, employee_id, password, role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (first_name, last_name, email, department, employee_id, hashed_password, role))
        
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        
        # Create JWT token (identity must be string)
        access_token = create_access_token(identity=str(user_id))
        
        return jsonify({
            "status": "ok",
            "user": {
                "id": user_id,
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "department": department,
                "employee_id": employee_id,
                "role": role
            },
            "token": access_token
        }), 201
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Server error: {str(e)}"
        }), 500

@auth_bp.route('/api/login', methods=['POST'])
def login():
    """
    User login endpoint
    Accepts: email, password
    Returns: User info and JWT token
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({
                "status": "error",
                "message": "Email and password are required"
            }), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        # Find user by email
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, first_name, last_name, email, department, employee_id, password, role
            FROM users WHERE email = ?
        ''', (email,))
        
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({
                "status": "error",
                "message": "Invalid credentials"
            }), 401
        
        # Verify password
        if not check_password_hash(user['password'], password):
            return jsonify({
                "status": "error",
                "message": "Invalid credentials"
            }), 401
        
        # Create JWT token (identity must be string)
        access_token = create_access_token(identity=str(user['id']))
        
        return jsonify({
            "status": "ok",
            "user": {
                "id": user['id'],
                "first_name": user['first_name'],
                "last_name": user['last_name'],
                "email": user['email'],
                "department": user['department'],
                "employee_id": user['employee_id'],
                "role": user['role']
            },
            "token": access_token
        }), 200
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Server error: {str(e)}"
        }), 500

@auth_bp.route('/api/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Get current user info (requires JWT token)
    Returns: User info
    """
    try:
        user_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, first_name, last_name, email, department, employee_id, role
            FROM users WHERE id = ?
        ''', (int(user_id),))
        
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({
                "status": "error",
                "message": "User not found"
            }), 404
        
        return jsonify({
            "status": "ok",
            "user": {
                "id": user['id'],
                "first_name": user['first_name'],
                "last_name": user['last_name'],
                "email": user['email'],
                "department": user['department'],
                "employee_id": user['employee_id'],
                "role": user['role']
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Server error: {str(e)}"
        }), 500

# Helper function to save analyzed feedback to database
# This will be called from the main app after NLP analysis
def save_feedback_analysis(faculty_id, student_id, feedback_text, sentiment, category, suggestion, alert, summary):
    """
    Save analyzed feedback to database
    NOTE: This function should be called after analyze_feedback_csv() processes the data
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO feedback_analysis 
            (faculty_id, student_id, feedback_text, sentiment, category, suggestion, alert, summary)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (faculty_id, student_id, feedback_text, sentiment, category, suggestion, alert, summary))
        
        conn.commit()
        feedback_id = cursor.lastrowid
        conn.close()
        
        return feedback_id
    
    except Exception as e:
        print(f"Error saving feedback analysis: {str(e)}")
        return None

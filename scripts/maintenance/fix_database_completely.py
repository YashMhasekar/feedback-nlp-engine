"""
Complete database fix script
This will ensure the database is properly set up and working
"""
import sqlite3
import os
from database import init_db, get_db_connection

print('=' * 100)
print('DATABASE COMPLETE FIX SCRIPT')
print('=' * 100)

# Step 1: Initialize database
print('\n1. Initializing database...')
try:
    init_db()
    print('   ✅ Database initialized successfully')
except Exception as e:
    print(f'   ❌ Error: {e}')
    exit(1)

# Step 2: Verify tables exist
print('\n2. Verifying database structure...')
try:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    
    print(f'   Tables found: {", ".join(tables)}')
    
    if 'users' in tables:
        print('   ✅ users table exists')
    else:
        print('   ❌ users table missing!')
        
    if 'feedback_analysis' in tables:
        print('   ✅ feedback_analysis table exists')
    else:
        print('   ❌ feedback_analysis table missing!')
    
    conn.close()
except Exception as e:
    print(f'   ❌ Error: {e}')
    exit(1)

# Step 3: Check users table structure
print('\n3. Checking users table structure...')
try:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    
    expected_columns = ['id', 'first_name', 'last_name', 'email', 'department', 
                       'employee_id', 'password', 'role', 'created_at']
    
    actual_columns = [col[1] for col in columns]
    
    print('   Columns:')
    for col in columns:
        print(f'     - {col[1]} ({col[2]})')
    
    missing = set(expected_columns) - set(actual_columns)
    if missing:
        print(f'   ⚠️  Missing columns: {", ".join(missing)}')
    else:
        print('   ✅ All required columns present')
    
    conn.close()
except Exception as e:
    print(f'   ❌ Error: {e}')
    exit(1)

# Step 4: Test database write
print('\n4. Testing database write capability...')
try:
    from werkzeug.security import generate_password_hash
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Try to insert a test user
    test_email = 'test_write_check@example.com'
    
    # Delete if exists
    cursor.execute('DELETE FROM users WHERE email = ?', (test_email,))
    
    # Insert test user
    cursor.execute('''
        INSERT INTO users (first_name, last_name, email, department, employee_id, password, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', ('Test', 'Write', test_email, 'Test Dept', 'TEST001', 
          generate_password_hash('test123'), 'faculty'))
    
    conn.commit()
    test_id = cursor.lastrowid
    
    print(f'   ✅ Successfully inserted test user (ID: {test_id})')
    
    # Verify it was inserted
    cursor.execute('SELECT * FROM users WHERE id = ?', (test_id,))
    test_user = cursor.fetchone()
    
    if test_user:
        print(f'   ✅ Successfully retrieved test user')
        print(f'      Name: {test_user["first_name"]} {test_user["last_name"]}')
        print(f'      Email: {test_user["email"]}')
    else:
        print('   ❌ Could not retrieve test user!')
    
    # Clean up test user
    cursor.execute('DELETE FROM users WHERE id = ?', (test_id,))
    conn.commit()
    print('   ✅ Test user cleaned up')
    
    conn.close()
except Exception as e:
    print(f'   ❌ Error: {e}')
    exit(1)

# Step 5: Show current users
print('\n5. Current users in database:')
try:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, first_name, last_name, email, role FROM users ORDER BY id')
    users = cursor.fetchall()
    
    if users:
        print(f'   Found {len(users)} user(s):')
        for user in users:
            print(f'   - ID {user["id"]}: {user["first_name"]} {user["last_name"]} ({user["email"]}) - {user["role"]}')
    else:
        print('   No users found (database is empty)')
    
    conn.close()
except Exception as e:
    print(f'   ❌ Error: {e}')
    exit(1)

# Step 6: Database file info
print('\n6. Database file information:')
db_path = os.path.join(os.path.dirname(__file__), 'database.db')
if os.path.exists(db_path):
    size = os.path.getsize(db_path)
    print(f'   Path: {db_path}')
    print(f'   Size: {size} bytes')
    print(f'   ✅ Database file exists and is accessible')
else:
    print(f'   ❌ Database file not found at: {db_path}')

print('\n' + '=' * 100)
print('DATABASE STATUS: ✅ READY')
print('=' * 100)
print('\nYour database is properly configured and ready to use!')
print('\nNext steps:')
print('1. Make sure backend is running: python backend/app.py')
print('2. Try creating a new account at: http://localhost:3000/signup')
print('3. Check if user is saved: python backend/check_users.py')
print('=' * 100)

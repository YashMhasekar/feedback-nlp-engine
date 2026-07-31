"""
Script to create an admin user
"""
from werkzeug.security import generate_password_hash
import sqlite3

def create_admin():
    """Create an admin user"""
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Check if admin already exists
    cursor.execute("SELECT * FROM users WHERE email = ?", ('admin@example.com',))
    if cursor.fetchone():
        print("❌ Admin user already exists with email: admin@example.com")
        conn.close()
        return
    
    # Create admin user
    cursor.execute('''
        INSERT INTO users (first_name, last_name, email, department, employee_id, password, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        'Admin',
        'User',
        'admin@example.com',
        'Administration',
        'ADM001',
        generate_password_hash('admin123'),
        'admin'
    ))
    
    conn.commit()
    conn.close()
    
    print("\n" + "="*60)
    print("✅ ADMIN USER CREATED SUCCESSFULLY!")
    print("="*60)
    print("\n📧 Email: admin@example.com")
    print("🔑 Password: admin123")
    print("👔 Role: Admin")
    print("\n🌐 Login at: http://localhost:3011/login")
    print("="*60 + "\n")

if __name__ == '__main__':
    create_admin()

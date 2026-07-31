"""
Script to view all users in the database
"""
import sqlite3
from datetime import datetime

def view_all_users():
    """Display all users in a formatted table"""
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users ORDER BY created_at DESC')
    users = cursor.fetchall()
    
    if not users:
        print("\n❌ No users found in database")
        conn.close()
        return
    
    print("\n" + "="*120)
    print("👥 REGISTERED USERS")
    print("="*120)
    print(f"{'ID':<5} {'Name':<25} {'Email':<30} {'Department':<20} {'Emp ID':<10} {'Role':<10} {'Created':<20}")
    print("-"*120)
    
    for user in users:
        name = f"{user['first_name']} {user['last_name']}"
        created = user['created_at']
        
        print(f"{user['id']:<5} {name:<25} {user['email']:<30} {user['department'] or 'N/A':<20} {user['employee_id'] or 'N/A':<10} {user['role']:<10} {created:<20}")
    
    print("-"*120)
    print(f"Total Users: {len(users)}")
    print("="*120)
    
    # Show password hashes (for verification)
    print("\n🔐 PASSWORD HASHES (for verification):")
    print("-"*120)
    for user in users:
        print(f"User: {user['email']}")
        print(f"Hash: {user['password'][:50]}...")
        print()
    
    conn.close()

def view_user_by_email(email):
    """View specific user details"""
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    
    if not user:
        print(f"\n❌ User not found: {email}")
        conn.close()
        return
    
    print("\n" + "="*80)
    print("👤 USER DETAILS")
    print("="*80)
    print(f"ID:           {user['id']}")
    print(f"First Name:   {user['first_name']}")
    print(f"Last Name:    {user['last_name']}")
    print(f"Email:        {user['email']}")
    print(f"Department:   {user['department'] or 'N/A'}")
    print(f"Employee ID:  {user['employee_id'] or 'N/A'}")
    print(f"Role:         {user['role']}")
    print(f"Created At:   {user['created_at']}")
    print(f"Password Hash: {user['password'][:50]}...")
    print("="*80)
    
    conn.close()

def count_users_by_role():
    """Count users by role"""
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT role, COUNT(*) as count FROM users GROUP BY role')
    results = cursor.fetchall()
    
    print("\n" + "="*40)
    print("📊 USERS BY ROLE")
    print("="*40)
    for role, count in results:
        print(f"{role.capitalize()}: {count}")
    print("="*40)
    
    conn.close()

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1:
        # View specific user
        email = sys.argv[1]
        view_user_by_email(email)
    else:
        # View all users
        view_all_users()
        count_users_by_role()
        
        print("\n💡 TIP: To view a specific user, run:")
        print("   python view_users.py user@example.com")

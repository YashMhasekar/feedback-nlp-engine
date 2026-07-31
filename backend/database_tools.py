"""
Database Management Tools
View, search, and manage users in the database
"""
import sqlite3
from datetime import datetime
import sys

def get_connection():
    """Get database connection"""
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def view_all_users():
    """Display all users"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users ORDER BY created_at DESC')
    users = cursor.fetchall()
    
    if not users:
        print("\n❌ No users found")
        conn.close()
        return
    
    print("\n" + "="*120)
    print("👥 ALL REGISTERED USERS")
    print("="*120)
    print(f"{'ID':<5} {'Name':<25} {'Email':<35} {'Department':<20} {'Role':<10} {'Created':<20}")
    print("-"*120)
    
    for user in users:
        name = f"{user['first_name']} {user['last_name']}"
        print(f"{user['id']:<5} {name:<25} {user['email']:<35} {user['department'] or 'N/A':<20} {user['role']:<10} {user['created_at']:<20}")
    
    print("-"*120)
    print(f"Total: {len(users)} users")
    print("="*120 + "\n")
    
    conn.close()

def search_user(search_term):
    """Search users by name or email"""
    conn = get_connection()
    cursor = conn.cursor()
    
    query = '''
        SELECT * FROM users 
        WHERE first_name LIKE ? 
        OR last_name LIKE ? 
        OR email LIKE ?
        ORDER BY created_at DESC
    '''
    
    search_pattern = f"%{search_term}%"
    cursor.execute(query, (search_pattern, search_pattern, search_pattern))
    users = cursor.fetchall()
    
    if not users:
        print(f"\n❌ No users found matching: {search_term}")
        conn.close()
        return
    
    print(f"\n🔍 SEARCH RESULTS for '{search_term}'")
    print("="*120)
    print(f"{'ID':<5} {'Name':<25} {'Email':<35} {'Department':<20} {'Role':<10}")
    print("-"*120)
    
    for user in users:
        name = f"{user['first_name']} {user['last_name']}"
        print(f"{user['id']:<5} {name:<25} {user['email']:<35} {user['department'] or 'N/A':<20} {user['role']:<10}")
    
    print("-"*120)
    print(f"Found: {len(users)} users\n")
    
    conn.close()

def view_user_details(user_id):
    """View detailed information for a specific user"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    if not user:
        print(f"\n❌ User ID {user_id} not found")
        conn.close()
        return
    
    print("\n" + "="*80)
    print(f"👤 USER DETAILS (ID: {user['id']})")
    print("="*80)
    print(f"Name:         {user['first_name']} {user['last_name']}")
    print(f"Email:        {user['email']}")
    print(f"Department:   {user['department'] or 'N/A'}")
    print(f"Employee ID:  {user['employee_id'] or 'N/A'}")
    print(f"Role:         {user['role'].upper()}")
    print(f"Created:      {user['created_at']}")
    print(f"Password:     {user['password'][:30]}... (hashed)")
    print("="*80 + "\n")
    
    conn.close()

def count_by_role():
    """Count users by role"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT role, COUNT(*) as count FROM users GROUP BY role')
    results = cursor.fetchall()
    
    print("\n📊 STATISTICS")
    print("="*40)
    
    total = 0
    for row in results:
        role = row['role'].capitalize()
        count = row['count']
        total += count
        print(f"{role:<15} {count:>5} users")
    
    print("-"*40)
    print(f"{'Total':<15} {total:>5} users")
    print("="*40 + "\n")
    
    conn.close()

def delete_user(user_id):
    """Delete a user (use with caution!)"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # First check if user exists
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    if not user:
        print(f"\n❌ User ID {user_id} not found")
        conn.close()
        return
    
    print(f"\n⚠️  WARNING: About to delete user:")
    print(f"   ID: {user['id']}")
    print(f"   Name: {user['first_name']} {user['last_name']}")
    print(f"   Email: {user['email']}")
    
    confirm = input("\nType 'DELETE' to confirm: ")
    
    if confirm == 'DELETE':
        cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
        conn.commit()
        print(f"\n✅ User {user_id} deleted successfully")
    else:
        print("\n❌ Deletion cancelled")
    
    conn.close()

def export_to_csv():
    """Export all users to CSV"""
    import csv
    
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, first_name, last_name, email, department, employee_id, role, created_at FROM users ORDER BY created_at DESC')
    users = cursor.fetchall()
    
    if not users:
        print("\n❌ No users to export")
        conn.close()
        return
    
    filename = f"users_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['ID', 'First Name', 'Last Name', 'Email', 'Department', 'Employee ID', 'Role', 'Created At'])
        
        for user in users:
            writer.writerow([
                user['id'],
                user['first_name'],
                user['last_name'],
                user['email'],
                user['department'] or '',
                user['employee_id'] or '',
                user['role'],
                user['created_at']
            ])
    
    print(f"\n✅ Exported {len(users)} users to: {filename}\n")
    conn.close()

def show_menu():
    """Show interactive menu"""
    print("\n" + "="*60)
    print("🗄️  DATABASE MANAGEMENT TOOLS")
    print("="*60)
    print("1. View all users")
    print("2. Search users")
    print("3. View user details (by ID)")
    print("4. Show statistics")
    print("5. Export to CSV")
    print("6. Delete user (by ID)")
    print("0. Exit")
    print("="*60)

def main():
    """Main interactive menu"""
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == 'list':
            view_all_users()
        elif command == 'stats':
            count_by_role()
        elif command == 'search' and len(sys.argv) > 2:
            search_user(sys.argv[2])
        elif command == 'view' and len(sys.argv) > 2:
            view_user_details(int(sys.argv[2]))
        elif command == 'export':
            export_to_csv()
        else:
            print("\nUsage:")
            print("  python database_tools.py list              - View all users")
            print("  python database_tools.py stats             - Show statistics")
            print("  python database_tools.py search <term>     - Search users")
            print("  python database_tools.py view <id>         - View user details")
            print("  python database_tools.py export            - Export to CSV")
            print("\nOr run without arguments for interactive menu")
    else:
        # Interactive menu
        while True:
            show_menu()
            choice = input("\nEnter choice: ").strip()
            
            if choice == '0':
                print("\n👋 Goodbye!\n")
                break
            elif choice == '1':
                view_all_users()
            elif choice == '2':
                term = input("Enter search term: ").strip()
                if term:
                    search_user(term)
            elif choice == '3':
                user_id = input("Enter user ID: ").strip()
                if user_id.isdigit():
                    view_user_details(int(user_id))
            elif choice == '4':
                count_by_role()
            elif choice == '5':
                export_to_csv()
            elif choice == '6':
                user_id = input("Enter user ID to delete: ").strip()
                if user_id.isdigit():
                    delete_user(int(user_id))
            else:
                print("\n❌ Invalid choice")
            
            input("\nPress Enter to continue...")

if __name__ == '__main__':
    main()

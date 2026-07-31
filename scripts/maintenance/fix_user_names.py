"""
Script to fix user names in the database.
This will help correct any issues with duplicate names or incorrect formatting.
"""
import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'database.db')
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

print('=' * 100)
print('CURRENT USERS IN DATABASE:')
print('=' * 100)

cursor.execute('SELECT id, first_name, last_name, email, role FROM users')
users = cursor.fetchall()

for user in users:
    print(f"\nID: {user['id']}")
    print(f"  First Name: '{user['first_name']}'")
    print(f"  Last Name:  '{user['last_name']}'")
    print(f"  Email:      {user['email']}")
    print(f"  Role:       {user['role']}")
    print(f"  Display:    '{user['first_name']} {user['last_name']}'")

print('\n' + '=' * 100)
print('FIX OPTIONS:')
print('=' * 100)
print('\nTo fix a user\'s name, you can run SQL commands like:')
print('  UPDATE users SET first_name = \'John\', last_name = \'Smith\' WHERE id = 2;')
print('\nOr delete and recreate the user account.')
print('\n' + '=' * 100)

# Example: Fix user ID 2 (Dinesh Shid Shid -> Dinesh Shid)
print('\nDETECTED ISSUE:')
print('User ID 2 has:')
print('  First Name: "Dinesh Shid"')
print('  Last Name: "Shid"')
print('  This creates: "Dinesh Shid Shid"')
print('\nSuggested fix:')
print('  First Name: "Dinesh"')
print('  Last Name: "Shid"')
print('  This creates: "Dinesh Shid"')

print('\n' + '=' * 100)
response = input('\nDo you want to fix user ID 2? (yes/no): ').strip().lower()

if response == 'yes':
    cursor.execute('UPDATE users SET first_name = ?, last_name = ? WHERE id = ?', 
                   ('Dinesh', 'Shid', 2))
    conn.commit()
    print('✅ User ID 2 fixed!')
    print('   First Name: "Dinesh"')
    print('   Last Name: "Shid"')
    print('   Display: "Dinesh Shid"')
else:
    print('No changes made.')

print('\n' + '=' * 100)
print('UPDATED USERS:')
print('=' * 100)

cursor.execute('SELECT id, first_name, last_name, email FROM users')
users = cursor.fetchall()

for user in users:
    print(f"ID {user['id']}: {user['first_name']} {user['last_name']} ({user['email']})")

conn.close()

print('\n' + '=' * 100)
print('IMPORTANT: After fixing the database, you must:')
print('1. Logout from the dashboard')
print('2. Clear browser cache (Ctrl+Shift+Delete)')
print('3. Or open browser console (F12) and run: localStorage.clear()')
print('4. Login again')
print('=' * 100)

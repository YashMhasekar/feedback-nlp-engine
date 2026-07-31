"""
Force a new analysis by uploading the file
"""
import requests

url = "http://localhost:5002/api/analyze-feedback"
file_path = "uploads/student_feedback.csv"

print("🔄 Forcing new analysis...")
print("="*60)

try:
    with open(file_path, 'rb') as f:
        files = {'file': ('student_feedback.csv', f, 'text/csv')}
        response = requests.post(url, files=files, timeout=120)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ Analysis completed!")
        print(f"\n📝 SUMMARY RETURNED:")
        print("="*60)
        print(data.get('summary', 'NO SUMMARY'))
        print("="*60)
        
        print(f"\n📊 Stats:")
        stats = data.get('stats', {})
        for key, value in stats.items():
            print(f"   {key}: {value}")
        
        print(f"\n📋 Rows: {len(data.get('rows', []))}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

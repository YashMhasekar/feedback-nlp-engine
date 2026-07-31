"""
Display analyzed feedback results in a beautiful format
"""
import pandas as pd
from pathlib import Path

def print_separator(char="=", length=80):
    print(char * length)

def print_header(text):
    print_separator()
    print(f"  {text}")
    print_separator()

def display_results():
    """Display the analyzed feedback results"""
    
    analyzed_file = "backend/uploads/analyzed_student_feedback.csv"
    
    print_header("📊 STUDENT FEEDBACK ANALYSIS RESULTS")
    
    # Check if file exists
    if not Path(analyzed_file).exists():
        print(f"❌ Error: File not found: {analyzed_file}")
        return
    
    # Read the analyzed file
    df = pd.read_csv(analyzed_file)
    
    print(f"\n✓ Loaded analyzed file: {analyzed_file}")
    print(f"✓ Total entries: {len(df)}")
    
    # Calculate statistics
    print_header("📈 STATISTICS")
    
    sentiment_counts = df['Sentiment'].value_counts()
    total = len(df)
    
    print(f"""
  Total Feedback Entries: {total}
  
  Sentiment Distribution:
    • Positive: {sentiment_counts.get('POSITIVE', 0)} ({sentiment_counts.get('POSITIVE', 0) / total * 100:.1f}%)
    • Neutral:  {sentiment_counts.get('NEUTRAL', 0)} ({sentiment_counts.get('NEUTRAL', 0) / total * 100:.1f}%)
    • Negative: {sentiment_counts.get('NEGATIVE', 0)} ({sentiment_counts.get('NEGATIVE', 0) / total * 100:.1f}%)
  
  Category Distribution:
    """)
    
    category_counts = df['Category'].value_counts()
    for category, count in category_counts.items():
        print(f"    • {category}: {count} ({count / total * 100:.1f}%)")
    
    # Check for alerts
    if 'Alert' in df.columns:
        alerts = df['Alert'].sum() if df['Alert'].dtype == 'int64' else (df['Alert'] == 'Yes').sum()
        print(f"\n  Alerts: {alerts}")
    
    # Display detailed results
    print_header("📋 DETAILED ANALYSIS RESULTS")
    print(f"\nShowing all {len(df)} results:\n")
    
    for i, row in df.iterrows():
        sentiment_emoji = {
            'POSITIVE': '😊',
            'NEUTRAL': '😐',
            'NEGATIVE': '😟'
        }.get(row['Sentiment'], '😐')
        
        alert_flag = ""
        if 'Alert' in row.index:
            if row['Alert'] == 'Yes' or row['Alert'] == True or row['Alert'] == 1:
                alert_flag = " 🚨 ALERT"
        
        print(f"{i+1}. Student ID: {row['student_id']}")
        print(f"   Feedback: {row['Feedback']}")
        print(f"   Sentiment: {sentiment_emoji} {row['Sentiment']}{alert_flag}")
        print(f"   Category: {row['Category']}")
        print(f"   Suggestion: {row['Suggestion']}")
        print()
    
    # Display summary
    if 'Summary' in df.columns and pd.notna(df['Summary'].iloc[0]):
        print_header("📝 OVERALL SUMMARY")
        print(f"\n{df['Summary'].iloc[0]}\n")
    
    print_separator()
    print("✅ Analysis display completed!")
    print_separator()

if __name__ == "__main__":
    display_results()

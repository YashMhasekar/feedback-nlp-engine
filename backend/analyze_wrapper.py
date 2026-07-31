"""
Wrapper for NLP Analysis
Converts feedback submissions to CSV, runs nlp_engine.py, and returns results
"""
import os
import pandas as pd
import uuid
from datetime import datetime

def run_nlp_analysis(feedback_list, temp_dir="uploads"):
    """
    Creates a temporary CSV from feedback_list, runs nlp_test.py, reads analyzed output.
    
    Args:
        feedback_list: List of dicts with keys: id, student_id, course, faculty, feedback
        temp_dir: Directory for temporary files
    
    Returns:
        List of analyzed results with sentiment, category, suggestion, alert
    """
    os.makedirs(temp_dir, exist_ok=True)
    
    # Generate unique filenames
    unique_id = uuid.uuid4().hex[:8]
    input_file = os.path.join(temp_dir, f"temp_input_{unique_id}.csv")
    output_file = os.path.join(temp_dir, f"analyzed_output_{unique_id}.csv")
    
    try:
        # Step 1: Create temporary input CSV
        print(f"📝 Creating temporary CSV with {len(feedback_list)} feedbacks...")
        
        # Prepare data for CSV
        csv_data = []
        for item in feedback_list:
            csv_data.append({
                'Student_ID': item.get('student_id', 'Unknown'),
                'Feedback': item.get('feedback', ''),
                'Faculty': item.get('faculty', 'Unknown'),
                'Course': item.get('course', 'Unknown')
            })
        
        df = pd.DataFrame(csv_data)
        df.to_csv(input_file, index=False)
        print(f"   ✓ Saved to: {input_file}")
        
        # Step 2: Run NLP analysis
        print(f"🔍 Running NLP analysis...")
        from nlp_engine import analyze_feedback_csv
        
        result = analyze_feedback_csv(
            input_file=input_file,
            feedback_column='Feedback',
            output_file=output_file
        )
        
        print(f"   ✓ Analysis complete")
        
        # Step 3: Read analyzed output
        print(f"📊 Reading analyzed results...")
        analyzed_df = pd.read_csv(output_file)
        
        # Step 4: Convert to list of dicts and merge with original IDs
        results = []
        for idx, row in analyzed_df.iterrows():
            if idx < len(feedback_list):
                result_dict = {
                    'student_feedback_id': feedback_list[idx].get('id'),
                    'student_id': str(row.get('Student_ID', feedback_list[idx].get('student_id'))),
                    'faculty': feedback_list[idx].get('faculty'),
                    'course': feedback_list[idx].get('course'),
                    'feedback': str(row.get('Feedback', '')),
                    'censored_feedback': str(row.get('Censored_Feedback', row.get('Feedback', ''))),
                    'sentiment': str(row.get('Sentiment', 'NEUTRAL')),
                    'category': str(row.get('Category', 'General')),
                    'suggestion': str(row.get('Suggestion', '')),
                    'summary': str(row.get('Summary', '')),
                    'alert': str(row.get('Alert', 'No')).lower() in ['yes', 'true', '1']
                }
                results.append(result_dict)
        
        print(f"   ✓ Processed {len(results)} results")
        
        # Step 5: Cleanup temporary files
        try:
            if os.path.exists(input_file):
                os.remove(input_file)
            if os.path.exists(output_file):
                os.remove(output_file)
            print(f"   ✓ Cleaned up temporary files")
        except Exception as e:
            print(f"   ⚠️ Could not delete temp files: {e}")
        
        return results
        
    except Exception as e:
        print(f"❌ Error in NLP analysis: {e}")
        import traceback
        traceback.print_exc()
        
        # Cleanup on error
        try:
            if os.path.exists(input_file):
                os.remove(input_file)
            if os.path.exists(output_file):
                os.remove(output_file)
        except:
            pass
        
        raise Exception(f"NLP analysis failed: {str(e)}")

if __name__ == '__main__':
    # Test the wrapper
    test_feedback = [
        {
            'id': 1,
            'student_id': 'S001',
            'course': 'Computer Science',
            'faculty': 'Dr. Smith',
            'feedback': 'Great teaching style and very helpful professor!'
        },
        {
            'id': 2,
            'student_id': 'S002',
            'course': 'Computer Science',
            'faculty': 'Dr. Smith',
            'feedback': 'I experienced harassment from a classmate.'
        }
    ]
    
    print("Testing NLP wrapper...")
    results = run_nlp_analysis(test_feedback)
    
    print("\nResults:")
    for r in results:
        print(f"  Student: {r['student_id']}")
        print(f"  Sentiment: {r['sentiment']}")
        print(f"  Alert: {r['alert']}")
        print()

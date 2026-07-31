# Flask Backend for Feedback Analyzer

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Flask Server

```bash
python app.py
```

The server will start on `http://localhost:5002`

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status

### Analyze Feedback
```
POST /api/analyze-feedback
```
**Body:** FormData with file
**Accepts:** CSV, XLSX, XLS, TSV files
**Returns:** Analysis results with sentiment, categories, suggestions, and alerts

### Download Analyzed File
```
GET /api/download-analyzed?file=<filepath>
```
Downloads the analyzed CSV file

## Configuration

- **Port:** 5002
- **CORS:** Enabled for http://localhost:4010
- **Upload Folder:** `uploads/`
- **Max File Size:** 16MB (default Flask limit)

## Integration with NLP Engine

The backend imports `analyze_feedback_csv()` from `nlp_test.py` in the parent directory.

Make sure your `nlp_test.py` file is in the main project folder and contains:

```python
def analyze_feedback_csv(input_file, feedback_column, output_file):
    # Your NLP analysis logic
    return {
        "status": "ok",
        "summary": "AI-generated summary",
        "stats": {
            "total": 0,
            "positive": 0,
            "neutral": 0,
            "negative": 0,
            "alerts": 0
        },
        "rows": [
            {
                "student_id": "S001",
                "feedback": "...",
                "sentiment": "POSITIVE",
                "category": "Teaching",
                "suggestion": "...",
                "alert": False
            }
        ],
        "analyzed_file": output_file
    }
```

## Testing

1. Start the Flask server: `python app.py`
2. Start the React frontend: `cd frontend && npm start`
3. Navigate to Faculty Dashboard
4. Upload a feedback file
5. View analysis results

## Troubleshooting

### Port Already in Use
If port 5002 is already in use, change it in `app.py`:
```python
app.run(debug=True, host="0.0.0.0", port=5003)
```

### CORS Issues
Make sure CORS is enabled and the frontend URL matches:
```python
CORS(app)  # Allows all origins in development
```

### File Upload Issues
- Check file size (max 16MB)
- Verify file format (CSV, XLSX, XLS, TSV)
- Ensure 'Feedback' column exists in your file
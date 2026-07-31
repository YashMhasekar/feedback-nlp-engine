# Feedback NLP Engine

A comprehensive AI-powered student feedback analysis system with real-time alerts, sentiment analysis, and actionable insights.

## 🌟 Features

- **AI-Powered Analysis**: Sentiment analysis, category classification, and intelligent suggestions using Google Gemini and Transformers
- **Real-Time Alerts**: Firebase-based instant notifications for sensitive feedback
- **Multilingual Support**: Profanity detection and keyword flagging in English, Hindi, and Marathi
- **Role-Based Access**: Separate dashboards for administrators and faculty
- **Comprehensive Analytics**: Trends, insights, and visualizations
- **Secure Authentication**: JWT-based authentication with role management

## 📁 Project Structure

```
Feedback NLP Engine/
│
├── backend/                    # Flask backend application
│   ├── *.py                    # Core backend modules
│   ├── *.db                    # Active SQLite databases
│   ├── uploads/                # User file uploads
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Backend environment config
│
├── frontend/                   # React frontend application
│   ├── src/                    # React source code
│   ├── public/                 # Static assets
│   ├── package.json            # Node dependencies
│   └── .env                    # Frontend environment config
│
├── docs/                       # Documentation
│   ├── setup/                  # Setup and installation guides
│   ├── architecture/           # System architecture docs
│   ├── guides/                 # User and developer guides
│   ├── api/                    # API documentation
│   └── changelog/              # Change history and summaries
│
├── scripts/                    # Utilities and automation
│   ├── startup/                # Application startup scripts
│   ├── setup/                  # Installation and setup scripts
│   ├── tests/                  # Test and verification scripts
│   ├── maintenance/            # Database and system maintenance
│   └── utils/                  # Helper utilities
│
├── test_data/                  # Sample test data files
│   ├── feedback.csv            # Sample feedback data
│   ├── test_alert_feedback.csv # Test data with alerts
│   └── ...                     # Other test datasets
│
├── generated/                  # Generated outputs (gitignored)
│   ├── analyses/               # Analysis results
│   └── exports/                # Exported data
│
├── archive/                    # Archived/deprecated files
│   ├── old_databases/          # Old database backups
│   ├── old_scripts/            # Deprecated scripts
│   └── legacy_code/            # Legacy code versions
│
├── nlp_test.py                 # Core NLP analysis engine
├── .env                        # Root environment config
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** with pip
- **Node.js 14+** with npm
- **Google Gemini API Key** (for AI summaries)
- **Firebase Project** (optional, for real-time alerts)

### Installation

#### 1. Install Dependencies

**Windows:**
```bash
# Run the automated installer
scripts\setup\INSTALL_DEPENDENCIES.bat
```

**Manual Installation:**
```bash
# Backend dependencies
cd backend
pip install -r requirements.txt

# Frontend dependencies
cd ../frontend
npm install
```

#### 2. Configure Environment

Copy the example environment files and add your API keys:

```bash
# Root .env
cp .env.example .env

# Backend .env
cp backend/.env.example backend/.env

# Frontend .env
cp frontend/.env.example frontend/.env
```

Edit the `.env` files and add:
- `GOOGLE_API_KEY` - Your Google Gemini API key
- Firebase configuration (if using real-time features)

#### 3. Initialize Database

```bash
# Windows
scripts\setup\init_database.bat

# Or manually
cd backend
python database.py
```

#### 4. Start the Application

**Option A: Start Everything (Recommended)**
```bash
# Windows - Starts both backend and frontend
scripts\startup\START_AUTH_SYSTEM.bat
```

**Option B: Start Separately**
```bash
# Terminal 1 - Backend
scripts\startup\START_BACKEND.bat

# Terminal 2 - Frontend
cd frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:4010
- **Backend API**: http://localhost:5002

### First Time Setup

1. **Create Admin Account**
   ```bash
   cd backend
   python ../scripts/maintenance/create_admin.py
   ```

2. **Access the Application**
   - Navigate to http://localhost:4010
   - Sign up as faculty or login as admin
   - Upload feedback CSV file
   - View analysis results and insights

## 📊 Usage

### For Faculty Members

1. **Login** to your faculty account
2. **Navigate to "Analyze Feedback"** tab
3. **Upload CSV** file with feedback (must have "Feedback" column)
4. **Wait for analysis** to complete
5. **View Results**:
   - Sentiment distribution
   - Category breakdown
   - Individual feedback with suggestions
   - Alerts for sensitive content
6. **Check Trends & Insights** for historical data

### For Administrators

1. **Login** to admin account
2. **View All Faculty** data in dashboard
3. **Manage Alerts** across all faculty
4. **Export Reports** as needed
5. **Create Faculty Accounts** through admin panel

### Supported File Formats

- CSV (`.csv`)
- Excel (`.xlsx`, `.xls`)
- TSV (`.tsv`)

### Required CSV Structure

Your feedback file must have at least these columns:
- `Feedback` - The feedback text (required)
- `Student_ID` - Student identifier (optional)
- `Course` - Course name (optional)
- `Faculty` - Faculty name (optional)

## 🔧 Configuration

### API Keys

**Google Gemini API** (Required for AI summaries)
- Get key from: https://makersuite.google.com/app/apikey
- Add to `.env`: `GOOGLE_API_KEY=your_key_here`

**Firebase** (Optional for real-time alerts)
- See `docs/setup/FIREBASE_SETUP_INSTRUCTIONS.md`

### Database Configuration

Active databases are stored in `backend/`:
- `database.db` - User authentication
- `feedback_analysis.db` - Feedback analysis results
- `student_feedback.db` - Student submissions

## 🧪 Testing

### Run Tests

```bash
# Test complete system
scripts\tests\test_complete_flow.py

# Test specific components
scripts\tests\test_alert_system.py
scripts\tests\test_gemini.py

# Check database structure
scripts\tests\check_feedback_db.py
```

### Sample Data

Test data is available in `test_data/`:
- `test_alert_feedback.csv` - Sample with alert keywords
- `test_multilingual_alerts.csv` - Multilingual test data
- `student_feedback.csv` - General feedback samples

## 📚 Documentation

- **Setup Guide**: `docs/setup/FIREBASE_SETUP_INSTRUCTIONS.md`
- **API Documentation**: `docs/api/backend_README.md`
- **Architecture**: `docs/architecture/SYSTEM_ARCHITECTURE.md`
- **Troubleshooting**: `docs/guides/backend_TROUBLESHOOTING.md`
- **Debug Guide**: `docs/guides/DEBUG_ALERTS.md`

## 🛠️ Development

### Project Organization

This repository has been professionally organized with:
- ✅ Clear separation of concerns (backend/frontend/docs/scripts)
- ✅ Centralized documentation in `docs/`
- ✅ Organized scripts by purpose in `scripts/`
- ✅ Test data isolated in `test_data/`
- ✅ Generated files in dedicated `generated/` folder
- ✅ Archived old files in `archive/` (not deleted)
- ✅ Updated `.gitignore` for clean git status

### Maintenance Scripts

Available in `scripts/maintenance/`:
- `create_admin.py` - Create admin users
- `view_users.py` - View all users
- `fix_database_completely.py` - Repair database issues
- `migrate_feedback_data.py` - Migrate data between databases

### Utility Scripts

Available in `scripts/utils/`:
- `list_models.py` - List available AI models
- `add_manual_alerts.py` - Manually add alerts for testing

## 🔐 Security

- API keys stored in `.env` files (never committed)
- JWT token-based authentication
- Role-based access control (admin/faculty)
- Password hashing for user accounts
- CORS protection configured
- Input validation and sanitization

## 🤝 Contributing

1. Keep the organized folder structure
2. Add documentation for new features in `docs/`
3. Place test scripts in `scripts/tests/`
4. Update this README for major changes
5. Follow existing code style and conventions

## 📝 License

[Add your license here]

## 🆘 Support

For issues or questions:
1. Check `docs/guides/backend_TROUBLESHOOTING.md`
2. Review `docs/guides/DEBUG_ALERTS.md`
3. Check existing documentation in `docs/`

## 📊 Technology Stack

### Backend
- **Framework**: Flask
- **NLP**: Transformers (DistilBERT, BART)
- **AI**: Google Gemini
- **Database**: SQLite
- **Authentication**: JWT
- **Real-time**: Firebase

### Frontend
- **Framework**: React
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **HTTP Client**: Axios
- **Real-time**: Firebase SDK

## 🎯 Key Features Explained

### Sentiment Analysis
Uses DistilBERT to classify feedback as POSITIVE, NEUTRAL, or NEGATIVE

### Category Classification
Uses BART zero-shot classification for:
- Teaching
- Course Content
- Behavior
- Infrastructure

### Alert Detection
Automatically flags feedback containing:
- Harassment, discrimination, threats
- Profanity (English, Hindi, Marathi)
- Safety concerns
- Inappropriate behavior

### AI Summaries
Google Gemini generates natural language summaries of overall feedback trends

## 📈 Roadmap

- [ ] Email notifications for alerts
- [ ] Advanced analytics dashboard
- [ ] Multi-language UI support
- [ ] Mobile app
- [ ] Automated reporting
- [ ] Integration with LMS platforms

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Production Ready

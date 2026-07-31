# System Architecture - Firebase Alert System

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │  Admin Portal    │              │  Faculty Portal  │        │
│  │                  │              │                  │        │
│  │  • All Alerts    │              │  • Own Alerts    │        │
│  │  • Statistics    │              │  • Details       │        │
│  │  • Management    │              │  • Status        │        │
│  └────────┬─────────┘              └────────┬─────────┘        │
│           │                                 │                  │
│           └─────────────┬───────────────────┘                  │
│                         │                                      │
└─────────────────────────┼──────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  useFirebaseAlerts Hook (Real-time)                      │  │
│  │  • Subscribe to Firebase                                 │  │
│  │  • Auto-update on changes                                │  │
│  │  • Filter by faculty/status                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AlertsManagement Component                              │  │
│  │  • Display alerts                                        │  │
│  │  • Toggle Firebase/REST                                  │  │
│  │  • Resolve/Dismiss actions                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            │                           │
            ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐
│   Firebase Realtime   │   │     REST API          │
│      Database         │   │   (Fallback)          │
│                       │   │                       │
│  • Real-time sync     │   │  • HTTP requests      │
│  • WebSocket          │   │  • JWT auth           │
│  • Auto-updates       │   │  • JSON responses     │
└───────────┬───────────┘   └───────────┬───────────┘
            │                           │
            └─────────────┬─────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Flask)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  app.py - Main Application                               │  │
│  │  • Feedback upload                                       │  │
│  │  • NLP analysis trigger                                  │  │
│  │  • Alert generation                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  nlp_test.py - NLP Engine                                │  │
│  │  • Sentiment analysis                                    │  │
│  │  • Category classification                               │  │
│  │  • Keyword detection                                     │  │
│  │  • Gemini AI summary                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  alerts_database.py - Alert Storage                      │  │
│  │  • Save to SQLite                                        │  │
│  │  • Sync to Firebase                                      │  │
│  │  • CRUD operations                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  firebase_config.py - Firebase Integration               │  │
│  │  • REST API calls                                        │  │
│  │  • Data synchronization                                  │  │
│  │  • Error handling                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            │                           │
            ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐
│   SQLite Database     │   │   Firebase Realtime   │
│    (alerts.db)        │   │      Database         │
│                       │   │                       │
│  • Local storage      │   │  • Cloud storage      │
│  • Persistence        │   │  • Real-time sync     │
│  • Backup             │   │  • Multi-device       │
└───────────────────────┘   └───────────────────────┘
```

## Data Flow - Alert Generation

```
1. User uploads feedback CSV
         │
         ▼
2. Backend receives file
         │
         ▼
3. NLP Engine analyzes feedback
   ├─ Sentiment Analysis (Transformers)
   ├─ Category Classification (BART)
   ├─ Keyword Detection (Pattern matching)
   └─ AI Summary (Gemini)
         │
         ▼
4. Alert keywords detected?
         │
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    │         └─> Continue normal processing
    │
    ▼
5. Create Alert
    │
    ├─> Save to SQLite (alerts.db)
    │   └─> Local persistence
    │
    └─> Sync to Firebase
        └─> Real-time distribution
              │
              ▼
6. Frontend receives update
   ├─> Admin Portal (all alerts)
   └─> Faculty Portal (own alerts)
         │
         ▼
7. Alert displayed in UI
   └─> Real-time notification
```

## Alert Detection Keywords

```
┌─────────────────────────────────────────────┐
│         ALERT TRIGGER KEYWORDS              │
├─────────────────────────────────────────────┤
│                                             │
│  🚨 HIGH PRIORITY                           │
│  ├─ harassment                              │
│  ├─ discrimination                          │
│  ├─ threat                                  │
│  ├─ violence                                │
│  └─ abuse                                   │
│                                             │
│  ⚠️  MEDIUM PRIORITY                        │
│  ├─ unsafe                                  │
│  ├─ bullying                                │
│  └─ (custom keywords)                       │
│                                             │
└─────────────────────────────────────────────┘
```

## Database Schema

### SQLite (alerts.db)

```sql
CREATE TABLE alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    faculty_id INTEGER NOT NULL,
    faculty_name TEXT NOT NULL,
    faculty_email TEXT NOT NULL,
    department TEXT,
    student_id TEXT,
    feedback_text TEXT NOT NULL,
    sentiment TEXT NOT NULL,
    category TEXT NOT NULL,
    alert_keywords TEXT,
    priority TEXT DEFAULT 'High',
    status TEXT DEFAULT 'Pending',
    resolved_by INTEGER,
    resolved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Firebase Structure

```json
{
  "alerts": {
    "-N1234abcd": {
      "id": 1,
      "faculty_id": 5,
      "faculty_name": "Dr. Smith",
      "faculty_email": "smith@university.edu",
      "department": "Computer Science",
      "student_id": "S002",
      "feedback_text": "I experienced harassment...",
      "sentiment": "NEGATIVE",
      "category": "Behavior",
      "alert_keywords": "harassment",
      "priority": "High",
      "status": "Pending",
      "created_at": "2024-01-15T10:30:00Z",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "-N1234efgh": {
      ...
    }
  }
}
```

## Component Hierarchy

```
App
│
├─ AdminDashboard
│  ├─ StatsCards
│  ├─ TabNavigation
│  └─ AlertsManagement ← Firebase Integration
│     ├─ useFirebaseAlerts (Hook)
│     ├─ AlertCard (Component)
│     ├─ FilterControls
│     └─ ActionModal
│
└─ FacultyDashboard
   ├─ StatsCards
   ├─ TabNavigation
   └─ AlertsManagement ← Firebase Integration
      ├─ useFirebaseAlerts (Hook)
      ├─ AlertCard (Component)
      └─ FilterControls
```

## API Endpoints

### Feedback Analysis

```
POST /api/analyze-feedback
├─ Upload CSV
├─ Trigger NLP analysis
├─ Generate alerts
└─ Return results
```

### Alert Management

```
GET  /api/alerts/all
├─ Get all alerts (REST)
└─ Filter by status/priority

GET  /api/alerts/firebase/all
├─ Get alerts from Firebase
└─ Real-time data

GET  /api/alerts/stats
└─ Get alert statistics

PUT  /api/alerts/:id/resolve
└─ Mark alert as resolved

PUT  /api/alerts/:id/dismiss
└─ Dismiss alert

DELETE /api/alerts/:id
└─ Delete alert (admin only)
```

## Security Layers

```
┌─────────────────────────────────────────────┐
│              SECURITY LAYERS                │
├─────────────────────────────────────────────┤
│                                             │
│  1. Frontend Authentication                 │
│     └─ JWT Token validation                 │
│                                             │
│  2. Backend Authorization                   │
│     ├─ Role-based access (admin/faculty)   │
│     └─ Resource ownership check             │
│                                             │
│  3. Firebase Rules                          │
│     ├─ Read/Write permissions               │
│     └─ Data validation                      │
│                                             │
│  4. API Rate Limiting                       │
│     └─ Prevent abuse                        │
│                                             │
│  5. Data Encryption                         │
│     ├─ HTTPS in transit                     │
│     └─ Encrypted at rest                    │
│                                             │
└─────────────────────────────────────────────┘
```

## Real-time Sync Flow

```
Alert Created
     │
     ├─────────────────────────────────┐
     │                                 │
     ▼                                 ▼
SQLite Database              Firebase Database
     │                                 │
     │                                 │
     │                        ┌────────┴────────┐
     │                        │                 │
     │                        ▼                 ▼
     │                   Admin Portal    Faculty Portal
     │                        │                 │
     │                        └────────┬────────┘
     │                                 │
     └─────────────────────────────────┤
                                       │
                                       ▼
                              Real-time Update
                              (< 1 second latency)
```

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│              PRODUCTION SETUP               │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend (React)                           │
│  ├─ Hosted on: Vercel/Netlify              │
│  ├─ CDN: CloudFlare                         │
│  └─ SSL: Automatic                          │
│                                             │
│  Backend (Flask)                            │
│  ├─ Hosted on: AWS/Heroku/DigitalOcean     │
│  ├─ Server: Gunicorn + Nginx               │
│  └─ SSL: Let's Encrypt                      │
│                                             │
│  Database                                   │
│  ├─ SQLite: Local file                     │
│  └─ Firebase: Google Cloud                  │
│                                             │
│  Monitoring                                 │
│  ├─ Logs: CloudWatch/Papertrail            │
│  ├─ Errors: Sentry                          │
│  └─ Analytics: Google Analytics             │
│                                             │
└─────────────────────────────────────────────┘
```

## Performance Metrics

```
┌─────────────────────────────────────────────┐
│           PERFORMANCE TARGETS               │
├─────────────────────────────────────────────┤
│                                             │
│  Alert Detection:        < 5 seconds        │
│  Firebase Sync:          < 1 second         │
│  Real-time Update:       < 1 second         │
│  API Response:           < 500ms            │
│  Page Load:              < 2 seconds        │
│  Concurrent Users:       Unlimited          │
│  Database Size:          Scalable           │
│                                             │
└─────────────────────────────────────────────┘
```

## Scalability

```
Current Setup:
├─ SQLite: Single file (good for < 100K records)
├─ Firebase: Unlimited (Google infrastructure)
└─ Flask: Single instance

Future Scaling:
├─ SQLite → PostgreSQL (millions of records)
├─ Flask → Multiple instances + Load balancer
├─ Add Redis for caching
└─ Implement message queue (Celery)
```

## Monitoring & Logging

```
┌─────────────────────────────────────────────┐
│          MONITORING DASHBOARD               │
├─────────────────────────────────────────────┤
│                                             │
│  System Health                              │
│  ├─ Backend uptime: 99.9%                   │
│  ├─ Firebase status: Connected              │
│  └─ Database size: 2.5 MB                   │
│                                             │
│  Alert Metrics                              │
│  ├─ Total alerts: 156                       │
│  ├─ Pending: 12                             │
│  ├─ Resolved: 144                           │
│  └─ Average resolution time: 2.5 hours      │
│                                             │
│  Performance                                │
│  ├─ API latency: 245ms                      │
│  ├─ Firebase sync: 0.8s                     │
│  └─ Active users: 23                        │
│                                             │
└─────────────────────────────────────────────┘
```

This architecture provides a robust, scalable, and real-time alert system that can handle growing user bases and increasing data volumes while maintaining excellent performance.

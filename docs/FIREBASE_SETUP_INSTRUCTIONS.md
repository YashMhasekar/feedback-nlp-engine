# Firebase Setup Instructions for Alert System

## Overview

The alert system now syncs with Firebase Realtime Database for real-time updates across admin and faculty portals.

## Firebase Configuration

Your Firebase project details:

- **Project ID**: predictive-maintenance-8c9b1
- **Database URL**: https://predictive-maintenance-8c9b1-default-rtdb.firebaseio.com
- **API Key**: AIzaSyB_YjGFJaR-J6Q5A2sYbN7wL9Hkd7GKKV0

## Setup Steps

### 1. Enable Firebase Realtime Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **predictive-maintenance-8c9b1**
3. In the left sidebar, click **Build** → **Realtime Database**
4. Click **Create Database**
5. Choose a location (e.g., us-central1)
6. Start in **Test mode** (for development) or **Locked mode** (for production)

### 2. Set Database Rules

For **development/testing**, use these rules:

```json
{
  "rules": {
    "alerts": {
      ".read": true,
      ".write": true
    }
  }
}
```

For **production**, use these rules (more secure):

```json
{
  "rules": {
    "alerts": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### 3. Verify Setup

Run the test script:

```bash
cd backend
python firebase_config.py
```

You should see:

```
✓ Test alert saved successfully with key: -XXXXX
✓ Fetched X alerts from Firebase
✓ Test alert cleaned up
```

## How It Works

### Backend (Python)

- **File**: `backend/firebase_config.py`
- When an alert is detected during feedback analysis, it's saved to both:
  1. Local SQLite database (`alerts.db`)
  2. Firebase Realtime Database (for real-time sync)

### Frontend (React)

- **Hook**: `frontend/src/hooks/useFirebaseAlerts.js`
- **Component**: `frontend/src/components/AlertsManagement.jsx`
- Automatically listens for real-time updates from Firebase
- Updates the UI instantly when new alerts are added

## Alert Detection

Alerts are triggered when feedback contains these keywords:

- harassment
- discrimination
- unsafe
- abuse
- bullying
- threat
- violence

## Features

### Real-time Updates

- ✅ Alerts appear instantly on both admin and faculty portals
- ✅ No need to refresh the page
- ✅ Live status updates when alerts are resolved/dismissed

### Dual Storage

- ✅ SQLite database for backend operations
- ✅ Firebase for real-time frontend updates
- ✅ Automatic sync between both systems

### Access Control

- **Admin**: Can see all alerts from all faculty
- **Faculty**: Can only see their own alerts

## API Endpoints

### Get Alerts from Firebase

```
GET /api/alerts/firebase/all
Authorization: Bearer <token>
```

### Get Firebase Config

```
GET /api/alerts/firebase/config
```

### Traditional REST API (Fallback)

```
GET /api/alerts/all?status=Pending&priority=High
Authorization: Bearer <token>
```

## Frontend Toggle

The AlertsManagement component has a toggle button:

- **🔥 Live**: Using Firebase real-time updates
- **📡 API**: Using traditional REST API

## Troubleshooting

### Firebase 404 Error

- Make sure Realtime Database is created in Firebase Console
- Verify the database URL is correct
- Check that database rules allow read/write access

### No Real-time Updates

- Check browser console for Firebase errors
- Verify Firebase SDK is installed: `npm install firebase`
- Ensure database rules allow read access

### Alerts Not Syncing

- Check backend console for Firebase sync errors
- Verify `requests` library is installed: `pip install requests`
- Test Firebase connection: `python backend/firebase_config.py`

## Security Notes

⚠️ **Important**:

- Never commit Firebase API keys to public repositories
- Use environment variables for production
- Set proper database rules before deploying
- Enable Firebase Authentication for production use

## Next Steps

1. Create Firebase Realtime Database in console
2. Set appropriate security rules
3. Test the connection
4. Upload feedback with sensitive keywords to test alert generation
5. Check both admin and faculty portals to see real-time alerts

## Support

If you encounter issues:

1. Check Firebase Console for database status
2. Review browser console for errors
3. Check backend logs for sync errors
4. Verify all dependencies are installed

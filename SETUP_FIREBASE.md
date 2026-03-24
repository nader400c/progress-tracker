# Code Progress Tracker - Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name (e.g., "code-tracker")
4. Disable Google Analytics (optional)
5. Click **"Create project"**

## Step 2: Enable Authentication

1. In Firebase Console, click **"Authentication"** in left menu
2. Click **"Get started"**
3. Click **"Email/Password"** provider
4. Toggle **"Enable"** and click **"Save"**

## Step 3: Create Firestore Database

1. In Firebase Console, click **"Firestore Database"** in left menu
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose a location (any is fine)
5. Click **"Enable"**

## Step 4: Get Firebase Config

1. In Firebase Console, click **Project Settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click **"</>"** (Web icon) to add a web app
4. Register app with nickname "Code Tracker"
5. Copy the **firebaseConfig** object

## Step 5: Update firebase-config.js

Open `firebase-config.js` and replace the config with yours:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## Step 6: Set Firestore Security Rules

In Firebase Console → Firestore Database → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow access to subcollections
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Step 7: Test It!

1. Open `login.html` in your browser
2. Click **"Sign Up"** tab
3. Create an account with email/password
4. You'll be redirected to the app
5. Your data is now saved to Firebase!

## Features

✅ **Multi-user support** - Each user has their own data
✅ **Cloud sync** - Access your data from any device
✅ **Secure** - Users can only access their own data
✅ **Guest mode** - Use without account (data saved locally)
✅ **Auto-sync** - Data syncs automatically when logged in

## File Structure

```
nader_progress/
├── index.html          # Main app (requires login)
├── login.html          # Login/Signup page
├── firebase-config.js  # Your Firebase credentials
├── auth.js             # Authentication logic
├── store.js            # Data management (updated for Firebase)
├── app.js              # Main app logic
├── router.js           # Page navigation
├── pages.js            # Page templates
├── modules.js          # Page modules (Skills, Projects, etc.)
└── styles.css          # Styles
```

## How It Works

1. **User logs in** → Firebase Authentication
2. **User data loaded** → Firestore Database
3. **User adds/edits data** → Saved to Firestore + localStorage backup
4. **User logs out** → Redirects to login page
5. **User returns** → Data synced from cloud

## Troubleshooting

**Error: "Firebase not defined"**
- Make sure you added the Firebase SDK scripts in index.html
- Check that firebase-config.js has valid credentials

**Error: "Permission denied"**
- Check Firestore security rules
- Make sure user is authenticated

**Data not syncing**
- Open browser console (F12) and check for errors
- Verify Firebase project has Firestore enabled

---

**Need help?** Check the [Firebase Documentation](https://firebase.google.com/docs)

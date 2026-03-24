// Firebase Configuration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANy6oZSHW1WY71ZbSx1edHjr75-yj5rb8",
  authDomain: "progresstracker-f1ce2.firebaseapp.com",
  projectId: "progresstracker-f1ce2",
  storageBucket: "progresstracker-f1ce2.firebasestorage.app",
  messagingSenderId: "491975389771",
  appId: "1:491975389771:web:19f64570830c82586513ce",
  measurementId: "G-X7MEN7RZSP"
};

// Initialize Firebase (firebase is loaded via CDN before this file)
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other files
window.auth = auth;
window.db = db;
window.firebaseApp = firebase;

console.log('Firebase initialized successfully!');

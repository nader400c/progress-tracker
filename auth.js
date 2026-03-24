// Firebase Authentication Module

const Auth = {
  currentUser: null,
  
  init() {
    // Listen for auth state changes
    firebase.auth().onAuthStateChanged((user) => {
      this.currentUser = user;
      if (user) {
        console.log('User logged in:', user.email);
        this.onLogin(user);
      } else {
        console.log('User logged out');
        this.onLogout();
      }
      // App is ready to initialize
      if (typeof onAppReady === 'function') {
        onAppReady(user);
      }
    });
  },
  
  // Sign in with Google
  async signInWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Sign up with email/password
  async signUp(email, password, name) {
    try {
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await result.user.updateProfile({ displayName: name });
      
      // Create user document in Firestore
      await db.collection('users').doc(result.user.uid).set({
        name: name,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        level: 1,
        xp: 0
      });
      
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Sign in with email/password
  async signIn(email, password) {
    try {
      const result = await firebase.auth().signInWithEmailAndPassword(email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Sign out
  async signOut() {
    try {
      await firebase.auth().signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Reset password
  async resetPassword(email) {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // On login - load user data from Firestore
  async onLogin(user) {
    console.log('Loading data for user:', user.uid);
    
    try {
      // Check if user document exists, create if not
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (!userDoc.exists) {
        // Create new user document
        await db.collection('users').doc(user.uid).set({
          name: user.displayName || user.email,
          email: user.email,
          level: 1,
          xp: 0,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Created new user document');
      } else {
        const userData = userDoc.data();
        Store.setUserData(userData);
      }
      
      // Load all user data from Firestore
      await this.loadUserData(user.uid);
      
      // Update UI
      this.updateUI(true, user);
      
      // Initialize app
      if (typeof onAppReady === 'function') {
        onAppReady(user);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Still initialize app even if Firestore fails
      if (typeof onAppReady === 'function') {
        onAppReady(user);
      }
    }
  },
  
  // On logout
  onLogout() {
    this.updateUI(false, null);
    // Clear local data but keep in localStorage as backup
  },
  
  // Load all user data from Firestore
  async loadUserData(uid) {
    try {
      // Load skills
      const skillsSnap = await db.collection('users').doc(uid).collection('skills').get();
      const skills = skillsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Load projects
      const projectsSnap = await db.collection('users').doc(uid).collection('projects').get();
      const projects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Load resources
      const resourcesSnap = await db.collection('users').doc(uid).collection('resources').get();
      const resources = resourcesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Load courses
      const coursesSnap = await db.collection('users').doc(uid).collection('courses').get();
      const courses = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Load journal
      const journalSnap = await db.collection('users').doc(uid).collection('journal').get();
      const journal = journalSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Load activities
      const activitiesSnap = await db.collection('users').doc(uid).collection('activities').get();
      const activities = activitiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Load achievements
      const achievementsSnap = await db.collection('users').doc(uid).collection('achievements').get();
      const achievements = achievementsSnap.docs.map(doc => doc.data().achievementId);
      
      // Update store
      Store.data.skills = skills;
      Store.data.courses = courses;
      Store.data.projects = projects;
      Store.data.resources = resources;
      Store.data.journal = journal;
      Store.data.activities = activities;
      Store.data.achievements = achievements;
      
      console.log('Loaded from Firestore:', skills.length, 'skills');
      Store.save();
      
      // Reload current page
      if (Router.currentPage) {
        Router.loadPage(Router.currentPage);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  },
  
  // Update UI based on auth state
  updateUI(isLoggedIn, user) {
    const authContainer = document.getElementById('authContainer');
    const userContainer = document.getElementById('userContainer');
    
    if (isLoggedIn && user) {
      if (authContainer) authContainer.style.display = 'none';
      if (userContainer) userContainer.style.display = 'flex';
      
      // Update user info in sidebar
      const userName = document.getElementById('sidebarUserName');
      const userEmail = document.getElementById('sidebarUserEmail');
      if (userName) userName.textContent = user.displayName || user.email;
      if (userEmail) userEmail.textContent = user.email;
    } else {
      if (authContainer) authContainer.style.display = 'flex';
      if (userContainer) userContainer.style.display = 'none';
    }
  },
  
  // Save data to Firestore
  async saveData() {
    if (!this.currentUser) return;
    
    const uid = this.currentUser.uid;
    const batch = db.batch();
    
    // Save user profile
    batch.update(db.collection('users').doc(uid), {
      name: Store.data.profile.name,
      level: Store.data.profile.level,
      xp: Store.data.profile.xp,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    await batch.commit();
  },
  
  // Save collection to Firestore
  async saveCollection(collectionName, items) {
    if (!this.currentUser) return;
    
    const uid = this.currentUser.uid;
    const collectionRef = db.collection('users').doc(uid).collection(collectionName);
    
    for (const item of items) {
      const docRef = collectionRef.doc(item.id ? item.id.toString() : undefined);
      await docRef.set(item, { merge: true });
    }
  }
};

window.Auth = Auth;

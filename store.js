// Code Progress Tracker - Data Store (Backend Logic)

const Store = {
  key: 'codeProgressData_v2',
  
  // Current user (for Firebase)
  userId: null,
  isGuest: true,

  data: {
    profile: { name: 'Developer', level: 1, xp: 0 },
    skills: [],
    courses: [],
    projects: [],
    resources: [],
    journal: [],
    activities: [],
    achievements: [],
    learningPaths: [],
    goals: { daily: [] },
    theme: 'dark',
    settings: {}
  },
  
  // Set user data from Firebase
  setUserData(userData) {
    if (userData.name) this.data.profile.name = userData.name;
    if (userData.level) this.data.profile.level = userData.level;
    if (userData.xp !== undefined) this.data.profile.xp = userData.xp;
  },
  
  // Load data from localStorage
  load() {
    const saved = localStorage.getItem(this.key);
    if (saved) {
      this.data = JSON.parse(saved);
      // Initialize missing arrays (for backwards compatibility)
      if (!this.data.courses) this.data.courses = [];
      if (!this.data.skills) this.data.skills = [];
      if (!this.data.projects) this.data.projects = [];
      if (!this.data.resources) this.data.resources = [];
      if (!this.data.journal) this.data.journal = [];
      if (!this.data.activities) this.data.activities = [];
      if (!this.data.achievements) this.data.achievements = [];
      console.log('Loaded data from localStorage:', this.data.skills.length, 'skills,', this.data.courses.length, 'courses');
    } else {
      console.log('No saved data found, using defaults');
    }
    return this.data;
  },

  // Save data to localStorage (and Firestore if logged in)
  save() {
    // Always save to localStorage as backup
    localStorage.setItem(this.key, JSON.stringify(this.data));
    this.checkAchievements();
    
    // Also save to Firestore if user is logged in
    if (window.auth && window.auth.currentUser) {
      this.saveToFirestore(window.auth.currentUser.uid);
    }
  },
  
  // Save data to Firestore
  async saveToFirestore(uid) {
    try {
      const batch = db.batch();
      
      // Update user profile (use set with merge to create if doesn't exist)
      const userRef = db.collection('users').doc(uid);
      batch.set(userRef, {
        name: this.data.profile.name,
        level: this.data.profile.level,
        xp: this.data.profile.xp,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      // Save skills
      this.data.skills.forEach(skill => {
        const ref = db.collection('users').doc(uid).collection('skills').doc(String(skill.id));
        batch.set(ref, skill, { merge: true });
      });
      
      // Save projects
      this.data.projects.forEach(project => {
        const ref = db.collection('users').doc(uid).collection('projects').doc(String(project.id));
        batch.set(ref, project, { merge: true });
      });
      
      // Save resources
      this.data.resources.forEach(resource => {
        const ref = db.collection('users').doc(uid).collection('resources').doc(String(resource.id));
        batch.set(ref, resource, { merge: true });
      });

      // Save courses
      this.data.courses.forEach(course => {
        const ref = db.collection('users').doc(uid).collection('courses').doc(String(course.id));
        batch.set(ref, course, { merge: true });
      });

      // Save journal
      this.data.journal.forEach(entry => {
        const ref = db.collection('users').doc(uid).collection('journal').doc(String(entry.id));
        batch.set(ref, entry, { merge: true });
      });
      
      // Save activities
      this.data.activities.forEach(activity => {
        const ref = db.collection('users').doc(uid).collection('activities').doc(String(activity.id));
        batch.set(ref, activity, { merge: true });
      });
      
      // Save achievements
      this.data.achievements.forEach((achievementId, index) => {
        const ref = db.collection('users').doc(uid).collection('achievements').doc(String(index));
        batch.set(ref, { achievementId });
      });
      
      await batch.commit();
      console.log('Data saved to Firestore');
    } catch (error) {
      console.error('Error saving to Firestore:', error);
    }
  },
  
  // ==================== PROFILE ====================
  setProfile(name, level) {
    this.data.profile.name = name;
    this.data.profile.level = level;
    this.save();
  },
  
  addXp(amount) {
    this.data.profile.xp += amount;
    const xpForNextLevel = this.data.profile.level * 100;
    if (this.data.profile.xp >= xpForNextLevel) {
      this.data.profile.xp -= xpForNextLevel;
      this.data.profile.level++;
      this.unlockAchievement('level_up');
    }
    this.save();
  },
  
  getProfile() {
    return this.data.profile;
  },
  
  // ==================== SKILLS ====================
  addSkill(name, progress, category = 'General') {
    const skill = {
      id: Date.now(),
      name,
      progress: parseInt(progress),
      category,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.skills.push(skill);
    this.save();
    this.addXp(10);
    return skill;
  },
  
  updateSkill(id, updates) {
    const skill = this.data.skills.find(s => s.id === id);
    if (skill) {
      Object.assign(skill, updates);
      skill.updatedAt = new Date().toISOString();
      this.save();
    }
  },
  
  deleteSkill(id) {
    this.data.skills = this.data.skills.filter(s => s.id !== id);
    this.data.activities = this.data.activities.filter(a => a.skillId !== id);
    this.save();
    
    // Also delete from Firestore
    if (window.auth && window.auth.currentUser) {
      const uid = window.auth.currentUser.uid;
      db.collection('users').doc(uid).collection('skills').doc(String(id)).delete()
        .catch(err => console.error('Error deleting skill from Firestore:', err));
    }
  },
  
  getSkills() {
    return this.data.skills;
  },
  
  // ==================== PROJECTS ====================
  addProject(name, description, status = 'active') {
    const project = {
      id: Date.now(),
      name,
      description,
      status,
      milestones: [],
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.projects.push(project);
    this.save();
    this.addXp(20);
    return project;
  },
  
  addMilestone(projectId, title) {
    const project = this.data.projects.find(p => p.id === projectId);
    if (project) {
      project.milestones.push({
        id: Date.now(),
        title,
        completed: false,
        completedAt: null
      });
      this.updateProjectProgress(projectId);
      this.save();
    }
  },
  
  toggleMilestone(projectId, milestoneId) {
    const project = this.data.projects.find(p => p.id === projectId);
    if (project) {
      const milestone = project.milestones.find(m => m.id === milestoneId);
      if (milestone) {
        milestone.completed = !milestone.completed;
        milestone.completedAt = milestone.completed ? new Date().toISOString() : null;
        this.updateProjectProgress(projectId);
        this.save();
        if (milestone.completed) this.addXp(15);
      }
    }
  },
  
  updateProjectProgress(projectId) {
    const project = this.data.projects.find(p => p.id === projectId);
    if (project && project.milestones.length > 0) {
      const completed = project.milestones.filter(m => m.completed).length;
      project.progress = Math.round((completed / project.milestones.length) * 100);
      if (project.progress === 100) {
        project.status = 'completed';
        this.unlockAchievement('project_complete');
        this.addXp(50);
      }
    }
  },
  
  updateProject(id, updates) {
    const project = this.data.projects.find(p => p.id === id);
    if (project) {
      Object.assign(project, updates);
      project.updatedAt = new Date().toISOString();
      this.save();
    }
  },
  
  deleteProject(id) {
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    this.save();
    
    // Also delete from Firestore
    if (window.auth && window.auth.currentUser) {
      const uid = window.auth.currentUser.uid;
      db.collection('users').doc(uid).collection('projects').doc(String(id)).delete()
        .catch(err => console.error('Error deleting project from Firestore:', err));
    }
  },
  
  getProjects() {
    return this.data.projects;
  },
  
  // ==================== RESOURCES ====================
  addResource(title, url, type, notes = '', skillId = null) {
    const resource = {
      id: Date.now(),
      title,
      url,
      type,
      notes,
      skillId,
      completed: false,
      createdAt: new Date().toISOString()
    };
    this.data.resources.push(resource);
    this.save();
    return resource;
  },
  
  toggleResourceComplete(id) {
    const resource = this.data.resources.find(r => r.id === id);
    if (resource) {
      resource.completed = !resource.completed;
      if (resource.completed) this.addXp(5);
      this.save();
    }
  },
  
  deleteResource(id) {
    this.data.resources = this.data.resources.filter(r => r.id !== id);
    this.save();
    
    // Also delete from Firestore
    if (window.auth && window.auth.currentUser) {
      const uid = window.auth.currentUser.uid;
      db.collection('users').doc(uid).collection('resources').doc(String(id)).delete()
        .catch(err => console.error('Error deleting resource from Firestore:', err));
    }
  },
  
  getResources() {
    return this.data.resources;
  },

  // ==================== COURSES ====================
  addCourse(name, url, provider, progress, nextLesson) {
    const course = {
      id: Date.now(),
      name,
      url,
      provider,
      progress: parseInt(progress) || 0,
      nextLesson: nextLesson || '',
      status: progress >= 100 ? 'completed' : (progress > 0 ? 'inprogress' : 'notstarted'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.courses.push(course);
    this.save();
    this.addXp(15);
    return course;
  },

  updateCourse(id, updates) {
    const course = this.data.courses.find(c => c.id === id);
    if (course) {
      Object.assign(course, updates);
      course.updatedAt = new Date().toISOString();
      if (course.progress >= 100) course.status = 'completed';
      else if (course.progress > 0) course.status = 'inprogress';
      else course.status = 'notstarted';
      this.save();
    }
  },

  updateCourseProgress(id, progress) {
    this.updateCourse(id, { progress });
    if (progress >= 100) {
      this.unlockAchievement('course_complete');
      this.addXp(50);
    }
  },

  deleteCourse(id) {
    this.data.courses = this.data.courses.filter(c => c.id !== id);
    this.save();
    
    // Also delete from Firestore
    if (window.auth && window.auth.currentUser) {
      const uid = window.auth.currentUser.uid;
      db.collection('users').doc(uid).collection('courses').doc(String(id)).delete()
        .catch(err => console.error('Error deleting course from Firestore:', err));
    }
  },

  getCourses() {
    return this.data.courses;
  },

  // ==================== JOURNAL ====================
  addEntry(title, content, mood = 'neutral') {
    const entry = {
      id: Date.now(),
      title,
      content,
      mood,
      date: new Date().toISOString()
    };
    this.data.journal.unshift(entry);
    this.save();
    this.addXp(5);
    return entry;
  },
  
  deleteEntry(id) {
    this.data.journal = this.data.journal.filter(e => e.id !== id);
    this.save();
    
    // Also delete from Firestore
    if (window.auth && window.auth.currentUser) {
      const uid = window.auth.currentUser.uid;
      db.collection('users').doc(uid).collection('journal').doc(String(id)).delete()
        .catch(err => console.error('Error deleting journal entry from Firestore:', err));
    }
  },
  
  getJournal() {
    return this.data.journal;
  },
  
  getTodaysEntry() {
    const today = new Date().toDateString();
    return this.data.journal.find(e => new Date(e.date).toDateString() === today);
  },
  
  // ==================== ACTIVITIES ====================
  addActivity(title, skillId, duration, rating, notes = '') {
    const activity = {
      id: Date.now(),
      title,
      skillId,
      duration: parseInt(duration),
      rating,
      notes,
      date: new Date().toISOString()
    };
    this.data.activities.unshift(activity);
    
    // Update skill progress
    const skill = this.data.skills.find(s => s.id === skillId);
    if (skill && skill.progress < 100) {
      skill.progress = Math.min(100, skill.progress + Math.floor(duration / 30) * 5);
      skill.updatedAt = new Date().toISOString();
    }
    
    this.save();
    this.addXp(Math.floor(duration / 15));
    return activity;
  },
  
  deleteActivity(id) {
    this.data.activities = this.data.activities.filter(a => a.id !== id);
    this.save();
  },
  
  getActivities() {
    return this.data.activities;
  },
  
  getActivitiesByDate(date) {
    const dateStr = date.toDateString();
    return this.data.activities.filter(a => new Date(a.date).toDateString() === dateStr);
  },
  
  // ==================== ACHIEVEMENTS ====================
  achievementsList: [
    { id: 'first_activity', name: 'First Step', desc: 'Log your first activity', icon: 'flag', xp: 25 },
    { id: 'streak_3', name: 'On Fire', desc: '3 day streak', icon: 'local_fire_department', xp: 50 },
    { id: 'streak_7', name: 'Dedicated', desc: '7 day streak', icon: 'whatshot', xp: 100 },
    { id: 'streak_30', name: 'Unstoppable', desc: '30 day streak', icon: 'emoji_events', xp: 500 },
    { id: 'hours_10', name: '10 Hours', desc: 'Code for 10 hours', icon: 'schedule', xp: 50 },
    { id: 'hours_100', name: 'Century', desc: 'Code for 100 hours', icon: 'timer', xp: 200 },
    { id: 'skills_5', name: 'Multi-talented', desc: 'Add 5 skills', icon: 'psychology', xp: 50 },
    { id: 'skills_10', name: 'Polymath', desc: 'Add 10 skills', icon: 'school', xp: 100 },
    { id: 'project_complete', name: 'Ship It', desc: 'Complete a project', icon: 'rocket', xp: 100 },
    { id: 'course_complete', name: 'Course Completed!', desc: 'Finish a course', icon: 'school', xp: 50 },
    { id: 'level_up', name: 'Level Up!', desc: 'Reach a new level', icon: 'trending_up', xp: 25 },
    { id: 'journal_7', name: 'Reflective', desc: '7 journal entries', icon: 'edit_note', xp: 50 },
    { id: 'resources_10', name: 'Knowledge Seeker', desc: 'Add 10 resources', icon: 'library_books', xp: 50 },
    { id: 'skill_master', name: 'Master', desc: 'Reach 100% in any skill', icon: 'workspace_premium', xp: 200 },
    { id: 'early_bird', name: 'Early Bird', desc: 'Code before 6 AM', icon: 'wb_sunny', xp: 25 },
    { id: 'night_owl', name: 'Night Owl', desc: 'Code after 11 PM', icon: 'nightlight', xp: 25 }
  ],
  
  unlockAchievement(id) {
    if (!this.data.achievements.includes(id)) {
      this.data.achievements.push(id);
      const achievement = this.achievementsList.find(a => a.id === id);
      if (achievement) {
        this.addXp(achievement.xp);
      }
      this.save();
      return achievement;
    }
    return null;
  },
  
  getAchievements() {
    return this.data.achievements.map(id => this.achievementsList.find(a => a.id === id)).filter(Boolean);
  },
  
  checkAchievements() {
    const activities = this.data.activities;
    const skills = this.data.skills;
    const journal = this.data.journal;
    const resources = this.data.resources;
    
    // First activity
    if (activities.length >= 1) this.unlockAchievement('first_activity');
    
    // Streaks
    const streak = this.getStreak();
    if (streak >= 3) this.unlockAchievement('streak_3');
    if (streak >= 7) this.unlockAchievement('streak_7');
    if (streak >= 30) this.unlockAchievement('streak_30');
    
    // Hours
    const totalHours = activities.reduce((sum, a) => sum + a.duration, 0) / 60;
    if (totalHours >= 10) this.unlockAchievement('hours_10');
    if (totalHours >= 100) this.unlockAchievement('hours_100');
    
    // Skills count
    if (skills.length >= 5) this.unlockAchievement('skills_5');
    if (skills.length >= 10) this.unlockAchievement('skills_10');
    
    // Journal entries
    if (journal.length >= 7) this.unlockAchievement('journal_7');
    
    // Resources
    if (resources.length >= 10) this.unlockAchievement('resources_10');
    
    // Skill master
    if (skills.some(s => s.progress >= 100)) this.unlockAchievement('skill_master');
    
    // Time-based
    const now = new Date();
    const hour = now.getHours();
    if (hour < 6) this.unlockAchievement('early_bird');
    if (hour >= 23) this.unlockAchievement('night_owl');
  },
  
  // ==================== STATS ====================
  getStreak() {
    const activities = this.data.activities;
    const dates = [...new Set(activities.map(a => new Date(a.date).toDateString()))];
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      if (dates.includes(currentDate.toDateString())) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (streak === 0 && currentDate.toDateString() === new Date().toDateString()) {
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  },
  
  getStats() {
    const activities = this.data.activities;
    const skills = this.data.skills;
    const profile = this.data.profile;
    
    const totalHours = Math.round(activities.reduce((sum, a) => sum + a.duration, 0) / 60);
    const avgProgress = skills.length > 0
      ? Math.round(skills.reduce((sum, s) => sum + s.progress, 0) / skills.length)
      : 0;
    
    return {
      streak: this.getStreak(),
      totalActivities: activities.length,
      totalHours,
      skillsCount: skills.length,
      avgProgress,
      level: profile.level,
      xp: profile.xp,
      achievementsCount: this.data.achievements.length
    };
  },
  
  getWeeklyData() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayActivities = this.getActivitiesByDate(date);
      weekData.push({
        day: days[date.getDay()],
        hours: Math.round(dayActivities.reduce((sum, a) => sum + a.duration, 0) / 60 * 10) / 10,
        count: dayActivities.length
      });
    }
    
    return weekData;
  },
  
  // ==================== THEME ====================
  setTheme(theme) {
    this.data.theme = theme;
    this.save();
  },
  
  getTheme() {
    return this.data.theme;
  },
  
  // ==================== DATA MANAGEMENT ====================
  exportData() {
    return JSON.stringify(this.data, null, 2);
  },
  
  importData(json) {
    try {
      this.data = JSON.parse(json);
      this.save();
      return true;
    } catch (e) {
      return false;
    }
  },
  
  resetAll() {
    localStorage.removeItem(this.key);
    location.reload();
  }
};

// Export for use in other files
window.Store = Store;

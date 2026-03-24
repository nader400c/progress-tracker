// Code Progress Tracker - Main App Logic

let appInitialized = false;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  Store.load();
  applyTheme(Store.getTheme());
  updateSidebar();
  
  // Initialize Firebase Auth first, then app
  if (typeof Auth !== 'undefined' && window.isFirebaseConfigured !== false) {
    Auth.init();
    // App will fully initialize after auth state is known
  } else {
    console.log('Firebase not configured - using localStorage only');
    Router.init();
  }
});

// Called by Auth when user is logged in
function onAppReady(user) {
  if (appInitialized) return;
  appInitialized = true;
  Router.init();
}

function updateSidebar() {
  const profile = Store.getProfile();
  const nameEl = document.getElementById('sidebarUserName');
  if (nameEl) nameEl.textContent = profile.name;
  const levelEl = document.getElementById('userLevel');
  if (levelEl) levelEl.textContent = profile.level;
}

// Handle logout
async function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    const result = await Auth.signOut();
    if (result.success) {
      window.location.href = 'login.html';
    }
  }
}

// ==================== THEME ====================
function toggleTheme() {
  const current = Store.getTheme();
  const newTheme = current === 'dark' ? 'light' : 'dark';
  Store.setTheme(newTheme);
  applyTheme(newTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
  const themeSelect = document.getElementById('settingTheme');
  if (themeSelect) themeSelect.value = theme;
}

// ==================== MODALS (HTML5 Dialog) ====================
function showQuickAdd() {
  const modal = document.getElementById('quickAddModal');
  if (modal) modal.showModal();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.close();
}

function hideQuickAdd() {
  closeModal('quickAddModal');
}

function logActivity() {
  const skillId = Store.getSkills()[0]?.id;
  if (!skillId) {
    alert('Please add a skill first');
    navigateTo('skills');
    return;
  }
  Store.addActivity('Quick Session', skillId, 30, 'good');
  closeModal('quickAddModal');
  Router.loadPage(Router.currentPage);
}

// ==================== MODALS (HTML5 Dialog) ====================
function showAddSkillModal() {
  const modalHtml = `
    <dialog id="addSkillModal" class="custom-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Add New Skill</h5>
          <button class="btn-close" onclick="closeModal('addSkillModal')">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Skill Name</label>
            <input type="text" class="form-control" id="newSkillName" placeholder="e.g., JavaScript, React, Python">
          </div>
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-select" id="newSkillCategory">
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Database">Database</option>
              <option value="DevOps">DevOps</option>
              <option value="Mobile">Mobile</option>
              <option value="General">General</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Current Level</label>
            <select class="form-select" id="newSkillLevel">
              <option value="0">Beginner (0%)</option>
              <option value="25">Getting Started (25%)</option>
              <option value="50">Intermediate (50%)</option>
              <option value="75">Advanced (75%)</option>
              <option value="100">Expert (100%)</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('addSkillModal')">Cancel</button>
          <button type="button" class="btn btn-primary" onclick="createSkill()">Add Skill</button>
        </div>
      </div>
    </dialog>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modal = document.getElementById('addSkillModal');
  modal.showModal();
}

function createSkill() {
  const name = document.getElementById('newSkillName').value.trim();
  const category = document.getElementById('newSkillCategory').value;
  const level = parseInt(document.getElementById('newSkillLevel').value);
  
  if (!name) {
    alert('Please enter a skill name');
    return;
  }
  
  Store.addSkill(name, level, category);
  closeModal('addSkillModal');
  document.getElementById('addSkillModal').remove();
  Router.loadPage(Router.currentPage);
}

function showAddProjectModal() {
  const modalHtml = `
    <dialog id="addProjectModal" class="custom-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h5>New Project</h5>
          <button class="btn-close" onclick="closeModal('addProjectModal')">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Project Name</label>
            <input type="text" class="form-control" id="newProjectName" placeholder="e.g., Portfolio Website">
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" id="newProjectDesc" placeholder="Describe your project..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-select" id="newProjectStatus">
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="onhold">On Hold</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('addProjectModal')">Cancel</button>
          <button type="button" class="btn btn-primary" onclick="createProject()">Create Project</button>
        </div>
      </div>
    </dialog>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modal = document.getElementById('addProjectModal');
  modal.showModal();
}

function createProject() {
  const name = document.getElementById('newProjectName').value.trim();
  const description = document.getElementById('newProjectDesc').value.trim();
  const status = document.getElementById('newProjectStatus').value;
  
  if (!name) {
    alert('Please enter a project name');
    return;
  }
  
  Store.addProject(name, description, status);
  closeModal('addProjectModal');
  document.getElementById('addProjectModal').remove();
  Router.loadPage(Router.currentPage);
}

function showAddCourseModal() {
  const modalHtml = `
    <dialog id="addCourseModal" class="custom-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Add New Course</h5>
          <button class="btn-close" onclick="closeModal('addCourseModal')">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Course Name</label>
            <input type="text" class="form-control" id="newCourseName" placeholder="e.g., Advanced React Patterns">
          </div>
          <div class="form-group">
            <label class="form-label">Course URL</label>
            <input type="url" class="form-control" id="newCourseUrl" placeholder="https://...">
          </div>
          <div class="form-group">
            <label class="form-label">Provider</label>
            <input type="text" class="form-control" id="newCourseProvider" placeholder="e.g., Udemy, Coursera, YouTube">
          </div>
          <div class="form-group">
            <label class="form-label">Progress (%)</label>
            <input type="number" class="form-control" id="newCourseProgress" placeholder="0" min="0" max="100" value="0">
          </div>
          <div class="form-group">
            <label class="form-label">Next Lesson</label>
            <input type="text" class="form-control" id="newCourseNextLesson" placeholder="e.g., Chapter 3: Understanding Hooks">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('addCourseModal')">Cancel</button>
          <button type="button" class="btn btn-primary" onclick="createCourse()">Add Course</button>
        </div>
      </div>
    </dialog>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modal = document.getElementById('addCourseModal');
  modal.showModal();
}

function createCourse() {
  const name = document.getElementById('newCourseName').value.trim();
  const url = document.getElementById('newCourseUrl').value.trim();
  const provider = document.getElementById('newCourseProvider').value.trim();
  const progress = parseInt(document.getElementById('newCourseProgress').value) || 0;
  const nextLesson = document.getElementById('newCourseNextLesson').value.trim();

  if (!name) {
    alert('Please enter a course name');
    return;
  }

  Store.addCourse(name, url, provider, progress, nextLesson);
  closeModal('addCourseModal');
  document.getElementById('addCourseModal').remove();
  Router.loadPage(Router.currentPage);
}

function showAddResourceModal() {
  const modalHtml = `
    <dialog id="addResourceModal" class="custom-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Add Resource</h5>
          <button class="btn-close" onclick="closeModal('addResourceModal')">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Title</label>
            <input type="text" class="form-control" id="newResourceTitle" placeholder="e.g., React Documentation">
          </div>
          <div class="form-group">
            <label class="form-label">URL</label>
            <input type="url" class="form-control" id="newResourceUrl" placeholder="https://...">
          </div>
          <div class="form-group">
            <label class="form-label">Type</label>
            <select class="form-select" id="newResourceType">
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="course">Course</option>
              <option value="book">Book</option>
              <option value="practice">Practice</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Notes</label>
            <textarea class="form-textarea" id="newResourceNotes" placeholder="Optional notes..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('addResourceModal')">Cancel</button>
          <button type="button" class="btn btn-primary" onclick="createResource()">Add Resource</button>
        </div>
      </div>
    </dialog>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modal = document.getElementById('addResourceModal');
  modal.showModal();
}

function createResource() {
  const title = document.getElementById('newResourceTitle').value.trim();
  const url = document.getElementById('newResourceUrl').value.trim();
  const type = document.getElementById('newResourceType').value;
  const notes = document.getElementById('newResourceNotes').value.trim();
  
  if (!title) {
    alert('Please enter a title');
    return;
  }
  
  Store.addResource(title, url, type, notes);
  closeModal('addResourceModal');
  document.getElementById('addResourceModal').remove();
  Router.loadPage(Router.currentPage);
}

function showAddEntryModal() {
  const modalHtml = `
    <dialog id="addEntryModal" class="custom-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h5>New Journal Entry</h5>
          <button class="btn-close" onclick="closeModal('addEntryModal')">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Title</label>
            <input type="text" class="form-control" id="newEntryTitle" placeholder="What did you learn today?">
          </div>
          <div class="form-group">
            <label class="form-label">Content</label>
            <textarea class="form-textarea" id="newEntryContent" placeholder="Write your thoughts..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Mood</label>
            <select class="form-select" id="newEntryMood">
              <option value="great">🔥 Great</option>
              <option value="good">😊 Good</option>
              <option value="neutral">😐 Neutral</option>
              <option value="frustrated">😤 Frustrated</option>
              <option value="tired">😴 Tired</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('addEntryModal')">Cancel</button>
          <button type="button" class="btn btn-primary" onclick="createEntry()">Save Entry</button>
        </div>
      </div>
    </dialog>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modal = document.getElementById('addEntryModal');
  modal.showModal();
}

function createEntry() {
  const title = document.getElementById('newEntryTitle').value.trim();
  const content = document.getElementById('newEntryContent').value.trim();
  const mood = document.getElementById('newEntryMood').value;
  
  if (!title) {
    alert('Please enter a title');
    return;
  }
  
  Store.addEntry(title, content, mood);
  closeModal('addEntryModal');
  document.getElementById('addEntryModal').remove();
  Router.loadPage(Router.currentPage);
}

// ==================== DASHBOARD ====================
const Dashboard = {
  weeklyChart: null,
  skillsChart: null,
  
  init() {
    this.renderStats();
    this.renderCharts();
    this.renderTopSkills();
    this.renderRecentActivity();
    this.renderActiveProjects();
    this.renderDashCourses();
    
    // Fix chart resize when window resizes (e.g., console opens/closes)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.renderCharts();
      }, 250);
    });
  },
  
  renderStats() {
    const stats = Store.getStats();
    document.getElementById('dashStreak').textContent = stats.streak;
    document.getElementById('dashActivities').textContent = stats.totalActivities;
    document.getElementById('dashHours').textContent = stats.totalHours;
    document.getElementById('dashLevel').textContent = stats.level;
    document.getElementById('dashXp').textContent = `${stats.xp} / ${stats.level * 100} XP`;
  },
  
  renderCharts() {
    const weeklyData = Store.getWeeklyData();
    
    // Weekly Activity Chart
    const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
    if (this.weeklyChart) this.weeklyChart.destroy();
    this.weeklyChart = new Chart(weeklyCtx, {
      type: 'bar',
      data: {
        labels: weeklyData.map(d => d.day),
        datasets: [{
          label: 'Hours',
          data: weeklyData.map(d => d.hours),
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });
    
    // Skills Distribution Chart
    const skills = Store.getSkills();
    const categories = {};
    skills.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1;
    });
    
    const skillsCtx = document.getElementById('skillsChart').getContext('2d');
    if (this.skillsChart) this.skillsChart.destroy();
    this.skillsChart = new Chart(skillsCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categories),
        datasets: [{
          data: Object.values(categories),
          backgroundColor: [
            '#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#cbd5e1', padding: 12 }
          }
        }
      }
    });
  },
  
  renderTopSkills() {
    const skills = Store.getSkills().sort((a, b) => b.progress - a.progress).slice(0, 5);
    const container = document.getElementById('dashTopSkills');
    
    if (skills.length === 0) {
      container.innerHTML = '<p class="text-muted text-center py-3">No skills yet</p>';
      return;
    }
    
    container.innerHTML = skills.map(skill => `
      <div class="list-item">
        <div style="width: 10px; height: 10px; border-radius: 50%; background: ${skill.color};"></div>
        <div style="flex: 1;">
          <div style="font-weight: 500;">${skill.name}</div>
          <div class="progress" style="height: 4px; margin-top: 6px;">
            <div class="progress-bar" style="width: ${skill.progress}%"></div>
          </div>
        </div>
        <span style="font-weight: 600; color: var(--primary);">${skill.progress}%</span>
      </div>
    `).join('');
  },
  
  renderRecentActivity() {
    const activities = Store.getActivities().slice(0, 5);
    const container = document.getElementById('dashRecentActivity');
    
    if (activities.length === 0) {
      container.innerHTML = '<p class="text-muted text-center py-3">No activities yet</p>';
      return;
    }
    
    const ratingEmojis = { great: '🔥', good: '👍', okay: '🤔', struggled: '💪' };
    
    container.innerHTML = activities.map(activity => {
      const skill = Store.getSkills().find(s => s.id === activity.skillId);
      const timeAgo = this.getTimeAgo(new Date(activity.date));
      
      return `
        <div class="list-item">
          <div class="activity-icon" style="width: 40px; height: 40px;">
            <span class="material-icons" style="font-size: 20px;">code</span>
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 500;">${activity.title}</div>
            <div class="text-muted" style="font-size: 0.85rem;">
              ${skill ? skill.name : 'Unknown'} • ${activity.duration} min • ${ratingEmojis[activity.rating]} • ${timeAgo}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderActiveProjects() {
    const projects = Store.getProjects().filter(p => p.status === 'active').slice(0, 5);
    const container = document.getElementById('dashActiveProjects');

    if (projects.length === 0) {
      container.innerHTML = '<p class="text-muted text-center py-3">No active projects</p>';
      return;
    }

    container.innerHTML = projects.map(project => `
      <div class="list-item">
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 500;">${project.name}</span>
            <span class="badge badge-primary">${project.progress}%</span>
          </div>
          <div class="progress" style="height: 6px; margin-top: 8px;">
            <div class="progress-bar" style="width: ${project.progress}%"></div>
          </div>
        </div>
      </div>
    `).join('');
  },

  renderDashCourses() {
    const courses = Store.getCourses().filter(c => c.progress > 0 && c.progress < 100).slice(0, 5);
    const container = document.getElementById('dashCourses');

    if (courses.length === 0) {
      container.innerHTML = '<p class="text-muted text-center py-3">No in-progress courses</p>';
      return;
    }

    container.innerHTML = courses.map(course => `
      <div class="list-item">
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 500;">${course.name}</span>
            <span class="badge badge-primary">${course.progress}%</span>
          </div>
          <div class="progress" style="height: 6px;">
            <div class="progress-bar" style="width: ${course.progress}%"></div>
          </div>
          ${course.nextLesson ? `<div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 6px;">Next: ${course.nextLesson}</div>` : ''}
        </div>
      </div>
    `).join('');
  },

  getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  }
};

// ==================== SETTINGS ====================
const Settings = {
  init() {
    const profile = Store.getProfile();
    document.getElementById('settingName').value = profile.name;
    document.getElementById('settingLevel').value = profile.level;
    document.getElementById('settingTheme').value = Store.getTheme();
  },
  
  saveProfile() {
    const name = document.getElementById('settingName').value;
    const level = parseInt(document.getElementById('settingLevel').value);
    Store.setProfile(name, level);
    updateSidebar();
    alert('Profile saved!');
  },
  
  setTheme(theme) {
    Store.setTheme(theme);
    applyTheme(theme);
  },
  
  exportData() {
    const data = Store.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-progress-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
  
  importData(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const success = Store.importData(e.target.result);
      if (success) {
        alert('Data imported successfully!');
        location.reload();
      } else {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  },
  
  resetAll() {
    if (confirm('Are you sure? This will delete all your data permanently!')) {
      Store.resetAll();
    }
  }
};

// Make globals accessible
window.Dashboard = Dashboard;
window.Settings = Settings;

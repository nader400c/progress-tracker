// Page Modules - Skills, Projects, Resources, Journal, Achievements, Calendar, Analytics

// ==================== SKILLS MODULE ====================
const Skills = {
  render() {
    const container = document.getElementById('skillsGrid');
    if (!container) return;
    
    const filter = document.getElementById('skillFilter')?.value || 'all';
    const sort = document.getElementById('skillSort')?.value || 'name';

    let skills = Store.getSkills();

    // Filter
    if (filter !== 'all') {
      if (filter === 'beginner') skills = skills.filter(s => s.progress <= 25);
      else if (filter === 'intermediate') skills = skills.filter(s => s.progress > 25 && s.progress <= 50);
      else if (filter === 'advanced') skills = skills.filter(s => s.progress > 50 && s.progress <= 75);
      else if (filter === 'expert') skills = skills.filter(s => s.progress > 75);
    }

    // Sort
    if (sort === 'name') skills.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'progress') skills.sort((a, b) => b.progress - a.progress);
    else if (sort === 'recent') skills.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    if (skills.length === 0) {
      container.innerHTML = `
        <div class="card" style="grid-column: span 3; text-align: center; padding: 40px;">
          <span class="material-icons" style="font-size: 48px; color: var(--text-muted);">psychology</span>
          <p class="text-muted" style="margin-top: 16px;">No skills found. Add your first skill!</p>
          <button class="btn btn-primary" style="margin-top: 12px;" onclick="showAddSkillModal()">
            <span class="material-icons">add</span> Add Skill
          </button>
        </div>
      `;
      return;
    }
    
    container.innerHTML = skills.map(skill => `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: ${skill.color}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
              ${skill.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style="font-weight: 600;">${skill.name}</div>
              <span class="badge badge-primary">${skill.category}</span>
            </div>
          </div>
          <button class="btn btn-sm btn-outline" onclick="Skills.deleteSkill(${skill.id})">
            <span class="material-icons" style="font-size: 18px;">delete</span>
          </button>
        </div>
        
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span class="text-muted">Progress</span>
            <span style="font-weight: 600; color: var(--primary);">${skill.progress}%</span>
          </div>
          <div class="progress">
            <div class="progress-bar" style="width: ${skill.progress}%"></div>
          </div>
        </div>
        
        <input type="range" class="form-range" min="0" max="100" value="${skill.progress}" 
          onchange="Skills.updateProgress(${skill.id}, this.value)"
          style="width: 100%;">
        
        <div style="margin-top: 16px; display: flex; gap: 8px;">
          <button class="btn btn-sm btn-outline" style="flex: 1;" onclick="logSkillActivity(${skill.id})">
            <span class="material-icons" style="font-size: 16px;">timer</span> Log Time
          </button>
        </div>
      </div>
    `).join('');
    
    this.renderPaths();
  },
  
  updateProgress(id, progress) {
    Store.updateSkill(id, { progress: parseInt(progress) });
    if (parseInt(progress) === 100) {
      Store.unlockAchievement('skill_master');
    }
    this.render();
  },
  
  deleteSkill(id) {
    if (confirm('Delete this skill?')) {
      Store.deleteSkill(id);
      this.render();
    }
  },
  
  renderPaths() {
    const paths = Store.data.learningPaths || [];
    const container = document.getElementById('learningPaths');
    
    if (!container) return;
    
    if (paths.length === 0) {
      container.innerHTML = '<p class="text-muted text-center py-3">No learning paths yet</p>';
      return;
    }
    
    container.innerHTML = paths.map(path => `
      <div class="list-item">
        <div style="flex: 1;">
          <div style="font-weight: 600;">${path.name}</div>
          <div class="text-muted" style="font-size: 0.85rem;">${path.skills.length} skills</div>
        </div>
        <span class="badge badge-primary">${path.skills.join(', ')}</span>
      </div>
    `).join('');
  }
};

function logSkillActivity(skillId) {
  Store.addActivity('Practice Session', skillId, 30, 'good');
  alert('Activity logged! +2 XP');
}

// ==================== PROJECTS MODULE ====================
const Projects = {
  render() {
    const container = document.getElementById('projectsGrid');
    if (!container) return;
    
    const filter = document.getElementById('projectFilter')?.value || 'all';

    let projects = Store.getProjects();

    if (filter !== 'all') {
      projects = projects.filter(p => p.status === filter);
    }
    
    if (projects.length === 0) {
      container.innerHTML = `
        <div class="card" style="grid-column: span 3; text-align: center; padding: 40px;">
          <span class="material-icons" style="font-size: 48px; color: var(--text-muted);">folder</span>
          <p class="text-muted" style="margin-top: 16px;">No projects found. Start building!</p>
          <button class="btn btn-primary" style="margin-top: 12px;" onclick="showAddProjectModal()">
            <span class="material-icons">add</span> New Project
          </button>
        </div>
      `;
      return;
    }
    
    const statusColors = {
      active: 'badge-success',
      planning: 'badge-primary',
      onhold: 'badge-warning',
      completed: 'badge-secondary'
    };
    
    container.innerHTML = projects.map(project => `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
          <div style="font-weight: 600; font-size: 1.1rem;">${project.name}</div>
          <span class="badge ${statusColors[project.status]}">${project.status}</span>
        </div>
        
        <p class="text-muted" style="font-size: 0.9rem; margin-bottom: 16px;">${project.description || 'No description'}</p>
        
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span class="text-muted">Progress</span>
            <span style="font-weight: 600;">${project.progress}%</span>
          </div>
          <div class="progress">
            <div class="progress-bar" style="width: ${project.progress}%"></div>
          </div>
        </div>
        
        <div style="border-top: 1px solid var(--border-light); padding-top: 12px;">
          <div style="font-weight: 600; margin-bottom: 12px; font-size: 0.9rem;">Milestones</div>
          ${project.milestones.map(m => `
            <div class="form-check" style="margin-bottom: 8px;">
              <input class="form-check-input" type="checkbox" ${m.completed ? 'checked' : ''} 
                onchange="Projects.toggleMilestone(${project.id}, ${m.id})">
              <label class="form-check-label" style="${m.completed ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">
                ${m.title}
              </label>
            </div>
          `).join('') || '<p class="text-muted" style="font-size: 0.85rem;">No milestones yet</p>'}
        </div>
        
        <div style="margin-top: 16px; display: flex; gap: 8px;">
          <button class="btn btn-sm btn-outline" style="flex: 1;" onclick="Projects.addMilestone(${project.id})">
            <span class="material-icons" style="font-size: 16px;">add</span> Milestone
          </button>
          <button class="btn btn-sm btn-outline" onclick="Projects.deleteProject(${project.id})">
            <span class="material-icons" style="font-size: 18px;">delete</span>
          </button>
        </div>
      </div>
    `).join('');
  },
  
  addMilestone(projectId) {
    const title = prompt('Enter milestone title:');
    if (title) {
      Store.addMilestone(projectId, title);
      this.render();
    }
  },
  
  toggleMilestone(projectId, milestoneId) {
    Store.toggleMilestone(projectId, milestoneId);
    this.render();
  },
  
  deleteProject(id) {
    if (confirm('Delete this project?')) {
      Store.deleteProject(id);
      this.render();
    }
  }
};

// ==================== RESOURCES MODULE ====================
const Resources = {
  render() {
    const container = document.getElementById('resourcesGrid');
    if (!container) return;
    
    const type = document.getElementById('resourceType')?.value || 'all';

    let resources = Store.getResources();

    if (type !== 'all') {
      resources = resources.filter(r => r.type === type);
    }
    
    if (resources.length === 0) {
      container.innerHTML = `
        <div class="card" style="grid-column: span 3; text-align: center; padding: 40px;">
          <span class="material-icons" style="font-size: 48px; color: var(--text-muted);">library_books</span>
          <p class="text-muted" style="margin-top: 16px;">No resources yet. Add learning materials!</p>
          <button class="btn btn-primary" style="margin-top: 12px;" onclick="showAddResourceModal()">
            <span class="material-icons">add</span> Add Resource
          </button>
        </div>
      `;
      return;
    }
    
    const typeIcons = {
      video: 'play_circle',
      article: 'article',
      course: 'school',
      book: 'menu_book',
      practice: 'code'
    };
    
    container.innerHTML = resources.map(resource => `
      <div class="card">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div style="width: 40px; height: 40px; border-radius: 10px; background: var(--bg-badge); display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="color: var(--primary); font-size: 22px;">${typeIcons[resource.type]}</span>
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 600;">${resource.title}</div>
            <span class="badge badge-primary">${resource.type}</span>
          </div>
        </div>
        
        ${resource.notes ? `<p class="text-muted" style="font-size: 0.85rem; margin-bottom: 12px;">${resource.notes}</p>` : ''}
        
        <div style="display: flex; gap: 8px;">
          <a href="${resource.url}" target="_blank" class="btn btn-sm btn-primary" style="flex: 1;">
            <span class="material-icons" style="font-size: 16px;">open_in_new</span> Open
          </a>
          <button class="btn btn-sm ${resource.completed ? 'btn-success' : 'btn-outline'}" 
            onclick="Resources.toggleComplete(${resource.id})">
            <span class="material-icons" style="font-size: 18px;">${resource.completed ? 'check' : 'check_box_outline_blank'}</span>
          </button>
          <button class="btn btn-sm btn-outline" onclick="Resources.delete(${resource.id})">
            <span class="material-icons" style="font-size: 18px;">delete</span>
          </button>
        </div>
      </div>
    `).join('');
  },
  
  toggleComplete(id) {
    Store.toggleResourceComplete(id);
    this.render();
  },
  
  delete(id) {
    if (confirm('Delete this resource?')) {
      Store.deleteResource(id);
      this.render();
    }
  }
};

// ==================== JOURNAL MODULE ====================
const Journal = {
  render() {
    const container1 = document.getElementById('todaysEntry');
    const container2 = document.getElementById('journalEntries');
    if (!container1 || !container2) return;
    
    const today = Store.getTodaysEntry();
    
    // Today's entry
    if (today) {
      container1.innerHTML = `
        <div>
          <div style="font-weight: 600; margin-bottom: 8px;">${today.title}</div>
          <p style="color: var(--text-secondary); white-space: pre-wrap;">${today.content}</p>
          <div class="text-muted" style="font-size: 0.85rem; margin-top: 12px;">
            Mood: ${this.getMoodEmoji(today.mood)}
          </div>
        </div>
      `;
    } else {
      container1.innerHTML = `
        <div class="text-center text-muted py-4">
          <p>No entry for today yet</p>
          <button class="btn btn-sm btn-primary" style="margin-top: 8px;" onclick="showAddEntryModal()">
            <span class="material-icons">add</span> Write Entry
          </button>
        </div>
      `;
    }
    
    // Past entries
    const entries = Store.getJournal().filter(e => e.id !== today?.id);
    
    if (entries.length === 0) {
      container2.innerHTML = '<p class="text-muted text-center py-3">No past entries</p>';
    } else {
      container2.innerHTML = entries.map(entry => `
        <div class="list-item">
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600;">${entry.title}</span>
              <span class="text-muted" style="font-size: 0.85rem;">${new Date(entry.date).toLocaleDateString()}</span>
            </div>
            <p class="text-muted" style="font-size: 0.9rem; margin: 8px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${entry.content}
            </p>
            <span class="text-muted" style="font-size: 0.8rem;">Mood: ${this.getMoodEmoji(entry.mood)}</span>
          </div>
          <button class="btn btn-sm btn-outline" onclick="Journal.delete(${entry.id})">
            <span class="material-icons" style="font-size: 18px;">delete</span>
          </button>
        </div>
      `).join('');
    }
  },
  
  getMoodEmoji(mood) {
    const moods = { great: '🔥', good: '😊', neutral: '😐', frustrated: '😤', tired: '😴' };
    return moods[mood] || mood;
  },
  
  delete(id) {
    if (confirm('Delete this entry?')) {
      Store.deleteEntry(id);
      this.render();
    }
  }
};

// ==================== ACHIEVEMENTS MODULE ====================
const Achievements = {
  render() {
    const container = document.getElementById('achievementsGrid');
    if (!container) return;
    
    const unlocked = Store.data.achievements;
    const all = Store.achievementsList;

    const totalEl = document.getElementById('totalAchievements');
    const progressEl = document.getElementById('achievementProgress');
    if (totalEl) totalEl.textContent = unlocked.length;
    if (progressEl) progressEl.style.width = `${(unlocked.length / all.length) * 100}%`;
    
    container.innerHTML = all.map(achievement => {
      const isUnlocked = unlocked.includes(achievement.id);
      return `
        <div class="card" style="${!isUnlocked ? 'opacity: 0.5;' : ''}">
          <div style="text-align: center; padding: 20px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: ${isUnlocked ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--bg-input)'}; 
              display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
              <span class="material-icons" style="font-size: 30px; color: ${isUnlocked ? 'white' : 'var(--text-muted)'};">
                ${achievement.icon}
              </span>
            </div>
            <div style="font-weight: 600; margin-bottom: 4px;">${achievement.name}</div>
            <div class="text-muted" style="font-size: 0.8rem;">${achievement.desc}</div>
            ${isUnlocked ? `<div class="badge badge-success" style="margin-top: 8px;">+${achievement.xp} XP</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }
};

// ==================== CALENDAR MODULE ====================
const Calendar = {
  currentDate: new Date(),

  render() {
    const container = document.getElementById('calendarGrid');
    const monthYearEl = document.getElementById('calendarMonthYear');
    const dayActivitiesEl = document.getElementById('calendarDayActivities');
    if (!container || !monthYearEl) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    monthYearEl.textContent = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    let html = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 8px;">';
    days.forEach(day => {
      html += `<div style="text-align: center; font-weight: 600; color: var(--text-muted); padding: 8px;">${day}</div>`;
    });
    html += '</div>';
    
    html += '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;">';
    
    // Empty cells for days before first day
    for (let i = 0; i < firstDay; i++) {
      html += '<div></div>';
    }
    
    // Days
    const activities = Store.getActivities();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayActivities = activities.filter(a => new Date(a.date).toDateString() === date.toDateString());
      const totalMinutes = dayActivities.reduce((sum, a) => sum + a.duration, 0);
      const hasActivity = totalMinutes > 0;
      const isToday = date.toDateString() === new Date().toDateString();
      
      html += `
        <div style="min-height: 80px; border: 1px solid var(--border-light); border-radius: 8px; padding: 8px; cursor: pointer;"
          onclick="Calendar.showDay(${year}, ${month}, ${day})">
          <div style="font-weight: 600; ${isToday ? 'color: var(--primary);' : ''}">${day}</div>
          ${hasActivity ? `
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
              ${totalMinutes} min
            </div>
          ` : ''}
        </div>
      `;
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    document.getElementById('calendarDayActivities').innerHTML = '<p class="text-muted text-center py-3">Click a day to view activities</p>';
  },
  
  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
  },
  
  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
  },
  
  showDay(year, month, day) {
    const date = new Date(year, month, day);
    const activities = Store.getActivitiesByDate(date);
    const container = document.getElementById('calendarDayActivities');
    
    if (activities.length === 0) {
      container.innerHTML = '<p class="text-muted text-center py-3">No activities on this day</p>';
      return;
    }
    
    const ratingEmojis = { great: '🔥', good: '👍', okay: '🤔', struggled: '💪' };
    
    container.innerHTML = activities.map(a => {
      const skill = Store.getSkills().find(s => s.id === a.skillId);
      return `
        <div class="list-item">
          <div class="activity-icon">
            <span class="material-icons">code</span>
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 600;">${a.title}</div>
            <div class="text-muted" style="font-size: 0.85rem;">
              ${skill ? skill.name : 'Unknown'} • ${a.duration} min • ${ratingEmojis[a.rating]}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
};

// ==================== ANALYTICS MODULE ====================
const Analytics = {
  activityChart: null,
  categoryChart: null,
  skillChart: null,
  chartsInitialized: false,

  init() {
    const stats = Store.getStats();
    const el1 = document.getElementById('analyticsTotalHours');
    const el2 = document.getElementById('analyticsTotalActivities');
    const el3 = document.getElementById('analyticsAvgProgress');
    const el4 = document.getElementById('analyticsCompletionRate');

    if (el1) el1.textContent = stats.totalHours;
    if (el2) el2.textContent = stats.totalActivities;
    if (el3) el3.textContent = stats.avgProgress + '%';
    if (el4) el4.textContent = Math.min(100, Math.round((stats.totalActivities / (stats.streak || 1)) * 10)) + '%';

    this.renderCharts();
    
    // Fix chart resize when window resizes (e.g., console opens/closes)
    if (!this.chartsInitialized) {
      this.chartsInitialized = true;
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.renderCharts();
        }, 250);
      });
    }
  },
  
  renderCharts() {
    // Activity Trend (30 days)
    const activities = Store.getActivities();
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayActivities = activities.filter(a => new Date(a.date).toDateString() === date.toDateString());
      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        hours: Math.round(dayActivities.reduce((sum, a) => sum + a.duration, 0) / 60 * 10) / 10
      });
    }
    
    const trendCtx = document.getElementById('activityTrendChart').getContext('2d');
    if (this.activityChart) this.activityChart.destroy();
    this.activityChart = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: last30Days.map(d => d.date),
        datasets: [{
          label: 'Hours',
          data: last30Days.map(d => d.hours),
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', maxTicksLimit: 10 }
          }
        }
      }
    });
    
    // Category Chart
    const skills = Store.getSkills();
    const categories = {};
    skills.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + s.progress;
    });
    
    const catCtx = document.getElementById('categoryChart').getContext('2d');
    if (this.categoryChart) this.categoryChart.destroy();
    this.categoryChart = new Chart(catCtx, {
      type: 'pie',
      data: {
        labels: Object.keys(categories),
        datasets: [{
          data: Object.values(categories),
          backgroundColor: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#cbd5e1', padding: 12 } }
        }
      }
    });
    
    // Skill Progress Chart
    const topSkills = skills.sort((a, b) => b.progress - a.progress).slice(0, 8);
    
    const skillCtx = document.getElementById('skillProgressChart').getContext('2d');
    if (this.skillChart) this.skillChart.destroy();
    this.skillChart = new Chart(skillCtx, {
      type: 'bar',
      data: {
        labels: topSkills.map(s => s.name),
        datasets: [{
          label: 'Progress %',
          data: topSkills.map(s => s.progress),
          backgroundColor: topSkills.map(s => s.color),
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
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
  }
};

// Export modules globally
window.Skills = Skills;
window.Projects = Projects;
window.Resources = Resources;
window.Journal = Journal;
window.Achievements = Achievements;
window.Calendar = Calendar;
window.Analytics = Analytics;

// ==================== COURSES MODULE ====================
const Courses = {
  render() {
    const container = document.getElementById('coursesGrid');
    if (!container) return;
    
    const filter = document.getElementById('courseFilter')?.value || 'all';
    
    let courses = Store.getCourses();
    
    // Filter courses
    if (filter === 'inprogress') {
      courses = courses.filter(c => c.progress > 0 && c.progress < 100);
    } else if (filter === 'completed') {
      courses = courses.filter(c => c.progress >= 100);
    } else if (filter === 'notstarted') {
      courses = courses.filter(c => c.progress === 0);
    }
    
    if (courses.length === 0) {
      container.innerHTML = `
        <div class="card" style="grid-column: span 3; text-align: center; padding: 40px;">
          <span class="material-icons" style="font-size: 48px; color: var(--text-muted);">school</span>
          <p class="text-muted" style="margin-top: 16px;">No courses yet. Add your first course!</p>
          <button class="btn btn-primary" style="margin-top: 12px;" onclick="showAddCourseModal()">
            <span class="material-icons">add</span> Add Course
          </button>
        </div>
      `;
      return;
    }
    
    container.innerHTML = courses.map(course => `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 4px;">${course.name}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">${course.provider || 'Self-paced'}</div>
          </div>
          <button class="btn btn-sm btn-outline" onclick="Courses.delete(${course.id})">
            <span class="material-icons" style="font-size: 18px;">delete</span>
          </button>
        </div>
        
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span class="text-muted" style="font-size: 0.85rem;">Progress</span>
            <span style="font-weight: 600; color: var(--primary);">${course.progress}%</span>
          </div>
          <div class="progress" style="height: 10px;">
            <div class="progress-bar" style="width: ${course.progress}%"></div>
          </div>
        </div>
        
        <input type="range" class="form-range" min="0" max="100" value="${course.progress}" 
          onchange="Courses.updateProgress(${course.id}, this.value)"
          style="width: 100%; margin-bottom: 16px;">
        
        ${course.nextLesson ? `
          <div style="background: var(--bg-hover); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">Next Lesson</div>
            <div style="font-weight: 500; font-size: 0.9rem;">${course.nextLesson}</div>
          </div>
        ` : ''}
        
        <div style="display: flex; gap: 8px;">
          <a href="${course.url}" target="_blank" class="btn btn-sm btn-primary" style="flex: 1;">
            <span class="material-icons" style="font-size: 16px;">open_in_new</span> Open
          </a>
          <button class="btn btn-sm btn-outline" onclick="Courses.editNextLesson(${course.id})">
            <span class="material-icons" style="font-size: 18px;">edit</span>
          </button>
        </div>
      </div>
    `).join('');
  },
  
  updateProgress(id, progress) {
    Store.updateCourseProgress(id, parseInt(progress));
    this.render();
  },
  
  editNextLesson(id) {
    const course = Store.getCourses().find(c => c.id === id);
    const currentLesson = course?.nextLesson || '';
    const newLesson = prompt('Enter next lesson:', currentLesson);
    if (newLesson !== null) {
      Store.updateCourse(id, { nextLesson: newLesson });
      this.render();
    }
  },
  
  delete(id) {
    if (confirm('Delete this course?')) {
      Store.deleteCourse(id);
      this.render();
    }
  }
};

window.Courses = Courses;

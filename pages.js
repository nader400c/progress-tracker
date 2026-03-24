// Pages - All page templates

const Pages = {
  // ==================== DASHBOARD ====================
  dashboard() {
    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><span class="material-icons">local_fire_department</span></div>
          <div class="stat-content">
            <div class="stat-value" id="dashStreak">0</div>
            <div class="stat-label">Day Streak</div>
            <div class="stat-change positive" id="dashStreakChange">🔥 Keep it up!</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><span class="material-icons">check_circle</span></div>
          <div class="stat-content">
            <div class="stat-value" id="dashActivities">0</div>
            <div class="stat-label">Activities Completed</div>
            <div class="stat-change positive" id="dashActivitiesChange">+0 this week</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><span class="material-icons">schedule</span></div>
          <div class="stat-content">
            <div class="stat-value" id="dashHours">0</div>
            <div class="stat-label">Hours Coded</div>
            <div class="stat-change positive" id="dashHoursChange">+0h this week</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><span class="material-icons">emoji_events</span></div>
          <div class="stat-content">
            <div class="stat-value" id="dashLevel">1</div>
            <div class="stat-label">Current Level</div>
            <div class="stat-change" id="dashXp">0 / 100 XP</div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span class="material-icons">trending_up</span>
              Weekly Activity
            </div>
          </div>
          <div class="chart-container">
            <canvas id="weeklyChart"></canvas>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span class="material-icons">donut_large</span>
              Skill Distribution
            </div>
          </div>
          <div class="chart-container">
            <canvas id="skillsChart"></canvas>
          </div>
        </div>
      </div>

      <div class="grid-2" style="margin-top: 20px;">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span class="material-icons">psychology</span>
              Top Skills
            </div>
            <button class="btn btn-sm btn-outline" onclick="navigateTo('skills')">View All</button>
          </div>
          <div id="dashTopSkills"></div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span class="material-icons">history</span>
              Recent Activity
            </div>
            <button class="btn btn-sm btn-outline" onclick="showQuickAdd()">Log New</button>
          </div>
          <div id="dashRecentActivity"></div>
        </div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <div class="card-header">
          <div class="card-title">
            <span class="material-icons">flag</span>
            Active Projects
          </div>
          <button class="btn btn-sm btn-outline" onclick="navigateTo('projects')">View All</button>
        </div>
        <div id="dashActiveProjects"></div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <div class="card-header">
          <div class="card-title">
            <span class="material-icons">school</span>
            In-Progress Courses
          </div>
          <button class="btn btn-sm btn-outline" onclick="navigateTo('courses')">View All</button>
        </div>
        <div id="dashCourses"></div>
      </div>
    `;
  },

  dashboardInit() {
    Dashboard.init();
  },

  // ==================== SKILLS ====================
  skills() {
    return `
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-header">
          <div class="card-title">
            <span class="material-icons">filter_list</span>
            Filter & Sort
          </div>
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <select class="form-select" style="width: auto;" id="skillFilter" onchange="Skills.render()">
            <option value="all">All Skills</option>
            <option value="beginner">Beginner (0-25%)</option>
            <option value="intermediate">Intermediate (26-50%)</option>
            <option value="advanced">Advanced (51-75%)</option>
            <option value="expert">Expert (76-100%)</option>
          </select>
          <select class="form-select" style="width: auto;" id="skillSort" onchange="Skills.render()">
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
            <option value="recent">Most Recent</option>
          </select>
          <button class="btn btn-primary" onclick="showAddSkillModal()">
            <span class="material-icons">add</span>
            Add Skill
          </button>
        </div>
      </div>

      <div class="grid-3" id="skillsGrid"></div>

      <div class="card" style="margin-top: 20px; display: none;">
        <div class="card-header">
          <div class="card-title">
            <span class="material-icons">path</span>
            Learning Paths
          </div>
        </div>
        <div id="learningPaths"></div>
      </div>
    `;
  },

  skillsInit() {
    Skills.render();
  },

  // ==================== COURSES ====================
  courses() {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div style="display: flex; gap: 12px;">
          <select class="form-select" style="width: auto;" id="courseFilter" onchange="Courses.render()">
            <option value="all">All Courses</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="notstarted">Not Started</option>
          </select>
        </div>
        <button class="btn btn-primary" onclick="showAddCourseModal()">
          <span class="material-icons">add</span>
          Add Course
        </button>
      </div>

      <div class="grid-3" id="coursesGrid"></div>
    `;
  },

  coursesInit() {
    Courses.render();
  },

  // ==================== PROJECTS ====================
  projects() {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div style="display: flex; gap: 12px;">
          <select class="form-select" style="width: auto;" id="projectFilter" onchange="Projects.render()">
            <option value="all">All Projects</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="onhold">On Hold</option>
          </select>
        </div>
        <button class="btn btn-primary" onclick="showAddProjectModal()">
          <span class="material-icons">add</span>
          New Project
        </button>
      </div>

      <div class="grid-3" id="projectsGrid"></div>
    `;
  },

  projectsInit() {
    Projects.render();
  },

  // ==================== RESOURCES ====================
  resources() {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div style="display: flex; gap: 12px;">
          <select class="form-select" style="width: auto;" id="resourceType" onchange="Resources.render()">
            <option value="all">All Types</option>
            <option value="video">Videos</option>
            <option value="article">Articles</option>
            <option value="course">Courses</option>
            <option value="book">Books</option>
            <option value="practice">Practice</option>
          </select>
        </div>
        <button class="btn btn-primary" onclick="showAddResourceModal()">
          <span class="material-icons">add</span>
          Add Resource
        </button>
      </div>

      <div class="grid-3" id="resourcesGrid"></div>
    `;
  },

  resourcesInit() {
    Resources.render();
  },

  // ==================== JOURNAL ====================
  journal() {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div class="card-title">
          <span class="material-icons">edit_note</span>
          Learning Journal
        </div>
        <button class="btn btn-primary" onclick="showAddEntryModal()">
          <span class="material-icons">add</span>
          New Entry
        </button>
      </div>

      <div class="grid-2">
        <div class="card" style="grid-column: span 2;">
          <div class="card-header">
            <div class="card-title">
              <span class="material-icons">today</span>
              Today's Entry
            </div>
          </div>
          <div id="todaysEntry"></div>
        </div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <div class="card-header">
          <div class="card-title">
            <span class="material-icons">history_edu</span>
            Past Entries
          </div>
        </div>
        <div id="journalEntries"></div>
      </div>
    `;
  },

  journalInit() {
    Journal.render();
  },

  // ==================== ACHIEVEMENTS ====================
  achievements() {
    return `
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-header">
          <div class="card-title">
            <span class="material-icons">trophy</span>
            Your Achievements
          </div>
        </div>
        <div style="text-align: center; padding: 20px;">
          <div class="stat-value" id="totalAchievements">0</div>
          <div class="text-muted">of 50 achievements unlocked</div>
          <div class="progress" style="max-width: 400px; margin: 20px auto;">
            <div class="progress-bar" id="achievementProgress" style="width: 0%"></div>
          </div>
        </div>
      </div>

      <div class="grid-4" id="achievementsGrid"></div>
    `;
  },

  achievementsInit() {
    Achievements.render();
  },

  // ==================== CALENDAR ====================
  calendar() {
    return `
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <span class="material-icons">calendar_month</span>
            <span id="calendarMonthYear"></span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm btn-outline" onclick="Calendar.prevMonth()">
              <span class="material-icons">chevron_left</span>
            </button>
            <button class="btn btn-sm btn-outline" onclick="Calendar.nextMonth()">
              <span class="material-icons">chevron_right</span>
            </button>
          </div>
        </div>
        <div id="calendarGrid"></div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <div class="card-header">
          <div class="card-title">
            <span class="material-icons">event_note</span>
            Selected Day Activities
          </div>
        </div>
        <div id="calendarDayActivities"></div>
      </div>
    `;
  },

  calendarInit() {
    Calendar.render();
  },

  // ==================== ANALYTICS ====================
  analytics() {
    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><span class="material-icons">timer</span></div>
          <div class="stat-content">
            <div class="stat-value" id="analyticsTotalHours">0</div>
            <div class="stat-label">Total Hours</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><span class="material-icons">task</span></div>
          <div class="stat-content">
            <div class="stat-value" id="analyticsTotalActivities">0</div>
            <div class="stat-label">Total Activities</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><span class="material-icons">school</span></div>
          <div class="stat-content">
            <div class="stat-value" id="analyticsAvgProgress">0%</div>
            <div class="stat-label">Avg Skill Progress</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><span class="material-icons">workspace_premium</span></div>
          <div class="stat-content">
            <div class="stat-value" id="analyticsCompletionRate">0%</div>
            <div class="stat-label">Goal Completion</div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span class="material-icons">show_chart</span>
              Activity Trend (Last 30 Days)
            </div>
          </div>
          <div class="chart-container">
            <canvas id="activityTrendChart"></canvas>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span class="material-icons">pie_chart</span>
              Time by Category
            </div>
          </div>
          <div class="chart-container">
            <canvas id="categoryChart"></canvas>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <div class="card-header">
          <div class="card-title">
            <span class="material-icons">bar_chart</span>
              Skill Progress Over Time
          </div>
        </div>
        <div class="chart-container">
          <canvas id="skillProgressChart"></canvas>
        </div>
      </div>
    `;
  },

  analyticsInit() {
    Analytics.init();
  },

  // ==================== SETTINGS ====================
  settings() {
    return `
      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span class="material-icons">person</span>
              Profile Settings
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Display Name</label>
            <input type="text" class="form-control" id="settingName" value="Developer">
          </div>
          <div class="form-group">
            <label class="form-label">Level</label>
            <input type="number" class="form-control" id="settingLevel" value="1" min="1">
          </div>
          <button class="btn btn-primary" onclick="Settings.saveProfile()">Save Changes</button>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span class="material-icons">palette</span>
              Appearance
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Theme</label>
            <select class="form-select" id="settingTheme" onchange="Settings.setTheme(this.value)">
              <option value="dark">Dark Mode</option>
              <option value="light">Light Mode</option>
            </select>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span class="material-icons">data_usage</span>
              Data Management
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <button class="btn btn-outline" onclick="Settings.exportData()">
              <span class="material-icons">download</span>
              Export Data (JSON)
            </button>
            <button class="btn btn-outline" onclick="document.getElementById('importFile').click()">
              <span class="material-icons">upload</span>
              Import Data
            </button>
            <input type="file" id="importFile" accept=".json" style="display: none;" onchange="Settings.importData(this)">
            <button class="btn btn-danger" onclick="Settings.resetAll()">
              <span class="material-icons">delete_forever</span>
              Reset All Data
            </button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span class="material-icons">info</span>
              About
            </div>
          </div>
          <div>
            <p><strong>Code Progress Tracker</strong></p>
            <p class="text-muted">Version 2.0.0</p>
            <p class="text-muted" style="margin-top: 12px;">
              A professional tool for tracking your coding journey, 
              managing learning resources, and achieving your goals.
            </p>
          </div>
        </div>
      </div>
    `;
  },

  settingsInit() {
    Settings.init();
  }
};

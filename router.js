// Router for SPA Navigation

const Router = {
  currentPage: 'dashboard',
  
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },
  
  handleRoute() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    this.currentPage = hash;
    
    // Update nav items - remove active from all, add to current
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.page === hash) {
        item.classList.add('active');
      }
    });
    
    // Update page title
    const titles = {
      dashboard: 'Dashboard',
      skills: 'Skills & Learning Paths',
      courses: 'My Courses',
      projects: 'Projects',
      resources: 'Learning Resources',
      journal: 'Journal',
      achievements: 'Achievements',
      calendar: 'Calendar',
      analytics: 'Analytics',
      settings: 'Settings'
    };
    
    const titleEl = document.getElementById('pageTitle');
    if (titleEl) {
      titleEl.textContent = titles[hash] || 'Dashboard';
    }
    
    // Load page content
    this.loadPage(hash);
  },
  
  loadPage(page) {
    const container = document.getElementById('pageContainer');
    if (!container) {
      console.error('pageContainer not found');
      return;
    }
    
    // Show loading state
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading ${page}...</div>
      </div>
    `;
    
    if (typeof Pages !== 'undefined' && typeof Pages[page] === 'function') {
      try {
        const html = Pages[page]();
        container.innerHTML = html;
        
        // Initialize page after DOM is ready
        setTimeout(() => {
          const initFn = Pages[page + 'Init'];
          if (typeof initFn === 'function') {
            initFn();
          }
        }, 50);
      } catch (e) {
        console.error('Error loading page ' + page + ':', e);
        container.innerHTML = '<div class="card"><p>Error loading page</p></div>';
      }
    } else {
      console.error('Page not found:', page);
      container.innerHTML = '<div class="card"><p>Page not found: ' + page + '</p></div>';
    }
  },
  
  navigate(page) {
    // Close sidebar on mobile
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    
    window.location.hash = page;
  }
};

function navigateTo(page) {
  Router.navigate(page);
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
  if (overlay) {
    overlay.classList.toggle('active');
  }
}

/**
 * ExamSphere Portal - Interactive Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initExamCodeAccess();
  initScheduleFilters();
  initSystemDiagnostic();
  initAuthModal();
  initFaqAccordion();
  initMobileMenu();
});

// Toast notification helper
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' 
        ? '<polyline points="20 6 9 17 4 12"></polyline>' 
        : type === 'error'
        ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'}
    </svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   Quick Exam Code Access
   ========================================================================== */
function initExamCodeAccess() {
  const form = document.getElementById('exam-code-form');
  const input = document.getElementById('exam-code-input');
  const sampleLinks = document.querySelectorAll('.sample-code-link');
  const launchModal = document.getElementById('exam-launch-modal');
  const launchModalClose = document.getElementById('launch-modal-close');
  const launchModalConfirm = document.getElementById('launch-modal-confirm');
  const launchExamCodeDisplay = document.getElementById('launch-exam-code-display');

  // Sample code click handlers
  sampleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const code = link.getAttribute('data-code');
      if (input && code) {
        input.value = code;
        input.focus();
        showToast(`Exam Code ${code} selected`, 'info');
      }
    });
  });

  // Uppercase format on typing
  if (input) {
    input.addEventListener('input', () => {
      input.value = input.value.toUpperCase();
    });
  }

  // Submit quick form
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = input ? input.value.trim().toUpperCase() : '';
      if (!code) {
        showToast('Please enter an exam access code or room key.', 'error');
        if (input) input.focus();
        return;
      }

      if (code.length < 4) {
        showToast('Exam code must be at least 4 characters.', 'error');
        return;
      }

      // Open Exam Hall Confirmation Modal
      if (launchModal && launchExamCodeDisplay) {
        launchExamCodeDisplay.textContent = code;
        launchModal.classList.add('active');
      } else {
        showToast(`Connecting to examination room: ${code}...`, 'success');
      }
    });
  }

  // Close launch modal
  if (launchModalClose && launchModal) {
    launchModalClose.addEventListener('click', () => {
      launchModal.classList.remove('active');
    });
  }

  // Confirm and start exam
  if (launchModalConfirm) {
    launchModalConfirm.addEventListener('click', () => {
      const code = launchExamCodeDisplay ? launchExamCodeDisplay.textContent : '';
      launchModal.classList.remove('active');
      showToast(`Launching Secure Test Environment for [${code}]... Fullscreen lock enabled.`, 'success');
    });
  }
}

/* ==========================================================================
   Exam Schedule Filter Tabs & Search
   ========================================================================== */
function initScheduleFilters() {
  const tabs = document.querySelectorAll('.filter-tabs .tab-btn');
  const cards = document.querySelectorAll('.exams-grid .exam-card');
  const searchInput = document.getElementById('exam-search-input');

  function filterExams() {
    const activeTab = document.querySelector('.filter-tabs .tab-btn.active');
    const filter = activeTab ? activeTab.getAttribute('data-filter') : 'ALL';
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    cards.forEach(card => {
      const status = card.getAttribute('data-status');
      const text = card.textContent.toLowerCase();

      const matchesTab = (filter === 'ALL') || (status === filter);
      const matchesSearch = query === '' || text.includes(query);

      if (matchesTab && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterExams();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterExams);
  }

  // Action buttons inside cards
  const examActionBtns = document.querySelectorAll('.exam-action-btn');
  examActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      const title = btn.getAttribute('data-title');
      const input = document.getElementById('exam-code-input');
      if (input && code) {
        input.value = code;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast(`Selected "${title}" (${code})`, 'info');
      }
    });
  });
}

/* ==========================================================================
   Pre-Exam System Readiness Check Utility
   ========================================================================== */
function initSystemDiagnostic() {
  const runBtn = document.getElementById('run-diagnostic-btn');
  const checkBoxes = document.querySelectorAll('.check-item-box');
  const metaText = document.getElementById('diagnostic-meta-text');

  if (!runBtn) return;

  runBtn.addEventListener('click', () => {
    runBtn.disabled = true;
    runBtn.innerHTML = `
      <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle>
      </svg>
      Running Diagnostics...
    `;
    if (metaText) metaText.textContent = 'Testing hardware, permissions, and network latency...';

    // Sequentially pass tests
    const tests = [
      { id: 'check-browser', status: 'Browser Compatible (Modern HTML5)' },
      { id: 'check-webcam', status: 'Webcam Ready & Permission Granted' },
      { id: 'check-audio', status: 'Microphone Active & Calibrated' },
      { id: 'check-network', status: 'Ping: 18ms | 45 Mbps (Optimal)' }
    ];

    tests.forEach((test, idx) => {
      setTimeout(() => {
        const el = document.getElementById(test.id);
        if (el) {
          el.classList.add('passed');
          const statusEl = el.querySelector('.check-item-status');
          if (statusEl) {
            statusEl.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              ${test.status}
            `;
          }
        }

        // On last test finish
        if (idx === tests.length - 1) {
          runBtn.disabled = false;
          runBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            System Check Passed
          `;
          runBtn.classList.remove('btn-accent');
          runBtn.classList.add('btn-success');
          if (metaText) {
            metaText.innerHTML = '<strong>Success!</strong> All diagnostics passed. Your machine meets all examination proctoring requirements.';
          }
          showToast('Pre-flight system check passed successfully! (100% Ready)', 'success');
        }
      }, (idx + 1) * 600);
    });
  });
}

/* ==========================================================================
   Interactive Authentication Modal
   ========================================================================== */
function initAuthModal() {
  const modal = document.getElementById('auth-modal');
  const openBtns = document.querySelectorAll('.open-auth-btn');
  const closeBtn = document.getElementById('auth-modal-close');
  const tabs = document.querySelectorAll('.auth-tab-btn');
  const idLabel = document.getElementById('auth-id-label');
  const idInput = document.getElementById('auth-id-input');
  const authForm = document.getElementById('auth-form');
  const demoFillBtn = document.getElementById('demo-fill-btn');
  const modalTitle = document.getElementById('auth-modal-title');

  let currentRole = 'student';

  const roleConfigs = {
    student: {
      label: 'Student Registration / Roll No.',
      placeholder: 'e.g. 2026-CS-1048',
      demoUser: '2026-CS-1048',
      title: 'Student Portal Login'
    },
    faculty: {
      label: 'Faculty Employee ID',
      placeholder: 'e.g. FAC-9904',
      demoUser: 'FAC-9904',
      title: 'Examiner / Faculty Access'
    },
    admin: {
      label: 'Admin Account ID',
      placeholder: 'e.g. ADMIN-EXAM-01',
      demoUser: 'ADMIN-EXAM-01',
      title: 'Institution Admin Console'
    }
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const role = btn.getAttribute('data-role') || 'student';
      switchRole(role);
      if (modal) modal.classList.add('active');
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Close on backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  function switchRole(role) {
    currentRole = role;
    tabs.forEach(t => {
      if (t.getAttribute('data-role') === role) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    const cfg = roleConfigs[role];
    if (cfg) {
      if (idLabel) idLabel.textContent = cfg.label;
      if (idInput) idInput.placeholder = cfg.placeholder;
      if (modalTitle) modalTitle.textContent = cfg.title;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const role = tab.getAttribute('data-role');
      switchRole(role);
    });
  });

  // Demo auto fill
  if (demoFillBtn) {
    demoFillBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const cfg = roleConfigs[currentRole];
      if (cfg && idInput) {
        idInput.value = cfg.demoUser;
        const pass = document.getElementById('auth-password-input');
        if (pass) pass.value = 'Portal@2026';
        showToast(`Auto-filled sample credentials for ${currentRole.toUpperCase()}`, 'info');
      }
    });
  }

  // Handle form submit
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = idInput ? idInput.value.trim() : '';
      if (!id) {
        showToast('Please enter your portal ID.', 'error');
        return;
      }
      modal.classList.remove('active');
      showToast(`Welcome back! Authenticated as ${currentRole.toUpperCase()} (${id})`, 'success');
    });
  }
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.header-nav .nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }
}

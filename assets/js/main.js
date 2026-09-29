/**
 * Pumpkin Patch & Fall Festival Farm - Global JavaScript
 * Shared interactive behaviors: Navigation, Mobile Menu, Dark Mode, RTL, Modals, Loader, Scroll
 */

(function () {
  'use strict';

  // 1. Initial State Restoration (Dark Mode & RTL)
  function initThemeAndDirection() {
    const savedTheme = localStorage.getItem('site_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      updateThemeButtons(true);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      updateThemeButtons(false);
    }

    const savedDir = localStorage.getItem('site_dir') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    updateDirButtons(savedDir);
  }

  function updateThemeButtons(isDark) {
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => {
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = isDark
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    });
  }

  function updateDirButtons(currentDir) {
    const dirButtons = document.querySelectorAll('.rtl-toggle-btn');
    dirButtons.forEach(btn => {
      const isRtl = currentDir === 'rtl';
      btn.setAttribute('aria-label', isRtl ? 'Switch to LTR' : 'Switch to RTL');
      btn.textContent = isRtl ? 'LTR' : 'RTL';
    });
  }

  // Run as early as possible
  initThemeAndDirection();

  document.addEventListener('DOMContentLoaded', function () {
    // 2. Preloader
    const loader = document.querySelector('.page-loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('loaded');
      }, 350);
    }

    // 3. Fixed Header Scroll Elevation
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
          siteHeader.classList.add('scrolled');
        } else {
          siteHeader.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // 4. Desktop Home Dropdown (CLICK ONLY, Hover never opens)
    const dropdownToggle = document.querySelector('.has-dropdown .dropdown-toggle');
    const dropdownMenu = document.querySelector('.has-dropdown .dropdown-menu');

    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
        dropdownToggle.setAttribute('aria-expanded', !isExpanded);
        dropdownMenu.classList.toggle('show');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', function (e) {
        if (!e.target.closest('.has-dropdown')) {
          dropdownToggle.setAttribute('aria-expanded', 'false');
          dropdownMenu.classList.remove('show');
        }
      });

      // Close dropdown on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          dropdownToggle.setAttribute('aria-expanded', 'false');
          dropdownMenu.classList.remove('show');
        }
      });
    }

    // 5. Mobile Drawer Open/Close & Backdrop
    const mobileToggleBtn = document.querySelector('.mobile-toggle-btn');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');

    function openMobileMenu() {
      if (mobileNavDrawer && mobileNavBackdrop) {
        mobileNavDrawer.classList.add('open');
        mobileNavBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Ensure mobile home accordion is closed by default when drawer opens
        if (mobileAccordionBtn && mobileAccordionContent) {
          mobileAccordionContent.classList.remove('show');
          mobileAccordionBtn.setAttribute('aria-expanded', 'false');
          const arrow = mobileAccordionBtn.querySelector('svg');
          if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
      }
    }

    function closeMobileMenu() {
      if (mobileNavDrawer && mobileNavBackdrop) {
        mobileNavDrawer.classList.remove('open');
        mobileNavBackdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    if (mobileToggleBtn) {
      mobileToggleBtn.addEventListener('click', openMobileMenu);
    }
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', closeMobileMenu);
    }
    if (mobileNavBackdrop) {
      mobileNavBackdrop.addEventListener('click', closeMobileMenu);
    }

    // Auto-close mobile drawer if user resizes window to desktop width (>1366px)
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1366) {
        closeMobileMenu();
      }
    });

    // 6. Mobile Home Accordion (CLICK ONLY)
    const mobileAccordionBtn = document.querySelector('.mobile-accordion-btn');
    const mobileAccordionContent = document.querySelector('.mobile-accordion-content');

    if (mobileAccordionBtn && mobileAccordionContent) {
      mobileAccordionBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = mobileAccordionContent.classList.contains('show');
        if (isOpen) {
          mobileAccordionContent.classList.remove('show');
          mobileAccordionBtn.setAttribute('aria-expanded', 'false');
          const arrow = mobileAccordionBtn.querySelector('svg');
          if (arrow) arrow.style.transform = 'rotate(0deg)';
        } else {
          mobileAccordionContent.classList.add('show');
          mobileAccordionBtn.setAttribute('aria-expanded', 'true');
          const arrow = mobileAccordionBtn.querySelector('svg');
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        }
      });
    }

    // 7. Auto-close mobile menu on any navigation click
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-sub-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });

    // 8. Dark Mode Toggle Click Handler
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const isCurrentDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isCurrentDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('site_theme', newTheme);
        updateThemeButtons(!isCurrentDark);
      });
    });

    // 9. RTL/LTR Toggle Click Handler
    const dirButtons = document.querySelectorAll('.rtl-toggle-btn');
    dirButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        document.documentElement.setAttribute('dir', newDir);
        localStorage.setItem('site_dir', newDir);
        updateDirButtons(newDir);
      });
    });

    // 10. Login / Register Modal
    const authBackdrop = document.querySelector('.auth-modal-backdrop');
    const authTriggers = document.querySelectorAll('.btn-login, [data-auth-trigger]');
    const authCloseBtn = document.querySelector('.auth-modal-close');
    const authTabButtons = document.querySelectorAll('.auth-tab-btn');
    const authPanes = document.querySelectorAll('.auth-tab-pane');

    function openAuthModal(defaultTab = 'login') {
      if (authBackdrop) {
        switchAuthTab(defaultTab);
        authBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeAuthModal() {
      if (authBackdrop) {
        authBackdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    function switchAuthTab(targetTab) {
      authTabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === targetTab) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      authPanes.forEach(pane => {
        if (pane.id === `tab-${targetTab}`) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    }

    authTriggers.forEach(trigger => {
      trigger.addEventListener('click', function (e) {
        if (trigger.tagName === 'A' && trigger.getAttribute('href') && trigger.getAttribute('href') !== '#') {
          return; // Let standard link navigate directly to login.html
        }
        e.preventDefault();
        openAuthModal('login');
      });
    });

    if (authCloseBtn) {
      authCloseBtn.addEventListener('click', closeAuthModal);
    }
    if (authBackdrop) {
      authBackdrop.addEventListener('click', function (e) {
        if (e.target === authBackdrop) {
          closeAuthModal();
        }
      });
    }

    authTabButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const tab = this.getAttribute('data-tab');
        switchAuthTab(tab);
      });
    });

    // Dedicated Login Page Tab Switcher & Password Visibility
    const loginPageTabs = document.querySelectorAll('.login-tab-btn');
    const loginPagePanes = document.querySelectorAll('.login-tab-pane');

    loginPageTabs.forEach(tabBtn => {
      tabBtn.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        loginPageTabs.forEach(b => b.classList.remove('active'));
        loginPagePanes.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });

    const passwordToggles = document.querySelectorAll('.password-toggle-btn');
    passwordToggles.forEach(toggle => {
      toggle.addEventListener('click', function () {
        const targetInputId = this.getAttribute('data-input');
        const targetInput = document.getElementById(targetInputId);
        if (targetInput) {
          const isPassword = targetInput.type === 'password';
          targetInput.type = isPassword ? 'text' : 'password';
          this.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
          this.classList.toggle('visible', isPassword);
        }
      });
    });

    // 11. Scroll to Top
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (scrollTopBtn) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      }, { passive: true });

      scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // 12. Active Navigation Link Highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link, .mobile-sub-link');
    
    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
        if (link.classList.contains('dropdown-item')) {
          const parentToggle = document.querySelector('.dropdown-toggle');
          if (parentToggle) parentToggle.classList.add('active');
        }
      }
    });

    // 13. Accessible Custom Form Select Dropdowns
    const customSelectWrappers = document.querySelectorAll('.custom-select-wrapper');
    customSelectWrappers.forEach(wrapper => {
      const trigger = wrapper.querySelector('.custom-select-trigger');
      const dropdown = wrapper.querySelector('.custom-select-dropdown');
      const valueSpan = wrapper.querySelector('.custom-select-value');
      const options = wrapper.querySelectorAll('.custom-select-option');
      const hiddenSelect = wrapper.querySelector('select');

      if (!trigger || !dropdown) return;

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = wrapper.classList.contains('open');
        customSelectWrappers.forEach(w => {
          if (w !== wrapper) {
            w.classList.remove('open');
            const btn = w.querySelector('.custom-select-trigger');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          }
        });
        wrapper.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen);
      });

      options.forEach(option => {
        option.addEventListener('click', function (e) {
          e.stopPropagation();
          const val = this.getAttribute('data-value');
          const text = this.textContent.trim();

          options.forEach(opt => opt.classList.remove('selected'));
          this.classList.add('selected');

          if (valueSpan) {
            valueSpan.textContent = text;
            valueSpan.classList.remove('placeholder');
          }

          if (hiddenSelect) {
            hiddenSelect.value = val;
            hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }

          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.style.borderColor = '';
        });
      });
    });

    // Close custom select dropdown on outside click or Escape
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.custom-select-wrapper')) {
        customSelectWrappers.forEach(w => {
          w.classList.remove('open');
          const btn = w.querySelector('.custom-select-trigger');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        customSelectWrappers.forEach(w => {
          w.classList.remove('open');
          const btn = w.querySelector('.custom-select-trigger');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }
    });

  });
})();

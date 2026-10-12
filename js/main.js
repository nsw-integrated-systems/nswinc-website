/* ============================================================
   NSW Integrated Systems — Main JavaScript
   main.js | Version 1.0
   ============================================================ */

(function () {
  'use strict';

  /* ─── DOM Ready ──────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initNavScroll();
    initMobileMenu();
    initFadeIn();
    initProjectFilter();
    initContactForm();
    initSmoothScroll();
    setActiveNav();
  });

  /* ─── Nav Background on Scroll ───────────────────────────── */
  function initNavScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    function updateNav() {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav(); // Run on init
  }

  /* ─── Mobile Menu Toggle ──────────────────────────────────── */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    // Toggle open/close
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileMenu();
    });

    function openMobileMenu() {
      mobileMenu.classList.add('open');
      hamburger.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /* ─── IntersectionObserver — Fade In ─────────────────────── */
  function initFadeIn() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    // If IntersectionObserver not supported, just show everything
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ─── Project Filter Tabs ────────────────────────────────── */
  function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Update active state
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(function (card) {
          if (filter === 'all') {
            card.removeAttribute('data-hidden');
            card.style.display = '';
          } else {
            const category = card.getAttribute('data-category');
            if (category === filter) {
              card.removeAttribute('data-hidden');
              card.style.display = '';
            } else {
              card.setAttribute('data-hidden', 'true');
              card.style.display = 'none';
            }
          }
        });
      });
    });
  }

  /* ─── Contact Form Handler ───────────────────────────────── */
  function initContactForm() {
    const form = document.querySelector('#contact-form');
    const successMsg = document.querySelector('.form-success');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#E53E3E';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Simulate submission
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(function () {
        form.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        if (successMsg) {
          successMsg.style.display = 'block';
          setTimeout(function () {
            successMsg.style.display = 'none';
          }, 5000);
        }
      }, 1200);
    });

    // Clear error state on input
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.style.borderColor = '';
      });
    });
  }

  /* ─── Smooth Scroll for Anchor Links ─────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const navHeight = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-height')
            .trim()
        ) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ─── Active Nav State ────────────────────────────────────── */
  function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('/').pop();

      if (
        linkPage === currentPage ||
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')
      ) {
        link.classList.add('active');
      }
    });
  }
})();

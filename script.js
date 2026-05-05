/* =====================================================
   HUBX — Static Landing Page Interactions
   ===================================================== */

(function () {
  'use strict';

  /* ---------- DOM helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile Menu ---------- */
  const burger = $('#burger');
  const mobileMenu = $('#mobile-menu');

  const closeMobileMenu = () => {
    if (!burger || !mobileMenu) return;
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  };

  const toggleMobileMenu = () => {
    if (!burger || !mobileMenu) return;
    const isOpen = burger.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.classList.toggle('is-open', isOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  };

  if (burger) burger.addEventListener('click', toggleMobileMenu);
  $$('.mobile-menu__link').forEach(l => l.addEventListener('click', closeMobileMenu));

  /* ---------- Smooth scroll with sticky header offset ---------- */
  const header = $('#site-header');
  const getHeaderHeight = () => (header ? header.offsetHeight : 76);

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderHeight() + 1;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Popup ---------- */
  const popup = $('#request-popup');
  const popupForm = $('#popup-form');
  const popupSuccess = $('#popup-success');
  let lastFocusedEl = null;

  const openPopup = () => {
    if (!popup) return;
    lastFocusedEl = document.activeElement;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    closeMobileMenu();
    // reset to form view
    if (popupForm && popupSuccess) {
      popupForm.hidden = false;
      popupSuccess.hidden = true;
      popupForm.reset();
    }
    // focus first field
    setTimeout(() => {
      const first = popup.querySelector('input, select, textarea, button');
      if (first) first.focus();
    }, 80);
  };

  const closePopup = () => {
    if (!popup) return;
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
  };

  $$('[data-open-popup]').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openPopup();
  }));
  $$('[data-close-popup]').forEach(btn => btn.addEventListener('click', closePopup));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup && popup.classList.contains('is-open')) {
      closePopup();
    }
  });

  /* ---------- Popup form submit ---------- */
  if (popupForm) {
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // simple inline validation
      const required = popupForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value || (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value))) {
          field.style.borderColor = '#000';
          field.focus();
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;

      popupForm.hidden = true;
      if (popupSuccess) popupSuccess.hidden = false;
    });
  }

  /* ---------- Page request form submit ---------- */
  const requestForm = $('#request-form');
  const formSuccess = $('#form-success');

  if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = requestForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value || (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value))) {
          field.style.borderColor = '#000';
          if (valid) field.focus();
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;

      requestForm.style.display = 'none';
      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ---------- Header subtle shadow on scroll ---------- */
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) header.style.boxShadow = '0 1px 0 rgba(0,0,0,0.06)';
    else header.style.boxShadow = '';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

})();

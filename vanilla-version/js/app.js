/**
 * Main Application Controller (Vanilla JS)
 * Coordinates page navigation, mobile menu, contact form submission, and component lifecycles.
 */

document.addEventListener('DOMContentLoaded', () => {
  class AppController {
    constructor() {
      this.currentPage = 'home';
      this.initNavigation();
      this.initCarousel();
      this.initGallery();
      this.quizManager = new window.VanillaQuizManager(this);
      this.initContactForm();
      this.initShareButton();
      this.initHashRouting();
    }

    initNavigation() {
      // Header brand click -> home
      const brandLogo = document.getElementById('nav-brand');
      if (brandLogo) {
        brandLogo.addEventListener('click', () => this.navigateTo('home'));
      }

      // Nav buttons (Desktop & Mobile)
      document.querySelectorAll('[data-nav-target]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const target = btn.getAttribute('data-nav-target');
          if (target === 'quiz') {
            this.quizManager.startTest();
          } else {
            this.navigateTo(target);
          }
          this.closeMobileMenu();
        });
      });

      // Mobile menu toggle
      this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
      this.mobileDrawer = document.getElementById('mobile-drawer');
      if (this.mobileMenuBtn && this.mobileDrawer) {
        this.mobileMenuBtn.addEventListener('click', () => {
          const isOpen = this.mobileDrawer.classList.toggle('is-open');
          this.mobileMenuBtn.innerHTML = isOpen ? '<span>✕</span> <span>Close</span>' : '<span>☰</span> <span>Menu</span>';
        });
      }
    }

    closeMobileMenu() {
      if (this.mobileDrawer && this.mobileDrawer.classList.contains('is-open')) {
        this.mobileDrawer.classList.remove('is-open');
        if (this.mobileMenuBtn) {
          this.mobileMenuBtn.innerHTML = '<span>☰</span> <span>Menu</span>';
        }
      }
    }

    navigateTo(page) {
      this.currentPage = page;

      // Toggle views
      const views = ['home', 'quiz', 'archive', 'results', 'about', 'contact'];
      views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) {
          if (v === page) {
            el.style.display = 'block';
            el.classList.add('v-page-fade-in');
          } else {
            el.style.display = 'none';
            el.classList.remove('v-page-fade-in');
          }
        }
      });

      // Body background class for archive view
      if (page === 'archive') {
        document.body.classList.add('page-is-archive');
      } else {
        document.body.classList.remove('page-is-archive');
      }

      // Update active nav link pill
      document.querySelectorAll('[data-nav-target]').forEach(btn => {
        const target = btn.getAttribute('data-nav-target');
        if (target === page) {
          btn.classList.add('is-active');
        } else {
          btn.classList.remove('is-active');
        }
      });

      // If opening archive, re-measure gallery
      if (page === 'archive' && this.gallery) {
        setTimeout(() => this.gallery.measure(), 60);
      }

      // If opening home, re-measure carousel
      if (page === 'home' && this.carousel) {
        setTimeout(() => this.carousel.measure(), 60);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.location.hash = page;
    }

    initCarousel() {
      const carouselEl = document.getElementById('landing-carousel-mount');
      if (carouselEl && window.VanillaCircularCarousel) {
        this.carousel = new window.VanillaCircularCarousel(carouselEl, {
          items: window.CAROUSEL_DESTINATIONS,
          speed: 8,
          tilt: -6,
          cornerRadius: 20,
          onItemClick: (item) => {
            if (item.page === 'quiz') {
              this.quizManager.startTest();
            } else {
              this.navigateTo(item.page);
            }
          }
        });
      }
    }

    initGallery() {
      const galleryEl = document.getElementById('archive-gallery-mount');
      if (galleryEl && window.VanillaCircularGallery) {
        this.gallery = new window.VanillaCircularGallery(galleryEl, {
          items: window.TEST_DATA,
          scrollEase: 0.05,
          bend: 2.5
        });
      }
    }

    initContactForm() {
      const form = document.getElementById('contact-form');
      const toast = document.getElementById('contact-success-toast');
      if (form && toast) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          form.reset();
          toast.style.display = 'block';
          toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => {
            toast.style.display = 'none';
          }, 5000);
        });
      }
    }

    initShareButton() {
      const shareBtn = document.getElementById('btn-share-results');
      const retakeBtn = document.getElementById('btn-retake-quiz');
      const browseBtn = document.getElementById('btn-browse-archive');

      if (shareBtn) {
        shareBtn.addEventListener('click', () => {
          const total = this.quizManager.userResponses.length;
          const correct = this.quizManager.userResponses.filter(r => r && r.isCorrect).length;
          const text = `I scored ${correct}/${total} on the "Human or AI?" Visual Perception Experiment! Can you tell who made it?`;

          if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
              shareBtn.innerHTML = '<span>Score Copied! ✓</span>';
              setTimeout(() => {
                shareBtn.innerHTML = `
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  <span>Share Results</span>`;
              }, 2500);
            });
          }
        });
      }

      if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
          this.quizManager.startTest();
        });
      }

      if (browseBtn) {
        browseBtn.addEventListener('click', () => {
          this.navigateTo('archive');
        });
      }
    }

    initHashRouting() {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'quiz', 'archive', 'results', 'about', 'contact'].includes(hash)) {
        if (hash === 'quiz') {
          this.quizManager.startTest();
        } else {
          this.navigateTo(hash);
        }
      } else {
        this.navigateTo('home');
      }

      window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.replace('#', '');
        if (['home', 'quiz', 'archive', 'results', 'about', 'contact'].includes(newHash) && newHash !== this.currentPage) {
          if (newHash === 'quiz') this.quizManager.startTest();
          else this.navigateTo(newHash);
        }
      });
    }
  }

  window.App = new AppController();
});

// ====== Mobile Navigation ======
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  if (!hamburger || !navLinks) return;

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('show');
    hamburger.classList.toggle('show', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      hamburger.classList.remove('show');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('show');
      hamburger.classList.remove('show');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ====== Smooth Scroll Navigation ======
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = document.getElementById('navbar')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    });
  });
}

// ====== Scroll Animations (Intersection Observer) ======
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Optionally stop observing after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with fade-up class and animatable elements
  document.querySelectorAll('.fade-up, .section, .program-card, .service-card, .blog-card, .testimonial-card, .mission-card').forEach(el => {
    observer.observe(el);
  });
}

// ====== Navbar Scroll Effect ======
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    if (scrollTop > 100) {
      navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
      navbar.style.boxShadow = 'var(--shadow-sm)';
    }

    lastScrollTop = scrollTop;
  }, { passive: true });
}

// ====== Form Validation ======
function validateForm(form) {
  let isValid = true;
  const fields = form.querySelectorAll('[required]');

  fields.forEach(field => {
    const errorContainer = field.parentElement.querySelector('.error-msg');
    
    field.classList.remove('error');
    field.parentElement.classList.remove('error');

    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        isValid = false;
        field.parentElement.classList.add('error');
        if (errorContainer) {
          errorContainer.textContent = 'Please enter a valid email address';
        }
      }
    } else if (field.type === 'tel') {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (field.value.trim() && !phoneRegex.test(field.value.trim())) {
        isValid = false;
        field.parentElement.classList.add('error');
        if (errorContainer) {
          errorContainer.textContent = 'Please enter a valid phone number';
        }
      }
    } else if (field.value.trim() === '') {
      isValid = false;
      field.parentElement.classList.add('error');
      if (errorContainer) {
        errorContainer.textContent = 'This field is required';
      }
    }
  });

  return isValid;
}

// ====== Contact Form Handler ======
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm(this)) {
      formMsg.textContent = 'Please fix the errors above and try again';
      formMsg.className = 'form-msg error';
      return;
    }

    formMsg.textContent = 'Sending your message...';
    formMsg.className = 'form-msg';

    // Simulate form submission
    setTimeout(() => {
      formMsg.textContent = '✓ Thank you! Your message has been received. We will respond within 48 hours.';
      formMsg.className = 'form-msg success';
      contactForm.reset();
      
      // Clear message after 5 seconds
      setTimeout(() => {
        formMsg.textContent = '';
      }, 5000);
    }, 800);
  });

  // Real-time validation
  contactForm.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('blur', function () {
      validateForm(contactForm);
    });
  });
}

// ====== Enrollment Modal ======
function initEnrollModal() {
  const enrollButtons = document.querySelectorAll('[data-enroll]');
  const modal = document.getElementById('enrollModal');
  const enrollForm = document.getElementById('enrollForm');
  const modalClose = document.getElementById('modalClose');
  const modalCancel = document.getElementById('modalCancel');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalOverlay = document.getElementById('modalOverlay');
  const enrollProgram = document.getElementById('enrollProgram');

  if (!modal) return;

  const programDetails = {
    'prep-year': {
      title: 'Preparatory Year for Studying in Spain',
      desc: 'Comprehensive 9-12 month program with academic Spanish, university preparation, visa support, and university application guidance.'
    },
    'prep-in-spain': {
      title: 'Immersive Programs in Spain',
      desc: 'Accelerated 2-8 week immersion programs in partner schools with homestays, cultural tours, and intensive language practice.'
    },
    'comm-tourism': {
      title: 'Spanish Communication & Linguistic Tourism',
      desc: 'Flexible conversational Spanish courses combined with guided cultural visits and real-world language practice.'
    },
    'camps': {
      title: 'Language Camps in Spain',
      desc: 'All-inclusive 1-4 week camps featuring intensive lessons, cultural excursions, homestays, and group activities.'
    },
    'exams': {
      title: 'Exam Preparation (DELE, SIELE, CCSE)',
      desc: 'Intensive exam-focused training with past papers, mock tests, strategy sessions, and personalized feedback.'
    }
  };

  function openModal(programKey) {
    const program = programDetails[programKey] || programDetails['exams'];
    
    if (modalTitle) modalTitle.textContent = program.title;
    if (modalDesc) modalDesc.textContent = program.desc;
    if (enrollProgram) enrollProgram.value = programKey;
    
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
      const firstInput = enrollForm.querySelector('input:first-of-type');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    enrollForm.reset();
  }

  // Open modal on program button click
  enrollButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const programKey = e.currentTarget.dataset.enroll;
      openModal(programKey);
    });
  });

  // Close modal handlers
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalCancel) {
    modalCancel.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // Form submission
  if (enrollForm) {
    enrollForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm(this)) {
        alert('Please fill in all required fields correctly');
        return;
      }

      alert('Thank you for your enrollment! We will contact you within 24 hours to confirm.');
      closeModal();
    });

    // Real-time validation
    enrollForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('blur', function () {
        validateForm(enrollForm);
      });
    });
  }
}

// ====== Parallax Scroll Effect ======
function initParallaxScroll() {
  const parallaxElements = document.querySelectorAll('[data-parallax="true"]');

  if (parallaxElements.length === 0) return;

  window.addEventListener('scroll', () => {
    parallaxElements.forEach(element => {
      const scrollPosition = window.scrollY;
      const elementOffset = element.offsetTop;
      const distance = scrollPosition - elementOffset;
      
      if (distance < element.offsetHeight) {
        element.style.backgroundPosition = `center ${distance * 0.5}px`;
      }
    });
  }, { passive: true });
}

// ====== Fade-up animation class ======
function initFadeUpClass() {
  const style = document.createElement('style');
  style.textContent = `
    .fade-up {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-up.in-view {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
}

// ====== Testimonials Auto-rotate ======
function initTestimonials() {
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  if (testimonialCards.length <= 1) return;

  let currentIndex = 0;
  const rotationTime = 5000; // 5 seconds

  // Add animation class
  const style = document.createElement('style');
  style.textContent = `
    @keyframes testimonialSlide {
      0% {
        opacity: 0;
        transform: translateX(20px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .testimonial-card {
      animation: testimonialSlide 0.6s ease-out;
    }
  `;
  document.head.appendChild(style);

  // Auto-rotate testimonials on smaller screens for mobile experience
  if (window.innerWidth < 768) {
    setInterval(() => {
      testimonialCards.forEach(card => card.style.display = 'none');
      currentIndex = (currentIndex + 1) % testimonialCards.length;
      testimonialCards[currentIndex].style.display = 'block';
    }, rotationTime);

    testimonialCards.forEach((card, index) => {
      card.style.display = index === 0 ? 'block' : 'none';
    });
  }
}

// ====== Gallery Light Effect ======
function initGalleryEffects() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
      const overlay = this.querySelector('.gallery-overlay');
      if (overlay) {
        overlay.style.transition = 'opacity 0.3s ease-out';
      }
    });
  });
}

// ====== Scroll to Top Button ======
function initScrollToTopButton() {
  let scrollTopBtn = document.getElementById('scrollToTopBtn');
  
  if (!scrollTopBtn) {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scrollToTopBtn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .scroll-to-top {
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: linear-gradient(135deg, #d94a31, #e56947);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(217, 74, 49, 0.3);
        transition: all 0.3s ease;
        z-index: 99;
      }

      .scroll-to-top:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(217, 74, 49, 0.4);
      }

      .scroll-to-top.show {
        display: flex;
      }

      @media (max-width: 768px) {
        .scroll-to-top {
          bottom: 80px;
          right: 20px;
          width: 45px;
          height: 45px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ====== Counter Animation ======
function initCounterAnimation() {
  const stats = document.querySelectorAll('.stat-number');
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.hasAttribute('data-counted')) {
        const target = entry.target;
        target.setAttribute('data-counted', 'true');
        animateCounter(target);
      }
    });
  }, observerOptions);

  stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
  const finalValue = parseFloat(element.textContent);
  const duration = 2000;
  const steps = 60;
  const stepValue = finalValue / steps;
  let currentValue = 0;
  let currentStep = 0;

  const timer = setInterval(() => {
    currentValue += stepValue;
    currentStep++;

    if (currentStep >= steps) {
      element.textContent = element.textContent; // Keep original format
      clearInterval(timer);
    } else {
      if (element.textContent.includes('%')) {
        element.textContent = Math.floor(currentValue) + '%+';
      } else if (element.textContent.includes('+')) {
        element.textContent = Math.floor(currentValue) + '+';
      } else {
        element.textContent = Math.floor(currentValue) + '+';
      }
    }
  }, duration / steps);
}

// ====== Performance Observer ======
function initPerformanceMonitoring() {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log(`${entry.name}: ${entry.duration}ms`);
        });
      });

      observer.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
    } catch (e) {
      console.log('Performance monitoring not available');
    }
  }
}

// ====== Lazy Loading Enhancement ======
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src || img.getAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ====== Initialize All Functions ======
document.addEventListener('DOMContentLoaded', function () {
  console.log('Picasso Academy Website - Initializing...');

  // Initialize all modules
  initFadeUpClass();
  initMobileNav();
  initSmoothScroll();
  initScrollAnimations();
  initNavbarScroll();
  initContactForm();
  initEnrollModal();
  initParallaxScroll();
  initTestimonials();
  initGalleryEffects();
  initScrollToTopButton();
  initCounterAnimation();
  initLazyLoading();

  console.log('Picasso Academy Website - Ready! ✓');
});

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden
    console.log('Page hidden');
  } else {
    // Page is visible
    console.log('Page visible');
  }
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
  // Reinitialize mobile nav if window size changes
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  
  if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('show')) {
    navLinks.classList.remove('show');
    hamburger.classList.remove('show');
  }
}, { passive: true });

// Prevent memory leaks
window.addEventListener('beforeunload', () => {
  document.removeEventListener('DOMContentLoaded', function() {});
});

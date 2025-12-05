// ====== Mobile Navigation ======
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('show');
    hamburger.classList.toggle('show', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      hamburger.classList.remove('show');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

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
      if (href === '#' || !href) return;

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

// ====== Scroll Animations ======
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up, .section, .program-card, .service-card, .blog-card, .testimonial-card, .mission-card').forEach(el => {
    observer.observe(el);
  });
}

// ====== Navbar Scroll Effect ======
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 100 ? 'var(--shadow-md)' : 'var(--shadow-sm)';
  }, { passive: true });
}

// ====== Form Validation Helper ======
function validateForm(form) {
  let isValid = true;
  const fields = form.querySelectorAll('[required]');

  fields.forEach(field => {
    const errorContainer = field.parentElement.querySelector('.error-msg');
    field.classList.remove('error');
    field.parentElement.classList.remove('error');

    if (field.value.trim() === '') {
      isValid = false;
      field.parentElement.classList.add('error');
      if (errorContainer) errorContainer.textContent = 'Este campo es obligatorio';
    } else if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        isValid = false;
        field.parentElement.classList.add('error');
        if (errorContainer) errorContainer.textContent = 'Correo electrónico inválido';
      }
    } else if (field.type === 'tel') {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (field.value.trim() && !phoneRegex.test(field.value.trim())) {
        isValid = false;
        field.parentElement.classList.add('error');
        if (errorContainer) errorContainer.textContent = 'Número de teléfono inválido';
      }
    }
  });

  return isValid;
}

// ====== ✅ Contact Form Handler — FIXED FOR FORMSPREE ======
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  if (!contactForm) return;

  // Real-time validation
  contactForm.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('blur', () => {
      validateForm(contactForm);
    });
  });

  // Submit handler — allow native submission if valid
  contactForm.addEventListener('submit', function (e) {
    const isValid = validateForm(this);

    if (!isValid) {
      e.preventDefault(); // Prevent only if invalid
      formMsg.textContent = 'Por favor, corrija los errores e inténtelo de nuevo.';
      formMsg.className = 'form-msg error';
      return;
    }

    // If valid: DO NOT prevent default → Formspree will receive the data
    // Optional: show sending message briefly (but don't block submission)
    formMsg.textContent = 'Enviando su mensaje...';
    formMsg.className = 'form-msg';
  });
}

// ====== Enrollment Modal ======
function initEnrollModal() {
  const enrollButtons = document.querySelectorAll('[data-enroll]');
  const modal = document.getElementById('enrollModal');
  if (!modal || enrollButtons.length === 0) return;

  const modalClose = document.getElementById('modalClose');
  const modalCancel = document.getElementById('modalCancel');
  const modalOverlay = document.getElementById('modalOverlay');
  const enrollForm = document.getElementById('enrollForm');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const enrollProgram = document.getElementById('enrollProgram');

  const programDetails = {
    'prep-year': {
      title: 'Año Preparatorio para Estudiar en España',
      desc: 'Preparación académica y lingüística completa para tener éxito en la educación superior en España, con apoyo en la documentación de la visa y orientación en la solicitud universitaria.'
    },
    'prep-in-spain': {
      title: 'Programas Inmersivos en España',
      desc: 'Estancias cortas en escuelas asociadas en España para acelerar la adquisición del idioma.'
    },
    'comm-tourism': {
      title: 'Comunicación en Español y Turismo Lingüístico',
      desc: 'Clases prácticas centradas en el español hablado, situaciones reales y turismo lingüístico.'
    },
    'camps': {
      title: 'Campamentos de Idiomas en España',
      desc: 'Campamentos culturales que combinan clases, excursiones y alojamiento en familias.'
    },
    'exams': {
      title: 'Preparación para Exámenes (DELE, SIELE, CCSE)',
      desc: 'Entrenamiento estructurado orientado a exámenes con exámenes anteriores, simulacros y retroalimentación personalizada.'
    }
  };

  function openModal(key) {
    const prog = programDetails[key] || programDetails['exams'];
    if (modalTitle) modalTitle.textContent = prog.title;
    if (modalDesc) modalDesc.textContent = prog.desc;
    if (enrollProgram) enrollProgram.value = key;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (enrollForm) enrollForm.reset();
  }

  enrollButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      openModal(e.currentTarget.dataset.enroll);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalCancel) modalCancel.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  if (enrollForm) {
    enrollForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm(this)) {
        alert('¡Gracias por su interés! Nos pondremos en contacto con usted pronto.');
        closeModal();
      } else {
        alert('Por favor, complete todos los campos correctamente.');
      }
    });

    enrollForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('blur', () => validateForm(enrollForm));
    });
  }
}

// ====== Parallax, Testimonials, Gallery, etc. (kept minimal for brevity) ======
function initParallaxScroll() {
  const hero = document.querySelector('.hero[data-parallax="true"]');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    hero.style.backgroundPosition = `center ${scrollY * 0.3}px`;
  }, { passive: true });
}

function initScrollToTopButton() {
  let btn = document.getElementById('scrollToTopBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'scrollToTopBtn';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'scroll-to-top';
    btn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(btn);

    const style = document.createElement('style');
    style.textContent = `
      .scroll-to-top {
        position: fixed; bottom: 100px; right: 30px;
        width: 50px; height: 50px; border-radius: 50%;
        background: #d94a31; color: white; border: none;
        display: none; align-items: center; justify-content: center;
        font-size: 1.2rem; cursor: pointer; z-index: 99;
        box-shadow: 0 4px 12px rgba(217, 74, 49, 0.3);
        transition: all 0.3s ease;
      }
      .scroll-to-top.show { display: flex; }
      .scroll-to-top:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(217, 74, 49, 0.4); }
      @media (max-width: 768px) { .scroll-to-top { bottom: 80px; right: 20px; } }
    `;
    document.head.appendChild(style);
  }

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ====== Initialize All ======
document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initSmoothScroll();
  initScrollAnimations();
  initNavbarScroll();
  initContactForm(); // ✅ This is the corrected one!
  initEnrollModal();
  initParallaxScroll();
  initScrollToTopButton();
});

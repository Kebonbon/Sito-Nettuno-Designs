document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header.site-header');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateHeaderOnScroll() {
    const scrolled = window.scrollY > 10;
    if (header) {
      header.classList.toggle('scrolled', scrolled);
    }
  }
  updateHeaderOnScroll();
  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

  // Active nav highlighting
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile navigation
  const hamburger = document.querySelector('.hamburger');
  const navContainer = document.querySelector('.nav-links');
  if (hamburger && navContainer) {
    function setExpanded(isOpen) {
      hamburger.setAttribute('aria-expanded', String(isOpen));
      navContainer.classList.toggle('open', isOpen);
    }
    hamburger.addEventListener('click', () => {
      const isOpen = !navContainer.classList.contains('open');
      setExpanded(isOpen);
    });
    navLinks.forEach(link => link.addEventListener('click', () => setExpanded(false)));
    document.addEventListener('click', (e) => {
      if (!navContainer.contains(e.target) && !hamburger.contains(e.target)) {
        setExpanded(false);
      }
    });
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Parallax elements
  const parallaxTargets = document.querySelectorAll('[data-parallax]');
  function updateParallax() {
    const y = window.scrollY;
    parallaxTargets.forEach(el => {
      const factorAttr = el.getAttribute('data-parallax');
      const factor = factorAttr ? parseFloat(factorAttr) : 0.2;
      el.style.transform = `translateY(${y * factor}px)`;
    });
  }
  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });

  // Testimonials slider
  const slider = document.querySelector('.testimonials .slider');
  if (slider) {
    const slidesContainer = slider.querySelector('.slides');
    const slides = Array.from(slidesContainer.children);
    const dots = Array.from(slider.parentElement.querySelectorAll('.slider-dot'));
    let index = 0;
    let autoTimer;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      slidesContainer.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, idx) => d.classList.toggle('active', idx === index));
    }

    function next() { goTo(index + 1); }
    function startAuto() { stopAuto(); autoTimer = setInterval(next, 6000); }
    function stopAuto() { if (autoTimer) clearInterval(autoTimer); }

    dots.forEach((dot, idx) => dot.addEventListener('click', () => { goTo(idx); startAuto(); }));
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    goTo(0);
    startAuto();
  }

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const message = String(formData.get('message') || '').trim();

      if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
        alert('Per favore compila tutti i campi e inserisci un email valida.');
        return;
      }

      const subject = encodeURIComponent(`Richiesta preventivo da ${name}`);
      const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:hello@nettunodesigns.dev?subject=${subject}&body=${body}`;
    });
  }
});



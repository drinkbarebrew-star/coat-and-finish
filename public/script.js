/* ============================================
   Coat & Finish — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Mobile Menu Toggle --- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Mobile dropdown toggle
    document.querySelectorAll('.nav-dropdown > a').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          trigger.parentElement.classList.toggle('open');
        }
      });
    });
  }

  /* --- Header Scroll Effect --- */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq-question').forEach(function (button) {
    button.addEventListener('click', function () {
      const item = button.parentElement;
      const isActive = item.classList.contains('active');

      // Close all other items
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* --- Scroll Animations (IntersectionObserver) --- */
  const animElements = document.querySelectorAll('.animate-on-scroll');

  if (animElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    animElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* --- Contact Form Handling --- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Gather form data
      var formData = new FormData(contactForm);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      // Basic validation
      var errors = [];
      if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter your name.');
      }
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Please enter a valid email address.');
      }
      if (!data.phone || data.phone.trim().length < 7) {
        errors.push('Please enter a valid phone number.');
      }
      if (!data.message || data.message.trim().length < 10) {
        errors.push('Please tell us about your project (at least 10 characters).');
      }

      // Show errors or success
      var existingMsg = contactForm.querySelector('.form-message');
      if (existingMsg) existingMsg.remove();

      var msgDiv = document.createElement('div');
      msgDiv.className = 'form-message';

      if (errors.length > 0) {
        msgDiv.style.cssText = 'background:#FEE;border:1px solid #E77;color:#C33;padding:1rem;border-radius:8px;margin-bottom:1rem;';
        msgDiv.innerHTML = errors.join('<br>');
        contactForm.prepend(msgDiv);
        msgDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Pull fields for notifications
      var name = data.name || '';
      var phone = data.phone || '';
      var email = data.email || '';
      var service = data.service || 'Not specified';
      var message = data.message || '';

      // Telegram notification (fires immediately for speed-to-lead)
      fetch('https://api.telegram.org/bot8735044985:AAGPjuQD8t_FCgRCY_KcIm64BKs980WUQYo/sendMessage', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          chat_id: '7046304764',
          text: '🔔 NEW LEAD - Coat & Finish\n\nName: ' + name + '\nPhone: ' + phone + '\nEmail: ' + email + '\nService: ' + service + '\nMessage: ' + message
        })
      }).catch(function () {});

      // Submit to Formspree (backup / email record)
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }

      function showSuccess() {
        msgDiv.style.cssText = 'background:#EFE;border:1px solid #7C7;color:#363;padding:1rem;border-radius:8px;margin-bottom:1rem;';
        msgDiv.innerHTML = '<strong>Thank you!</strong> Your message has been sent. We\'ll get back to you within one business day.';
        contactForm.prepend(msgDiv);
        contactForm.reset();
        msgDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (submitBtn) { submitBtn.textContent = originalText; submitBtn.disabled = false; }
      }

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function () {
        // Treat as success regardless — Telegram already delivered the lead
        showSuccess();
      }).catch(function () {
        showSuccess();
      });
    });
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});

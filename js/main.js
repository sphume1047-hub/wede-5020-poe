document.addEventListener('DOMContentLoaded', function () {
  // Utilities
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function debounce(fn, wait) {
    let t;
    return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); };
  }

  // --- Form validation and submission for forms with class "contact-form" ---
  const forms = qsa('.contact-form');
  const defaultRecipient = 'peakcarpenter538@gmail.com';
  function clearErrors(formEl) {
    qsa('.error-message', formEl).forEach(n => n.remove());
    qsa('.error', formEl).forEach(n => n.classList.remove('error'));
    const notice = qs('.form-notice', formEl);
    if (notice) notice.remove();
  }
  function showError(input, msg) {
    input.classList.add('error');
    const span = document.createElement('div');
    span.className = 'error-message';
    span.textContent = msg;
    input.insertAdjacentElement('afterend', span);
  }
  function showNotice(formEl, msg, ok) {
    const div = document.createElement('div');
    div.className = 'form-notice';
    div.textContent = msg;
    div.style.marginTop = '0.5rem';
    div.style.color = ok ? 'green' : 'crimson';
    formEl.appendChild(div);
  }

  // Small success modal shown on successful submission
  function showSuccessModal(message) {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
      <div class="success-modal-panel" role="dialog" aria-modal="true">
        <button class="success-modal-close" aria-label="Close">×</button>
        <div class="success-modal-body">${message}</div>
      </div>`;
    document.body.appendChild(modal);
    // allow CSS transition
    requestAnimationFrame(() => modal.classList.add('visible'));

    function close() {
      modal.classList.remove('visible');
      setTimeout(() => modal.remove(), 220);
    }
    modal.querySelector('.success-modal-close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
  }

  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      const ajax = form.dataset.ajax === 'true';
      if (ajax) e.preventDefault();
      clearErrors(form);
      const name = qs('#name', form) || qs('input[name="name"]', form);
      const email = qs('#email', form) || qs('input[name="email"]', form);
      const phone = qs('#phone', form) || qs('input[name="phone"]', form);
      const subject = qs('#subject', form) || qs('input[name="subject"]', form) || { value: (document.title || '') };
      const message = qs('#message', form) || qs('textarea[name="message"]', form);
      let ok = true;
      if (name && !name.value.trim()) { showError(name, 'Please enter your name'); ok = false; }
      if (email && (!email.value.trim() || !isEmail(email.value))) { showError(email, 'Please enter a valid email'); ok = false; }
      if (phone && phone.value.trim()) {
        const digits = phone.value.replace(/[^0-9]/g, '');
        if (digits.length < 7) { showError(phone, 'Please enter a valid phone number'); ok = false; }
      }
      if (subject && !subject.value.trim()) { showError(subject, 'Please enter a subject'); ok = false; }
      if (message && (!message.value.trim() || message.value.trim().length < 10)) { showError(message, 'Please enter a longer message (10+ characters)'); ok = false; }
      if (!ok) { if (ajax) return; e.preventDefault(); return; }

      // If not using AJAX, allow the browser to submit the form normally
      if (!ajax) return;

      // If the form has a data-endpoint attribute, try AJAX POST (e.g., Formspree)
      const endpoint = form.dataset.endpoint || form.getAttribute('action');
      const method = (form.getAttribute('method') || 'post').toUpperCase();
      if (endpoint && endpoint !== '#' && endpoint.indexOf('mailto:') !== 0 && method === 'POST') {
        const formData = new FormData(form);
        const btn = form.querySelector('button[type="submit"]');
        if (btn) btn.disabled = true;
        showNotice(form, 'Sending...', true);
        fetch(endpoint, { method: 'POST', body: formData, mode: 'cors' })
          .then(res => {
            if (res.ok) {
              showNotice(form, 'Message sent. Thank you!', true);
              form.reset();
              // If form provided a _next redirect, go there; otherwise show modal
              const nextInput = form.querySelector('input[name="_next"]');
              if (nextInput && nextInput.value) {
                setTimeout(() => { window.location.href = nextInput.value; }, 700);
              } else {
                try { showSuccessModal('Message sent. Thank you — we will reply shortly.'); } catch (e) {}
              }
            } else {
              showNotice(form, 'Submission failed — opening mail client as fallback.', false);
              throw new Error('Network response was not ok');
            }
          })
          .catch(() => {
            // Fallback to mailto if AJAX fails
            const recipient = (form.dataset.recipient || defaultRecipient);
            const mailSubject = encodeURIComponent(subject.value.trim());
            const mailBody = encodeURIComponent(
              (name ? 'Name: ' + name.value.trim() + '\n' : '') +
              (email ? 'Email: ' + email.value.trim() + '\n\n' : '') +
              (message ? message.value.trim() : '')
            );
            window.location.href = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;
          })
          .finally(() => { if (btn) btn.disabled = false; });
      } else {
        // No endpoint provided or non-POST; open mail client
        const recipient = (form.dataset.recipient || defaultRecipient);
        const mailSubject = encodeURIComponent(subject.value.trim());
        const mailBody = encodeURIComponent(
          (name ? 'Name: ' + name.value.trim() + '\n' : '') +
          (email ? 'Email: ' + email.value.trim() + '\n\n' : '') +
          (message ? message.value.trim() : '')
        );
        const mailto = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          const prevText = btn.textContent;
          btn.textContent = 'Opening mail client...';
          try { showSuccessModal('Opening your email client...'); } catch (e) {}
          setTimeout(() => { window.location.href = mailto; btn.textContent = prevText; }, 150);
        } else {
          try { showSuccessModal('Opening your email client...'); } catch (e) {}
          window.location.href = mailto;
        }
      }
    });
  });

  // --- Simple lightbox for .gallery images ---
  // Lazy-load gallery images and create accessible lightbox
  qsa('.gallery img').forEach(img => {
    img.loading = 'lazy';
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'simple-lightbox';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.style.position = 'fixed';
      overlay.style.left = 0;
      overlay.style.top = 0;
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.background = 'rgba(0,0,0,0.85)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = 9999;
      overlay.tabIndex = -1;
      overlay.addEventListener('click', () => overlay.remove());

      const large = document.createElement('img');
      large.src = img.src;
      large.alt = img.alt || '';
      large.style.maxWidth = '95%';
      large.style.maxHeight = '95%';
      large.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
      overlay.appendChild(large);

      document.body.appendChild(overlay);
      overlay.focus();
      window.addEventListener('keyup', function esc(e) { if (e.key === 'Escape') { overlay.remove(); window.removeEventListener('keyup', esc); } });
    });
  });

  // Also lazy-load other images where appropriate
  qsa('img').forEach(img => { if (!img.loading) img.loading = 'lazy'; });

  // --- Smooth scroll for same-page anchors ---
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        const target = qs(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // --- Search/filter helper (for pages with service cards) ---
  qsa('.search-input').forEach(input => {
    const targetSelector = input.dataset.target || '.service-card';
    const items = qsa(targetSelector);
    const run = () => {
      const q = input.value.trim().toLowerCase();
      items.forEach(it => {
        const text = it.textContent.trim().toLowerCase();
        it.style.display = text.indexOf(q) !== -1 ? '' : 'none';
      });
    };
    input.addEventListener('input', debounce(run, 200));
  });

  // --- Scroll to top button ---
  (function () {
    const btn = document.createElement('button');
    btn.className = 'scroll-top';
    btn.type = 'button';
    btn.textContent = '↑';
    btn.title = 'Back to top';
    btn.style.position = 'fixed';
    btn.style.right = '1rem';
    btn.style.bottom = '1.25rem';
    btn.style.padding = '0.5rem 0.75rem';
    btn.style.display = 'none';
    btn.style.zIndex = 9999;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);
    window.addEventListener('scroll', debounce(() => {
      btn.style.display = window.scrollY > 300 ? 'block' : 'none';
    }, 100));
  })();

  // --- Character counter for textareas with data-maxlength ---
  qsa('textarea[data-maxlength]').forEach(textarea => {
    const max = parseInt(textarea.dataset.maxlength, 10) || 1000;
    const span = document.createElement('div');
    span.className = 'char-count';
    span.style.fontSize = '0.9rem';
    span.style.marginTop = '0.25rem';
    textarea.parentNode.insertBefore(span, textarea.nextSibling);
    const update = () => {
      const remaining = max - (textarea.value || '').length;
      span.textContent = `${remaining} characters remaining`;
      if (remaining < 0) span.style.color = 'crimson'; else span.style.color = '';
    };
    textarea.addEventListener('input', update);
    update();
  });

  // --- Auto-resize textareas for better UX ---
  function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    const newHeight = textarea.scrollHeight;
    textarea.style.height = newHeight + 'px';
  }
  qsa('textarea').forEach(t => {
    // Initialize size
    autoResizeTextarea(t);
    // Resize on input
    t.addEventListener('input', () => autoResizeTextarea(t));
    // Also on window resize (layout changes)
    window.addEventListener('resize', () => autoResizeTextarea(t));
  });

  // --- Phone input validation helper ---
  qsa('input[type="tel"]').forEach(phone => {
    phone.addEventListener('input', () => {
      const val = phone.value.replace(/[^0-9+]/g, '');
      phone.value = val;
    });
  });
  // --- Small mobile nav toggle (adds a button when viewport is narrow) ---
  (function setupMobileNav() {
    const navEl = qs('nav');
    if (!navEl) return;
    // create toggle button
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Toggle navigation');
    toggle.innerHTML = '☰';

    toggle.addEventListener('click', () => {
      const isOpen = navEl.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // insert toggle as first child of nav
    navEl.insertBefore(toggle, navEl.firstChild);

    // Close nav when a link is clicked (mobile)
    navEl.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      if (navEl.classList.contains('nav-open')) navEl.classList.remove('nav-open');
    });

    // Ensure nav is reset on resize to avoid stale open state
    window.addEventListener('resize', () => { if (window.innerWidth > 700) navEl.classList.remove('nav-open'); });
  })();

});

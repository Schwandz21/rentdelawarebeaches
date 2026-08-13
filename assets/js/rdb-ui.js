/* ==========================================================================
   RENT DELAWARE BEACHES — SHARED UI BEHAVIOUR (Phase 2)
   --------------------------------------------------------------------------
   Vanilla JS, no dependencies, no build step. Loaded with `defer`.

   Everything here is PROGRESSIVE ENHANCEMENT. With JavaScript disabled:
     - the Service Finder still submits (it is a real <form method="GET">)
     - navigation links are still present and usable
     - form controls fall back to native HTML5 validation

   Modules:
     1. Select "chosen" state
     2. Service Finder (validation + handoff)
     3. Mobile navigation drawer
     4. File upload previews
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. SELECT "CHOSEN" STATE
     Gives a select a visibly different treatment once a real option is
     picked, so a partially completed form shows its own progress.
     ------------------------------------------------------------------ */
  function initSelects(root) {
    /* `.rdb-*` is the Checkpoint A system; `.u-*` is the shared core layer the
       Checkpoint A.1 direction concepts build on. Both are driven from here so
       there is one behaviour implementation, not one per visual direction. */
    var selects = (root || document).querySelectorAll('.rdb-select, .u-select');

    Array.prototype.forEach.call(selects, function (select) {
      var sync = function () {
        select.classList.toggle('is-chosen', select.value !== '');
      };
      select.addEventListener('change', sync);
      sync();
    });
  }

  /* ------------------------------------------------------------------
     2. SERVICE FINDER
     Only the service field is required — the finder exists to reduce
     friction into the request flow, not to qualify leads.
     ------------------------------------------------------------------ */
  function initFinder(form) {
    var controls = form.querySelectorAll('[name="service"]');
    var status   = form.querySelector('.rdb-finder-status, .u-status');
    if (!controls.length) return;

    var first = controls[0];
    /* The service field is a <select> in some directions and a radio group in
       others. Reading `.value` off the first node would return the first
       radio's value whether or not anything is checked, so the group case has
       to be resolved through :checked. */
    var isRadio = first.type === 'radio';

    /* When it is a radio group, the error state belongs on the wrapper — an
       individual radio has no border to colour. */
    var errorTarget = isRadio
      ? (form.querySelector('[data-choice-group]') || first.parentNode)
      : first;

    /* The markup keeps `required` so that with JavaScript disabled the browser
       still blocks an empty submit. Once this script runs we take over: native
       validation would otherwise fire first, swallow the submit event, and
       replace our styled state and aria-live message with a browser bubble. */
    form.noValidate = true;

    function currentValue() {
      if (!isRadio) return first.value;
      var checked = form.querySelector('[name="service"]:checked');
      return checked ? checked.value : '';
    }

    function clearError() {
      errorTarget.classList.remove('is-error');
      first.removeAttribute('aria-invalid');
      if (status) {
        status.textContent = '';
        status.classList.remove('is-ok');
      }
    }

    Array.prototype.forEach.call(controls, function (control) {
      control.addEventListener('change', function () {
        if (currentValue() !== '') clearError();
      });
    });

    form.addEventListener('submit', function (event) {
      if (currentValue() === '') {
        event.preventDefault();
        errorTarget.classList.add('is-error');
        first.setAttribute('aria-invalid', 'true');
        if (status) {
          status.classList.remove('is-ok');
          status.textContent =
            "Choose what you need help with — or pick “Something else”.";
        }
        first.focus();
        return;
      }

      clearError();

      /* Production: hand the request off to the visitor's mail client with the
         job details already filled in. There is no server behind this site, so
         email is the one route that genuinely reaches the business — we open it
         rather than showing a confirmation the site cannot actually honour. */
      if (form.hasAttribute('data-mailto')) {
        event.preventDefault();

        var label = function (select) {
          if (!select || select.value === '') return 'Not specified';
          return select.options[select.selectedIndex].text;
        };

        var area = form.querySelector('[name="area"]');
        var freq = form.querySelector('[name="frequency"]');
        var serviceText = isRadio
          ? label(form.querySelector('[name="service"]:checked'))
          : label(first);

        var subject = 'Property help request — ' + serviceText;
        var body = [
          'Hi Rent Delaware Beaches,',
          '',
          "I'd like to ask about a job at my property.",
          '',
          'What I need: ' + serviceText,
          'Property area: ' + label(area),
          'How often: ' + label(freq),
          '',
          'About the job:',
          '(please describe the job here — photos are helpful too)',
          '',
          'Name:',
          'Best way to reach me:',
          ''
        ].join('\r\n');

        window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);

        if (status) {
          status.classList.add('is-ok');
          status.textContent =
            'Opening your email with the details filled in — add a note about the job and send it.';
        }
        return;
      }

      /* Preview pages carry data-preview so the earlier design-direction
         prototypes can demonstrate the interaction without a destination. */
      if (form.hasAttribute('data-preview')) {
        event.preventDefault();
        if (status) {
          var params = new URLSearchParams(new FormData(form)).toString();
          status.classList.add('is-ok');
          status.textContent = 'Preview only — would open: request.html?' + params;
        }
      }
    });
  }

  /* ------------------------------------------------------------------
     3. MOBILE NAVIGATION DRAWER
     Full-screen overlay. Traps focus, closes on Escape, restores focus,
     and locks background scroll.
     ------------------------------------------------------------------ */
  function initDrawer(toggle) {
    var drawer = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!drawer) return;

    var closers = drawer.querySelectorAll('[data-drawer-close]');
    var lastFocused = null;

    function focusable() {
      return drawer.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    }

    function open() {
      lastFocused = document.activeElement;
      drawer.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var items = focusable();
      if (items.length) items[0].focus();
      document.addEventListener('keydown', onKeydown);
    }

    function close() {
      drawer.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);

      /* Return focus where it came from. If the drawer was opened without a
         focused opener (e.g. programmatically), fall back to the toggle so
         focus is never dropped on <body>. */
      var target = (lastFocused && lastFocused !== document.body &&
                    document.contains(lastFocused)) ? lastFocused : toggle;
      target.focus();
    }

    function onKeydown(event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      var items = focusable();
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    toggle.addEventListener('click', function () {
      if (drawer.classList.contains('is-open')) close();
      else open();
    });

    Array.prototype.forEach.call(closers, function (el) {
      el.addEventListener('click', close);
    });
  }

  /* ------------------------------------------------------------------
     4. FILE UPLOAD PREVIEWS
     Client-side thumbnails only. Nothing is uploaded anywhere — there is
     no backend in this phase by design.
     ------------------------------------------------------------------ */
  function initUpload(input) {
    var list = document.getElementById(input.getAttribute('data-thumbs'));
    if (!list) return;

    input.addEventListener('change', function () {
      list.innerHTML = '';

      Array.prototype.forEach.call(input.files, function (file) {
        if (file.type.indexOf('image/') !== 0) return;

        var wrap = document.createElement('div');
        wrap.className = 'rdb-thumb';

        var img = document.createElement('img');
        img.alt = file.name;
        img.src = URL.createObjectURL(file);
        img.addEventListener('load', function () {
          URL.revokeObjectURL(img.src);
        });

        wrap.appendChild(img);
        list.appendChild(wrap);
      });
    });
  }

  /* ------------------------------------------------------------------
     BOOTSTRAP
     ------------------------------------------------------------------ */
  function init() {
    initSelects(document);

    Array.prototype.forEach.call(
      document.querySelectorAll('[data-finder]'),
      initFinder
    );
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-drawer-toggle]'),
      initDrawer
    );
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-thumbs]'),
      initUpload
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

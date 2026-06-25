(function () {

  /* ══════════════════════════════════════════
     1. REVEAL ON SCROLL (original, mantido)
  ══════════════════════════════════════════ */
  const reveals = document.querySelectorAll('[data-reveal]');
  const thread  = document.getElementById('thread');
  const ruptures = document.querySelectorAll('.rupture');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -6% 0px' });

  reveals.forEach(el => obs.observe(el));

  const bgObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.body.style.background = 'var(--dusk)';
        thread.classList.add('warm');
      } else {
        document.body.style.background = 'var(--night)';
        thread.classList.remove('warm');
      }
    });
  }, { threshold: 0.15 });

  ruptures.forEach(el => bgObs.observe(el));


  /* ══════════════════════════════════════════
     2. BARRA DE PROGRESSO DE LEITURA
  ══════════════════════════════════════════ */
  const progressBar = document.createElement('div');
  progressBar.id = 'read-progress';
  Object.assign(progressBar.style, {
    position:      'fixed',
    top:           '0',
    left:          '0',
    height:        '2px',
    width:         '0%',
    background:    'var(--lantern, #d9b87c)',
    zIndex:        '9999',
    transition:    'width 0.1s linear',
    pointerEvents: 'none',
  });
  document.body.appendChild(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct       = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });


  /* ══════════════════════════════════════════
     3. EFEITO DE DIGITAÇÃO NA TAGLINE DA CAPA
  ══════════════════════════════════════════ */
  const tagline = document.querySelector('.cover-tagline p');
  if (tagline) {
    const originalText = tagline.textContent;
    tagline.textContent = '';
    tagline.style.visibility = 'visible';

    let i = 0;
    function typeChar() {
      if (i < originalText.length) {
        tagline.textContent += originalText[i++];
        setTimeout(typeChar, 55 + Math.random() * 35);
      }
    }
    setTimeout(typeChar, 1200);
  }


  /* ══════════════════════════════════════════
     4. PARALLAX SUAVE NO THREAD (fio lateral)
  ══════════════════════════════════════════ */
  if (thread) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const offset = window.scrollY * 0.08;
          thread.style.transform = `translateY(${offset}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  /* ══════════════════════════════════════════
     5. PARTÍCULAS DE BRASA NO HOVER DE .ember
  ══════════════════════════════════════════ */
  const embers = document.querySelectorAll('.ember');

  function spawnParticle(x, y) {
    const p     = document.createElement('span');
    const size  = 3 + Math.random() * 4;
    const angle = Math.random() * Math.PI * 2;
    const dist  = 20 + Math.random() * 30;
    const dx    = Math.cos(angle) * dist;
    const dy    = Math.sin(angle) * dist - 20;

    Object.assign(p.style, {
      position:      'fixed',
      left:          x + 'px',
      top:           y + 'px',
      width:         size + 'px',
      height:        size + 'px',
      borderRadius:  '50%',
      background:    `hsl(${25 + Math.random() * 20}, 90%, ${55 + Math.random() * 20}%)`,
      pointerEvents: 'none',
      zIndex:        '9998',
      opacity:       '1',
      transition:    'transform 0.7s ease-out, opacity 0.7s ease-out',
      transform:     'translate(0,0) scale(1)',
    });
    document.body.appendChild(p);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        p.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
        p.style.opacity   = '0';
      });
    });

    setTimeout(() => p.remove(), 750);
  }

  embers.forEach(el => {
    let interval = null;
    el.addEventListener('mouseenter', () => {
      interval = setInterval(() => {
        const rect = el.getBoundingClientRect();
        const x    = rect.left + Math.random() * rect.width;
        const y    = rect.top  + Math.random() * rect.height;
        spawnParticle(x, y);
      }, 80);
    });
    el.addEventListener('mouseleave', () => clearInterval(interval));
  });


  /* ══════════════════════════════════════════
     6. EFEITO "RESPIRO" NOS DIÁLOGOS
        — pulso de escala ao entrar na tela
  ══════════════════════════════════════════ */
  const dialogues = document.querySelectorAll('.dialogue[data-reveal]');

  const breathObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animationName = '_breathe-in';
        breathObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  if (!document.getElementById('_breathe-style')) {
    const style = document.createElement('style');
    style.id = '_breathe-style';
    style.textContent = `
      @keyframes _breathe-in {
        0%   { transform: scale(0.97); opacity: 0; }
        60%  { transform: scale(1.015); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      .dialogue[data-reveal].visible {
        animation-duration: 0.55s;
        animation-timing-function: ease-out;
        animation-fill-mode: both;
      }
    `;
    document.head.appendChild(style);
  }

  dialogues.forEach(el => breathObs.observe(el));


  /* ══════════════════════════════════════════
     7. FADE SUAVE NOS PARÁGRAFOS CURTOS
        — parágrafos curtos recebem transição
          ligeiramente mais lenta para destacar
          o ritmo fragmentado da prosa,
          sem quebrar o layout
  ══════════════════════════════════════════ */
  reveals.forEach(el => {
    if (el.tagName !== 'P') return;
    if (el.classList.contains('dialogue')) return;
    const words = el.textContent.trim().split(/\s+/);
    if (words.length > 4) return;
    el.style.transition = 'opacity 1.3s ease 0.1s, transform 1.3s ease 0.1s';
  });


  /* ══════════════════════════════════════════
     8. DICA DE SCROLL — fade out ao rolar
  ══════════════════════════════════════════ */
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      const opacity = Math.max(0, 1 - window.scrollY / 120);
      scrollHint.style.opacity      = opacity;
      scrollHint.style.pointerEvents = opacity < 0.05 ? 'none' : '';
    }, { passive: true });
  }

})();

/* ══ SPLASH SCREEN ══ */
(function () {
  const splash = document.getElementById('splash');
  if (!splash) return;

  // Bloqueia scroll enquanto o splash está visível
  document.body.style.overflow = 'hidden';

  // Após 2.8s some o splash e libera o scroll
  setTimeout(() => {
    splash.classList.add('hide');
    document.body.style.overflow = '';
  }, 2800);
})();

let lastChapter = null;

const chapters = document.querySelectorAll('h2, .chapter-title');

const chapterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      lastChapter = e.target.id || e.target.innerText;
      localStorage.setItem('lastChapter', lastChapter);
    }
  });
}, { threshold: 0.6 });

chapters.forEach(c => chapterObserver.observe(c));

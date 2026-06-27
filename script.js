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

  /* ══════════════════════════════════════════
     9. SCROLL SUAVE EM ÂNCORAS
  ══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

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

/* ══ MODO ESCURO / CLARO ══ */
(function() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const STORAGE_KEY = 'theme-preference';
  const DARK_CLASS = 'theme-dark';
  const LIGHT_CLASS = 'theme-light';

  // Inicializa o tema
  function setTheme(theme) {
    document.body.classList.remove(DARK_CLASS, LIGHT_CLASS);
    if (theme === 'light') {
      document.body.classList.add(LIGHT_CLASS);
      toggle.textContent = '☀️';
    } else {
      document.body.classList.add(DARK_CLASS);
      toggle.textContent = '🌙';
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Carrega preferência
  function loadTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTheme(saved);
      return;
    }
    // Preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  // Alterna
  toggle.addEventListener('click', () => {
    const current = document.body.classList.contains(LIGHT_CLASS) ? 'light' : 'dark';
    setTheme(current === 'light' ? 'dark' : 'light');
  });

  // Ouvir mudanças no sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  loadTheme();
})();

/* ══ MENU DE CAPÍTULOS ══ */
(function() {
  const toggleBtn = document.getElementById('chapters-toggle');
  const menu = document.getElementById('chapters-menu');
  const closeBtn = document.getElementById('chapters-close');
  const list = document.getElementById('chapters-list');
  if (!toggleBtn || !menu || !list) return;

  // Coleta todos os capítulos
  const chapters = document.querySelectorAll('.chapter-title');
  if (!chapters.length) return;

// Gera itens do menu
chapters.forEach((h2, index) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  
  // Nome do capítulo
  let title = h2.textContent.trim();
  
  // Verifica se existe um badge POV nos próximos elementos
  let pov = '';
  let sibling = h2.nextElementSibling;
  let found = false;
  for (let i = 0; i < 3 && sibling && !found; i++) {
    if (sibling.classList && sibling.classList.contains('pov-badge')) {
      pov = sibling.textContent.trim().replace('ponto de vista — ', '');
      found = true;
    }
    sibling = sibling.nextElementSibling;
  }
  
  if (pov) {
    a.textContent = `${title} (${pov})`;
  } else {
    a.textContent = title;
  }
  
  a.href = `#cap-${index}`;
  a.dataset.index = index;
  a.addEventListener('click', (e) => {
    e.preventDefault();
    h2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMenu();
  });
  li.appendChild(a);
  list.appendChild(li);
});

  // Abre/fecha menu
  function openMenu() {
    menu.classList.add('open');
    // backdrop apenas no mobile
    if (window.innerWidth <= 768) {
      let backdrop = document.querySelector('.menu-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'menu-backdrop';
        document.body.appendChild(backdrop);
        backdrop.addEventListener('click', closeMenu);
      }
      backdrop.classList.add('visible');
    }
  }

  function closeMenu() {
    menu.classList.remove('open');
    const backdrop = document.querySelector('.menu-backdrop');
    if (backdrop) backdrop.classList.remove('visible');
  }

  toggleBtn.addEventListener('click', () => {
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  });
  closeBtn.addEventListener('click', closeMenu);

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Destacar capítulo ativo com IntersectionObserver
  const chapterLinks = list.querySelectorAll('a');
  const chapterTitles = chapters;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(chapterTitles).indexOf(entry.target);
        chapterLinks.forEach(link => link.classList.remove('active'));
        const activeLink = list.querySelector(`a[data-index="${idx}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  chapterTitles.forEach(h2 => obs.observe(h2));

  // Ajustar backdrop no resize
  window.addEventListener('resize', () => {
    const backdrop = document.querySelector('.menu-backdrop');
    if (backdrop && window.innerWidth > 768) {
      backdrop.classList.remove('visible');
    }
    if (menu.classList.contains('open') && window.innerWidth <= 768) {
      // garantir backdrop
      if (!backdrop) {
        const newBackdrop = document.createElement('div');
        newBackdrop.className = 'menu-backdrop';
        document.body.appendChild(newBackdrop);
        newBackdrop.addEventListener('click', closeMenu);
        newBackdrop.classList.add('visible');
      }
    }
  });

  // Fechar menu ao rolar no mobile? (opcional)
})();

/* ══ NAVEGAÇÃO ENTRE CAPÍTULOS E VOLUMES ══ */
(function() {
  const chapters = document.querySelectorAll('.chapter-title');
  if (!chapters.length) return;

  // Detectar volume atual usando o atributo content
  const meta = document.querySelector('meta[name="volume"]');
  const currentVolume = meta ? parseInt(meta.content) || 1 : 1;

  function getVolumePath(volumeNum) {
    if (volumeNum === 1) return 'index.html';
    return `arco${volumeNum}.html`;
  }

  // Para cada capítulo, injetar navegação após seu conteúdo
  chapters.forEach((h2, index) => {
    const nav = document.createElement('div');
    nav.className = 'chapter-nav';
    nav.dataset.index = index;

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Capítulo anterior';
    prevBtn.disabled = index === 0;
    prevBtn.addEventListener('click', () => {
      if (index === 0 && currentVolume > 1) {
        // Capítulo anterior está no volume anterior (último capítulo)
        window.location.href = getVolumePath(currentVolume - 1);
      } else if (index > 0) {
        goTo(index - 1);
      }
    });

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Próximo capítulo →';
    nextBtn.disabled = index === chapters.length - 1;
    nextBtn.addEventListener('click', () => {
      if (index === chapters.length - 1) {
        // Último capítulo → próximo volume
        window.location.href = getVolumePath(currentVolume + 1);
      } else {
        goTo(index + 1);
      }
    });

    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);

    // Inserir após o conteúdo do capítulo
    let nextSibling = h2.nextElementSibling;
    while (nextSibling && !nextSibling.matches('.chapter-title')) {
      nextSibling = nextSibling.nextElementSibling;
    }
    const main = document.querySelector('main');
    if (nextSibling && nextSibling.matches('.chapter-title')) {
      main.insertBefore(nav, nextSibling);
    } else {
      const footer = document.querySelector('footer');
      if (footer) main.insertBefore(nav, footer);
      else main.appendChild(nav);
    }

    setTimeout(() => nav.classList.add('visible'), 100);
  });

  function goTo(index) {
    if (index < 0 || index >= chapters.length) return;
    const target = chapters[index];
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
})();

/* ══ SALVAR PROGRESSO DE LEITURA ══ */
(function() {
  const STORAGE_KEY = 'reading-progress';
  const modal = document.getElementById('continue-modal');
  const continueYes = document.getElementById('continue-yes');
  const continueNo = document.getElementById('continue-no');

  if (!modal) return;

  // Detectar volume atual
  const meta = document.querySelector('meta[name="volume"]');
  const currentVolume = meta ? parseInt(meta.content) || 1 : 1;

  let isRestoring = false;

  function getCurrentChapter() {
    const chapters = document.querySelectorAll('.chapter-title');
    let activeIndex = 0;
    chapters.forEach((h2, idx) => {
      const rect = h2.getBoundingClientRect();
      if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
        activeIndex = idx;
      }
    });
    return activeIndex;
  }

  function saveProgress() {
    if (isRestoring) return;
    const chapterIndex = getCurrentChapter();
    const scrollY = window.scrollY;
    const data = {
      volume: currentVolume,
      chapterIndex,
      scrollY,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  let saveTimeout;
  function scheduleSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveProgress, 500);
  }

  window.addEventListener('scroll', scheduleSave, { passive: true });
  window.addEventListener('resize', scheduleSave, { passive: true });

  function restoreProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      if (Date.now() - data.timestamp > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      // Só restaura se o volume salvo for o mesmo que o atual
      if (data.volume !== currentVolume) {
        return;
      }
      modal.classList.add('open');
      continueYes.addEventListener('click', () => {
        modal.classList.remove('open');
        isRestoring = true;
        const chapters = document.querySelectorAll('.chapter-title');
        if (data.chapterIndex < chapters.length) {
          chapters[data.chapterIndex].scrollIntoView({ block: 'start' });
          setTimeout(() => {
            window.scrollTo(0, data.scrollY);
            isRestoring = false;
          }, 200);
        } else {
          chapters[chapters.length - 1].scrollIntoView({ block: 'start' });
          isRestoring = false;
        }
      }, { once: true });

      continueNo.addEventListener('click', () => {
        modal.classList.remove('open');
        localStorage.removeItem(STORAGE_KEY);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, { once: true });
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreProgress);
  } else {
    restoreProgress();
  }
})();

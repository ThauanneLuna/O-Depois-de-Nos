// ─────────────────────────────────────────────
// VASCONCELOS GROUP — vg.js
// SPA, Tema, Carrossel, Quiz, Crachá, Animações
// ─────────────────────────────────────────────

(function() {
    'use strict';

    // ─── DOM REFS ───────────────────────────
    const html = document.documentElement;
    const toggle = document.getElementById('theme-toggle');
    const hamburger = document.getElementById('hamburger');
    const navOverlay = document.getElementById('navOverlay');
    const navMobile = document.getElementById('navMobile');
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('[data-page]');
    const fadeEls = document.querySelectorAll('.fade-in');

    // ─── TEMA ───────────────────────────────
    const saved = localStorage.getItem('vg-theme');
    if (saved === 'light') html.classList.add('light');
    toggle.addEventListener('click', () => {
        html.classList.toggle('light');
        localStorage.setItem('vg-theme', html.classList.contains('light') ? 'light' : 'dark');
    });

    // ─── SPA NAVEGAÇÃO ──────────────────────
    function navigate(pageId) {
        pages.forEach(p => p.classList.remove('active'));
        const target = document.getElementById('page-' + pageId);
        if (target) target.classList.add('active');
        // Fecha mobile
        closeMobile();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const page = el.dataset.page;
            if (page) navigate(page);
        });
    });

    // ─── MOBILE MENU ─────────────────────────
    function openMobile() {
        navMobile.classList.add('open');
        navOverlay.classList.add('open');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobile() {
        navMobile.classList.remove('open');
        navOverlay.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (navMobile.classList.contains('open')) {
            closeMobile();
        } else {
            openMobile();
        }
    });

    navOverlay.addEventListener('click', closeMobile);

    // Fecha mobile ao clicar em link
    document.querySelectorAll('.nav-mobile a').forEach(a => {
        a.addEventListener('click', () => {
            const page = a.dataset.page;
            if (page) navigate(page);
        });
    });

    // ─── FADE IN OBSERVER ────────────────────
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: .12 });
    fadeEls.forEach(el => obs.observe(el));

    // ─── ANIMAÇÃO DE CONTADORES ──────────────
    function animateCounters() {
        const counters = document.querySelectorAll('.num-n[data-count]');
        counters.forEach(el => {
            const target = parseInt(el.dataset.count);
            const suffix = el.innerHTML.includes('sup') ? el.querySelector('sup')?.outerHTML || '' : '';
            let current = 0;
            const step = Math.ceil(target / 40);
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                el.innerHTML = current + suffix;
            }, 30);
        });
    }

    // Dispara contadores quando a seção ficar visível
    const numSection = document.querySelector('.numbers-section');
    if (numSection) {
        const numObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    animateCounters();
                    numObs.unobserve(e.target);
                }
            });
        }, { threshold: .3 });
        numObs.observe(numSection);
    }

    // ─── CARROSSEL ───────────────────────────
    const carrosselData = [
        { name: 'Henrique Vasconcelos', role: 'Presidente do Conselho', dept: 'Diretoria', initials: 'HV' },
        { name: 'Noah Vasconcelos', role: 'CEO', dept: 'Diretoria', initials: 'NV' },
        { name: 'Sofia Mendes', role: 'Coordenadora de Projetos', dept: 'Projetos', initials: 'SM' },
        { name: 'Marcus Oliveira', role: 'Gerente de Logística', dept: 'Logística', initials: 'MO' },
        { name: 'Priya Sharma', role: 'Analista de Marketing', dept: 'Marketing', initials: 'PS' },
        { name: 'Felix Moreira', role: 'Designer UI/UX', dept: 'Design', initials: 'FM' },
        { name: 'Sara Costa', role: 'Analista de Branding', dept: 'Branding', initials: 'SC' },
        { name: 'Luna Carvalho', role: 'Fotógrafa Corporativa', dept: 'Parceiros', initials: 'LC' },
    ];

    const track = document.getElementById('carrosselTrack');
    let carrosselIndex = 0;
    let cardsPerView = 3;

    function renderCarrossel() {
        if (!track) return;
        const start = carrosselIndex;
        const end = start + cardsPerView;
        const visible = carrosselData.slice(start, end);
        track.innerHTML = visible.map(p => `
            <div class="carrossel-card">
                <div class="avatar">${p.initials}</div>
                <h4>${p.name}</h4>
                <div class="role">${p.role}</div>
                <div class="dept">${p.dept}</div>
            </div>
        `).join('');
    }

    function updateCardsPerView() {
        if (window.innerWidth < 600) cardsPerView = 1;
        else if (window.innerWidth < 900) cardsPerView = 2;
        else cardsPerView = 3;
        // Ajusta índice para não ultrapassar
        if (carrosselIndex + cardsPerView > carrosselData.length) {
            carrosselIndex = Math.max(0, carrosselData.length - cardsPerView);
        }
        renderCarrossel();
    }

    if (track) {
        updateCardsPerView();
        window.addEventListener('resize', updateCardsPerView);

        document.getElementById('carrosselPrev')?.addEventListener('click', () => {
            carrosselIndex = Math.max(0, carrosselIndex - 1);
            if (carrosselIndex + cardsPerView > carrosselData.length) {
                carrosselIndex = Math.max(0, carrosselData.length - cardsPerView);
            }
            renderCarrossel();
        });

        document.getElementById('carrosselNext')?.addEventListener('click', () => {
            carrosselIndex = Math.min(carrosselData.length - cardsPerView, carrosselIndex + 1);
            renderCarrossel();
        });
    }

    // ─── FUNCIONÁRIOS (Página) ──────────────
    const funcionarios = [
        { name: 'Henrique Vasconcelos', role: 'Presidente do Conselho', dept: 'Diretoria', bio: 'Fundador da Vasconcelos Group. Pai de Noah. Possui poder de veto e representa a tradição e o legado da holding.', tag: 'Fundador' },
        { name: 'Noah Vasconcelos', role: 'CEO', dept: 'Diretoria', bio: 'Assumiu a gestão executiva em 2024. Responsável pela estratégia e operações do grupo.', tag: 'Liderança' },
        { name: 'Sofia Mendes', role: 'Coordenadora de Projetos', dept: 'Projetos', bio: 'Gerencia projetos de alto impacto, garantindo alinhamento entre equipes e entregas.', tag: 'Gestão' },
        { name: 'Marcus Oliveira', role: 'Gerente de Logística', dept: 'Logística', bio: '35 anos. Especialista em otimização de cadeias de suprimento e operações complexas.', tag: 'Operações' },
        { name: 'Priya Sharma', role: 'Analista de Marketing', dept: 'Marketing', bio: '25 anos. Estrategista de marketing digital e posicionamento de marca.', tag: 'Estratégia' },
        { name: 'Felix Moreira', role: 'Designer UI/UX', dept: 'Design', bio: '24 anos. Cria experiências digitais que combinam estética e funcionalidade.', tag: 'Criatividade' },
        { name: 'Sara Costa', role: 'Analista de Branding', dept: 'Branding', bio: '28 anos. Constrói narrativas de marca e identidade visual para o grupo.', tag: 'Branding' },
        { name: 'Luna Carvalho', role: 'Fotógrafa Corporativa', dept: 'Parceiros', bio: '24 anos. Profissional parceira, contratada para campanhas e eventos institucionais.', tag: 'Parceira' },
    ];

    const grid = document.getElementById('funcionariosGrid');
    const searchInput = document.getElementById('funcSearch');
    const filterSelect = document.getElementById('funcFilter');

    function renderFuncionarios(search = '', filter = 'todos') {
        if (!grid) return;
        const filtered = funcionarios.filter(f => {
            const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                f.role.toLowerCase().includes(search.toLowerCase()) ||
                f.dept.toLowerCase().includes(search.toLowerCase());
            const matchFilter = filter === 'todos' || f.dept === filter;
            return matchSearch && matchFilter;
        });
        grid.innerHTML = filtered.map(f => `
            <div class="func-card">
                <div class="avatar">${f.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                <h4>${f.name}</h4>
                <div class="role">${f.role}</div>
                <div class="dept">${f.dept}</div>
                <div class="bio">${f.bio}</div>
                <span class="tag">${f.tag}</span>
            </div>
        `).join('') || '<p style="color:var(--fg3);text-align:center;padding:40px 0">Nenhum colaborador encontrado.</p>';
    }

    if (grid) {
        renderFuncionarios();
        searchInput?.addEventListener('input', () => {
            renderFuncionarios(searchInput.value, filterSelect?.value || 'todos');
        });
        filterSelect?.addEventListener('change', () => {
            renderFuncionarios(searchInput?.value || '', filterSelect.value);
        });
    }

    // ─── QUIZ ────────────────────────────────
    const qResults = {
        estrategia: {
            cat: 'Estratégia e <em>Liderança</em>',
            sub: 'Vertical Executiva — Vasconcelos Group',
            desc: 'Você opera no campo das decisões que moldam o futuro. Sua clareza estratégica e capacidade de pensar em sistemas — não em eventos isolados — fazem de você alguém raro dentro de qualquer estrutura corporativa. No ecossistema Vasconcelos, você pertenceria ao núcleo que define direções, conduz lideranças e sustenta a visão de longo prazo.',
            role: 'Liderança · Planejamento · Governança',
            dept: 'Estratégia Corporativa',
            cargo: 'Analista Estratégico Sênior'
        },
        inovacao: {
            cat: 'Inovação e <em>Desenvolvimento</em>',
            sub: 'Vertical P&D — Vasconcelos Group',
            desc: 'Você enxerga possibilidades onde outros enxergam obstáculos. Sua capacidade criativa e mente exploratória são ativos estratégicos — não apenas habilidades. Dentro do ecossistema Vasconcelos, você estaria na fronteira da inovação: prototipando, testando, descobrindo o que ainda não existe e criando o que vai existir.',
            role: 'Criação · Inovação · Prototipagem',
            dept: 'Pesquisa & Desenvolvimento',
            cargo: 'Especialista em Inovação'
        },
        operacoes: {
            cat: 'Operações e <em>Execução</em>',
            sub: 'Vertical OPS — Vasconcelos Group',
            desc: 'Você é a razão pela qual as coisas acontecem de fato. Enquanto outros planejam e criam, você executa — com precisão, consistência e zero tolerância para imprecisões desnecessárias. No ecossistema Vasconcelos, você seria a espinha dorsal operacional: o profissional que transforma estratégia em realidade.',
            role: 'Execução · Logística · Gestão de Projetos',
            dept: 'Operações & Logística',
            cargo: 'Analista de Operações'
        },
        branding: {
            cat: 'Comunicação e <em>Branding</em>',
            sub: 'Vertical MKT — Vasconcelos Group',
            desc: 'Você entende que a percepção é parte da realidade. Sua habilidade de construir narrativas, posicionar marcas e comunicar com precisão cirúrgica é o que separa empresas que existem de empresas que são lembradas. No ecossistema Vasconcelos, você cuida da interface entre o grupo e o mundo.',
            role: 'Branding · Comunicação · Posicionamento',
            dept: 'Marketing & Criação',
            cargo: 'Especialista em Comunicação'
        },
        analise: {
            cat: 'Análise e <em>Estruturação</em>',
            sub: 'Vertical Financeiro — Vasconcelos Group',
            desc: 'Você pensa em estruturas, não em eventos. Sua capacidade analítica e atenção ao detalhe constroem a base sobre a qual as melhores decisões são tomadas. No ecossistema Vasconcelos, você seria o profissional que mapeia riscos, identifica padrões e garante que cada movimento esteja sustentado por lógica sólida.',
            role: 'Análise · Dados · Estruturação',
            dept: 'Financeiro & Controladoria',
            cargo: 'Analista de Dados Sênior'
        }
    };

    const qScores = { estrategia: 0, inovacao: 0, operacoes: 0, branding: 0, analise: 0 };
    const qAnswers = [null, null, null, null, null];
    let qCurrent = 0;

    const startBtn = document.getElementById('quiz-start-btn');
    const quizStart = document.getElementById('quiz-start');
    const quizBody = document.getElementById('quiz-body');
    const qCount = document.getElementById('q-count');
    const qFill = document.getElementById('q-fill');
    const qResult = document.getElementById('q-result');
    const resCategory = document.getElementById('res-category');
    const resSubtitle = document.getElementById('res-subtitle');
    const resDesc = document.getElementById('res-desc');
    const resRole = document.getElementById('res-role');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            quizStart.style.display = 'none';
            quizBody.style.display = 'block';
        });
    }

    document.querySelectorAll('.q-opt').forEach(opt => {
        opt.addEventListener('click', function() {
            const block = this.closest('.q-block');
            const q = parseInt(block.dataset.q);
            block.querySelectorAll('.q-opt').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            qAnswers[q] = this.dataset.s;
            const btn = block.querySelector('.q-btn');
            btn.classList.add('on');
        });
    });

    document.querySelectorAll('.q-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('on')) return;
            const q = parseInt(this.dataset.q);
            if (q < 4) {
                document.querySelector(`.q-block[data-q="${q}"]`).classList.remove('active');
                document.querySelector(`.q-block[data-q="${q + 1}"]`).classList.add('active');
                qCurrent = q + 1;
                qCount.textContent = (q + 2) + ' / 5';
                qFill.style.width = ((q + 2) / 5 * 100) + '%';
            } else {
                showQResult();
            }
        });
    });

    function showQResult() {
        qAnswers.forEach(a => { if (a) qScores[a]++; });
        let winner = 'estrategia',
            max = 0;
        for (const k in qScores) {
            if (qScores[k] > max) { max = qScores[k];
                winner = k; }
        }
        const r = qResults[winner];
        document.querySelector('.q-block[data-q="4"]').classList.remove('active');
        document.querySelector('.q-progress').style.display = 'none';
        qResult.classList.add('show');
        resCategory.innerHTML = r.cat;
        resSubtitle.textContent = r.sub;
        resDesc.textContent = r.desc;
        resRole.textContent = r.role;

        // Pre-fill badge
        const sel = document.getElementById('b-dept-sel');
        if (sel) {
            for (let o of sel.options) {
                if (o.value === r.dept) { o.selected = true; break; }
            }
        }
        const cargoInp = document.getElementById('b-cargo-inp');
        if (cargoInp) cargoInp.value = r.cargo;
    }

    document.getElementById('quiz-retry')?.addEventListener('click', () => {
        Object.keys(qScores).forEach(k => qScores[k] = 0);
        qAnswers.fill(null);
        qResult.classList.remove('show');
        document.querySelector('.q-progress').style.display = 'block';
        document.querySelectorAll('.q-opt').forEach(o => o.classList.remove('selected'));
        document.querySelectorAll('.q-btn').forEach(b => b.classList.remove('on'));
        document.querySelectorAll('.q-block').forEach((b, i) => b.classList.toggle('active', i === 0));
        qCount.textContent = '1 / 5';
        qFill.style.width = '20%';
        qCurrent = 0;
    });

    // ─── CRACHÁ ──────────────────────────────
    let badgeColor = { bg: '#0F0E17', acc: '#C8A96E' };
    let photoUrl = null;
    const matGerada = 'VG-' + Math.floor(Math.random() * 9000 + 1000);
    const idGerado = 'VG-2026-' + Math.floor(Math.random() * 90000 + 10000);
    const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const validade = new Date();
    validade.setFullYear(validade.getFullYear() + 1);
    const validStr = validade.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const idNumEl = document.getElementById('b-idnum-el');
    const matEl = document.getElementById('b-mat-el');
    const emissaoEl = document.getElementById('b-emissao-el');
    const valEl = document.getElementById('b-validade-el');
    if (idNumEl) idNumEl.textContent = idGerado;
    if (matEl) matEl.textContent = matGerada;
    if (emissaoEl) emissaoEl.textContent = hoje;
    if (valEl) valEl.textContent = validStr;

    document.querySelectorAll('.c-opt').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.c-opt').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            badgeColor.bg = this.dataset.bg;
            badgeColor.acc = this.dataset.acc;
        });
    });

    const fotoFile = document.getElementById('foto-file');
    const fotoImgPrev = document.getElementById('foto-img-prev');
    const fotoIcon = document.getElementById('foto-icon');
    if (fotoFile) {
        fotoFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                photoUrl = ev.target.result;
                fotoImgPrev.src = photoUrl;
                fotoImgPrev.style.display = 'block';
                fotoIcon.style.display = 'none';
            };
            reader.readAsDataURL(file);
        });
    }

    function getIniciais(n) {
        const p = n.trim().split(' ').filter(Boolean);
        if (!p.length) return '?';
        if (p.length === 1) return p[0][0].toUpperCase();
        return (p[0][0] + p[p.length - 1][0]).toUpperCase();
    }

    document.getElementById('btn-gen-badge')?.addEventListener('click', () => {
        const nome = document.getElementById('b-nome').value.trim() || 'Visitante Institucional';
        const cargo = document.getElementById('b-cargo-inp').value.trim() || 'Colaborador(a)';
        const dept = document.getElementById('b-dept-sel').value || 'Vasconcelos Group';
        const mat = document.getElementById('b-matricula-inp').value.trim() || matGerada;

        const nameEl = document.getElementById('b-name-el');
        const cargoEl = document.getElementById('b-cargo-el');
        const deptEl = document.getElementById('b-dept-el');
        const matEl2 = document.getElementById('b-mat-el');
        const initialsEl = document.getElementById('b-initials-el');
        const photoEl = document.getElementById('b-photo-el');
        const accentEl = document.getElementById('b-accent-el');
        const footerEl = document.getElementById('b-footer-el');
        const logoSq = document.getElementById('b-logo-sq-el');
        const avatarEl = document.getElementById('b-av');

        if (nameEl) nameEl.textContent = nome;
        if (cargoEl) {
            cargoEl.textContent = cargo.toUpperCase();
            cargoEl.style.color = badgeColor.acc;
        }
        if (deptEl) deptEl.textContent = dept;
        if (matEl2) matEl2.textContent = mat;
        if (initialsEl) initialsEl.textContent = getIniciais(nome);

        if (photoEl && initialsEl) {
            if (photoUrl) {
                photoEl.src = photoUrl;
                photoEl.style.display = 'block';
                initialsEl.style.display = 'none';
            } else {
                photoEl.style.display = 'none';
                initialsEl.style.display = 'block';
            }
        }

        if (accentEl) accentEl.style.background = badgeColor.acc;
        if (footerEl) footerEl.style.background = badgeColor.bg;
        if (logoSq) {
            logoSq.style.background = badgeColor.acc;
            logoSq.style.color = badgeColor.bg;
        }
        if (avatarEl) {
            avatarEl.style.background = `linear-gradient(135deg,${badgeColor.bg},${badgeColor.acc})`;
        }
    });

    // Download badge
    document.getElementById('btn-dl-badge')?.addEventListener('click', () => {
        const badge = document.getElementById('the-badge');
        if (!badge) return;
        html2canvas(badge, { scale: 3, useCORS: true, backgroundColor: null, logging: false })
            .then(canvas => {
                const a = document.createElement('a');
                a.download = 'cracha_VG_' + (document.getElementById('b-name-el')?.textContent || 'colaborador').replace(/\s+/g, '_') + '.png';
                a.href = canvas.toDataURL('image/png');
                a.click();
            });
    });

    // Share badge
    document.getElementById('btn-share-badge')?.addEventListener('click', function() {
        navigator.clipboard.writeText(window.location.href + '#cracha').then(() => {
            this.textContent = '✓ Link copiado!';
            setTimeout(() => { this.textContent = 'Compartilhar crachá'; }, 2500);
        }).catch(() => {
            // Fallback
            const dummy = document.createElement('input');
            dummy.value = window.location.href + '#cracha';
            document.body.appendChild(dummy);
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            this.textContent = '✓ Link copiado!';
            setTimeout(() => { this.textContent = 'Compartilhar crachá'; }, 2500);
        });
    });

    // ─── REDIRECIONA PARA CRACHÁ VIA QUIZ ──
    document.getElementById('res-cta-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('cracha');
    });

    // ─── INICIALIZA ─────────────────────────
    // Garante que a home está ativa
    if (!document.querySelector('.page.active')) {
        document.getElementById('page-home')?.classList.add('active');
    }

    console.log('🏛️ Vasconcelos Group — SPA carregada com sucesso!');
})();
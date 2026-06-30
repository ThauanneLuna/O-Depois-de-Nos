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
    if (saved === 'light' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        html.classList.add('light');
    }
    toggle.addEventListener('click', () => {
        html.classList.toggle('light');
        localStorage.setItem('vg-theme', html.classList.contains('light') ? 'light' : 'dark');
    });

    // ─── SPA NAVEGAÇÃO ──────────────────────
    function navigate(pageId) {
        pages.forEach(p => p.classList.remove('active'));
        const target = document.getElementById('page-' + pageId);
        if (target) target.classList.add('active');
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
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobile() {
        navMobile.classList.remove('open');
        navOverlay.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
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

    // ─── CARROSSEL COM IMAGENS (SEM PASTA) ──
    const carrosselData = [
        {
            name: 'Henrique Vasconcelos',
            role: 'Presidente do Conselho',
            dept: 'Diretoria',
            initials: 'HV',
            img: 'henrique.png'
        },
        {
            name: 'Noah Vasconcelos',
            role: 'CEO',
            dept: 'Diretoria',
            initials: 'NV',
            img: 'noah.png'
        },
        {
            name: 'Sofia Mendes',
            role: 'Coordenadora de Projetos',
            dept: 'Projetos',
            initials: 'SM',
            img: 'sofia.png'
        },
        {
            name: 'Marcus Oliveira',
            role: 'Gerente de Logística',
            dept: 'Logística',
            initials: 'MO',
            img: 'marcus.png'
        },
        {
            name: 'Priya Sharma',
            role: 'Analista de Marketing',
            dept: 'Marketing',
            initials: 'PS',
            img: 'priya.png'
        },
        {
            name: 'Felix Moreira',
            role: 'Designer UI/UX',
            dept: 'Design',
            initials: 'FM',
            img: 'felix.png'
        },
        {
            name: 'Sara Costa',
            role: 'Analista de Branding',
            dept: 'Branding',
            initials: 'SC',
            img: 'sara.png'
        },
        {
            name: 'Luna Carvalho',
            role: 'Fotógrafa Corporativa',
            dept: 'Parceiros',
            initials: 'LC',
            img: 'luna.png'
        },
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
                <div class="avatar" style="background: none; padding: 0; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <img src="${p.img}" alt="${p.name}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;object-position:center;border:2px solid var(--gold);" 
                         onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,var(--gold-d),var(--gold))';this.parentElement.textContent='${p.initials}';this.parentElement.style.color='var(--ink)';this.parentElement.style.display='flex';this.parentElement.style.alignItems='center';this.parentElement.style.justifyContent='center';this.parentElement.style.fontSize='36px';this.parentElement.style.fontFamily='Cormorant Garamond, serif';this.parentElement.style.fontWeight='600';">
                </div>
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

    // ─── FUNCIONÁRIOS (SEM PASTA) ──────────
    const funcionarios = [
        {
            name: 'Henrique Vasconcelos',
            role: 'Presidente do Conselho',
            dept: 'Diretoria',
            bio: 'Fundador da Vasconcelos Group. Pai de Noah. Possui poder de veto e representa a tradição e o legado da holding.',
            tag: 'Fundador',
            img: 'henrique.png'
        },
        {
            name: 'Noah Vasconcelos',
            role: 'CEO',
            dept: 'Diretoria',
            bio: 'Assumiu a gestão executiva em 2024. Responsável pela estratégia e operações do grupo.',
            tag: 'Liderança',
            img: 'noah.png'
        },
        {
            name: 'Sofia Mendes',
            role: 'Coordenadora de Projetos',
            dept: 'Projetos',
            bio: 'Gerencia projetos de alto impacto, garantindo alinhamento entre equipes e entregas.',
            tag: 'Gestão',
            img: 'sofia.png'
        },
        {
            name: 'Marcus Oliveira',
            role: 'Gerente de Logística',
            dept: 'Logística',
            bio: '35 anos. Especialista em otimização de cadeias de suprimento e operações complexas.',
            tag: 'Operações',
            img: 'marcus.png'
        },
        {
            name: 'Priya Sharma',
            role: 'Analista de Marketing',
            dept: 'Marketing',
            bio: '25 anos. Estrategista de marketing digital e posicionamento de marca.',
            tag: 'Estratégia',
            img: 'priya.png'
        },
        {
            name: 'Felix Moreira',
            role: 'Designer UI/UX',
            dept: 'Design',
            bio: '24 anos. Cria experiências digitais que combinam estética e funcionalidade.',
            tag: 'Criatividade',
            img: 'felix.png'
        },
        {
            name: 'Sara Costa',
            role: 'Analista de Branding',
            dept: 'Branding',
            bio: '28 anos. Constrói narrativas de marca e identidade visual para o grupo.',
            tag: 'Branding',
            img: 'sara.png'
        },
        {
            name: 'Luna Carvalho',
            role: 'Fotógrafa Corporativa',
            dept: 'Parceiros',
            bio: '24 anos. Profissional parceira, contratada para campanhas e eventos institucionais.',
            tag: 'Parceira',
            img: 'luna.png'
        },
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
                <div class="avatar" style="background: none; padding: 0; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <img src="${f.img}" alt="${f.name}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;object-position:center;border:2px solid var(--gold);" 
                         onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,var(--gold-d),var(--gold))';this.parentElement.textContent='${f.name.split(' ').map(n => n[0]).join('').slice(0, 2)}';this.parentElement.style.color='var(--ink)';this.parentElement.style.display='flex';this.parentElement.style.alignItems='center';this.parentElement.style.justifyContent='center';this.parentElement.style.fontSize='28px';this.parentElement.style.fontFamily='Cormorant Garamond, serif';this.parentElement.style.fontWeight='600';">
                </div>
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

    const qBlocks = document.querySelectorAll('.q-block');
    const qTotal = qBlocks.length; // total de perguntas, calculado dinamicamente
    const qScores = { estrategia: 0, inovacao: 0, operacoes: 0, branding: 0, analise: 0 };
    const qAnswers = new Array(qTotal).fill(null);
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
            if (q < qTotal - 1) {
                document.querySelector(`.q-block[data-q="${q}"]`).classList.remove('active');
                document.querySelector(`.q-block[data-q="${q + 1}"]`).classList.add('active');
                qCurrent = q + 1;
                qCount.textContent = (q + 2) + ' / ' + qTotal;
                qFill.style.width = ((q + 2) / qTotal * 100) + '%';
            } else {
                showQResult();
            }
        });
    });

    function showQResult() {
        qAnswers.forEach(a => { if (a) qScores[a]++; });
        let max = 0;
        for (const k in qScores) {
            if (qScores[k] > max) max = qScores[k];
        }
        // Em caso de empate, escolhe aleatoriamente entre os perfis empatados
        // em vez de sempre favorecer o primeiro da lista.
        const tied = Object.keys(qScores).filter(k => qScores[k] === max);
        const winner = tied[Math.floor(Math.random() * tied.length)];
        const r = qResults[winner];
        document.querySelector(`.q-block[data-q="${qTotal - 1}"]`).classList.remove('active');
        document.querySelector('.q-progress').style.display = 'none';
        qResult.classList.add('show');
        resCategory.innerHTML = r.cat;
        resSubtitle.textContent = r.sub;
        resDesc.textContent = r.desc;
        resRole.textContent = r.role;

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
        qCount.textContent = '1 / ' + qTotal;
        qFill.style.width = (100 / qTotal) + '%';
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

    // ─── DOWNLOAD PDF ─────────────────────────
    document.getElementById('btn-dl-badge')?.addEventListener('click', function() {
        const badge = document.getElementById('the-badge');
        if (!badge) return;
        
        const originalText = this.textContent;
        this.textContent = '⏳ Gerando PDF...';
        this.disabled = true;
        
        html2canvas(badge, { 
            scale: 3, 
            useCORS: true, 
            backgroundColor: null, 
            logging: false,
            width: 320,
            height: 600
        })
        .then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('cracha_VG_' + (document.getElementById('b-name-el')?.textContent || 'colaborador').replace(/\s+/g, '_') + '.pdf');
            
            this.textContent = '✅ PDF salvo!';
            this.disabled = false;
            setTimeout(() => {
                this.textContent = '⬇ Salvar como PDF';
            }, 3000);
        })
        .catch(err => {
            console.error('Erro ao gerar PDF:', err);
            this.textContent = '❌ Erro! Tente novamente';
            this.disabled = false;
            setTimeout(() => {
                this.textContent = '⬇ Salvar como PDF';
            }, 3000);
        });
    });

    document.getElementById('btn-share-badge')?.addEventListener('click', function() {
        navigator.clipboard.writeText(window.location.href + '#cracha').then(() => {
            this.textContent = '✓ Link copiado!';
            setTimeout(() => { this.textContent = 'Compartilhar crachá'; }, 2500);
        }).catch(() => {
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

    document.getElementById('res-cta-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigate('cracha');
    });

    if (!document.querySelector('.page.active')) {
        document.getElementById('page-home')?.classList.add('active');
    }

    console.log('🏛️ Vasconcelos Group — SPA carregada com sucesso!');
})();

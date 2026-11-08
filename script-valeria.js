document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener('load', () => {
        const pre = document.getElementById('preloader');
        if (pre) setTimeout(() => pre.classList.add('hidden'), 500);
    });

    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    const themeBtn = document.getElementById('themeToggle');
    const root = document.documentElement;
    function syncThemeIcon() {
        const dark = root.getAttribute('data-theme') === 'dark';
        if (themeBtn) themeBtn.innerHTML = dark
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', dark ? '#1a0d15' : '#ec4899');
    }
    syncThemeIcon();
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            syncThemeIcon();
        });
    }

    document.querySelectorAll('.hero-name .line').forEach((line, li) => {
        const word = line.dataset.line || '';
        line.innerHTML = '';
        [...word].forEach((ch, ci) => {
            const s = document.createElement('span');
            s.textContent = ch;
            s.style.transform = 'translateY(110%)';
            s.style.transition = 'transform .7s cubic-bezier(.2,.8,.2,1)';
            s.style.transitionDelay = (li * 0.14 + ci * 0.03 + 0.4) + 's';
            line.appendChild(s);
        });
    });
    requestAnimationFrame(() => {
        document.querySelectorAll('.hero-name .line span')
            .forEach(s => s.style.transform = 'translateY(0)');
    });

    const roles = [
        'Profesora de Inglés.',
        'Teacher Val.',
        'Community Manager.',
        'Asesora de Ventas.'
    ];
    const typed = document.getElementById('typed');
    if (typed) {
        let r = 0, c = 0, deleting = false;
        (function type() {
            const word = roles[r];
            typed.textContent = deleting ? word.slice(0, c--) : word.slice(0, c++);
            let delay = deleting ? 45 : 85;
            if (!deleting && c === word.length + 1) { deleting = true; delay = 1600; }
            else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
            setTimeout(type, delay);
        })();
    }

    const nav = document.getElementById('navHeader');
    const progress = document.getElementById('scrollProgress');
    const toTop = document.getElementById('toTop');
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');

    function onScroll() {
        const sc = window.scrollY;
        nav.classList.toggle('scrolled', sc > 40);
        toTop.classList.toggle('show', sc > 500);
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (sc / h * 100) + '%';

        let current = '';
        sections.forEach(s => {
            if (sc >= s.offsetTop - 140) current = s.id;
        });
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('nav');
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        menu.classList.toggle('open');
    });
    links.forEach(l => l.addEventListener('click', () => {
        toggle.classList.remove('open');
        menu.classList.remove('open');
    }));

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');

                if (e.target.classList.contains('skill')) {
                    const fill = e.target.querySelector('.fill');
                    if (fill) fill.style.width = fill.dataset.fill + '%';
                }
                e.target.querySelectorAll('[data-count]').forEach(runCounter);

                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('[data-reveal], .skill').forEach(el => io.observe(el));

    function runCounter(el) {
        const target = +el.dataset.count;
        const dur = 1400;
        const start = performance.now();
        (function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target);
            if (p < 1) requestAnimationFrame(tick);
        })(start);
    }

    const blobs = document.querySelectorAll('.blob');
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - .5);
        const y = (e.clientY / window.innerHeight - .5);
        blobs.forEach((b, i) => {
            const f = (i + 1) * 14;
            b.style.transform = `translate(${x * f}px, ${y * f}px)`;
        });
    });

    const modal = document.getElementById('empresaModal');
    const modalImg = document.getElementById('modalImg');
    const modalName = document.getElementById('modalName');
    const modalLocation = document.getElementById('modalLocation');
    const modalDesc = document.getElementById('modalDesc');
    const modalClose = document.getElementById('modalClose');

    document.querySelectorAll('.empresa').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            modalImg.src = img ? img.src : '';
            modal.querySelector('.modal-box').classList.toggle('no-img', !img);
            const modalIcon = document.getElementById('modalIcon');
            if (modalIcon) modalIcon.className = card.dataset.icon || 'fa-solid fa-briefcase';
            modalImg.alt = card.dataset.name || '';
            modalName.textContent = card.dataset.name || '';
            modalLocation.textContent = card.dataset.ubicacion || '';
            modalDesc.textContent = card.dataset.desc || '';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const tel = document.getElementById('telefono').value.trim();
            const asunto = document.getElementById('asunto').value.trim() || 'Contacto desde el portafolio';
            const mensaje = document.getElementById('mensaje').value.trim();

            const body = `Nombre: ${nombre}%0D%0ACorreo: ${email}%0D%0ATeléfono: ${tel}%0D%0A%0D%0A${mensaje}`;
            window.location.href =
                `mailto:valeriavpg05@gmail.com?subject=${encodeURIComponent(asunto)}&body=${body}`;
        });
    }
});
console.log('Happy developing ✨')
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {

    /* Sticky shadow */
    header.classList.toggle('sticky', window.scrollY > 50);

    /* Active nav highlight */
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 140) {
            current = sec.getAttribute('id');
        }
    });

    navLinks.forEach(a => {
        a.classList.remove('active-link');
        if (a.getAttribute('href') === '#' + current) {
            a.classList.add('active-link');
        }
    });

    /* Scroll reveal */
    revealSections();
});

/* ── 2. SCROLL REVEAL ── */
function revealSections() {
    sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top < window.innerHeight - 80) {
            sec.classList.add('show');
        }
    });
}
/* Run once on load so above-fold sections are visible */
revealSections();

/* ── 3. HAMBURGER MENU (mobile) ── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.querySelector('nav ul');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('nav-open');
        hamburger.classList.toggle('open');
    });

    /* Close on link click */
    navLinks.forEach(a => {
        a.addEventListener('click', () => {
            navMenu.classList.remove('nav-open');
            hamburger.classList.remove('open');
        });
    });
}

/* ── 4. RESERVATION FORM ── */
const form        = document.querySelector('.reservation-form form');
const typeSelect  = document.querySelector('.reservation-form select');

if (form) {

    /* Show/hide "Опис на прослава" field for special events */
    const extraGroup = document.createElement('div');
    extraGroup.id    = 'extra-group';
    extraGroup.style.display = 'none';
    extraGroup.innerHTML = `
    <input
      type="text"
      id="extra-desc"
      placeholder="Опишете ја прославата (тема, декорација, желби...)"
    />
  `;
    typeSelect.parentNode.insertBefore(extraGroup, typeSelect.nextSibling);

    typeSelect.addEventListener('change', () => {
        const val = typeSelect.value;
        const isEvent = ['Роденден','Baby Shower','Веридба','Годишнина'].includes(val);
        extraGroup.style.display = isEvent ? 'block' : 'none';
    });

    /* Form submit */
    form.addEventListener('submit', e => {
        e.preventDefault();

        const name  = form.querySelector('input[type="text"]').value.trim();
        const phone = form.querySelector('input[type="tel"]').value.trim();
        const date  = form.querySelector('input[type="date"]').value;
        const time  = form.querySelector('input[type="time"]').value;
        const type  = typeSelect.value;

        /* Basic validation */
        if (!name || !phone || !date || !time || !type || type === 'Изберете тип на резервација') {
            showToast('Ве молиме пополнете ги сите задолжителни полиња.', 'error');
            return;
        }

        /* Phone check – Macedonian format */
        const phoneOK = /^(\+389|0)[0-9 ]{8,}$/.test(phone);
        if (!phoneOK) {
            showToast('Внесете валиден телефонски број (+389 7X XXX XXX).', 'error');
            return;
        }

        showToast(`Ви благодариме, ${name}! Резервацијата е примена. Ќе ве контактираме наскоро. ✅`, 'success');
        form.reset();
        extraGroup.style.display = 'none';
    });
}

/* ── 5. TOAST NOTIFICATION ── */
function showToast(msg, type = 'success') {
    let toast = document.getElementById('vbb-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'vbb-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className   = 'vbb-toast ' + type;
    toast.classList.add('visible');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('visible'), 4500);
}
/* ── 6. GALLERY CAROUSEL + LIGHTBOX ── */

const galleryContainer = document.querySelector('.gallery-container');
const galleryImgs = document.querySelectorAll('.gallery-container img');
const galleryPrev = document.querySelector('.gallery-prev');
const galleryNext = document.querySelector('.gallery-next');

let galleryCurrent = 0;

function updateGallery() {

    const total = galleryImgs.length;

    galleryImgs.forEach((img, index) => {

        const position =
            (index - galleryCurrent + total) % total;

        img.className = '';

        if (position === 0) {
            img.classList.add('gallery-center');
        }
        else if (position === 1) {
            img.classList.add('gallery-right-1');
        }
        else if (position === 2) {
            img.classList.add('gallery-right-2');
        }
        else if (position === 3) {
            img.classList.add('gallery-right-3');
        }
        else if (position === total - 1) {
            img.classList.add('gallery-left-1');
        }
        else if (position === total - 2) {
            img.classList.add('gallery-left-2');
        }
        else if (position === total - 3) {
            img.classList.add('gallery-left-3');
        }
        else {
            img.classList.add('gallery-hidden');
        }
    });
}

if (galleryImgs.length) {

    updateGallery();

    if (galleryPrev) {
        galleryPrev.addEventListener('click', () => {
            galleryCurrent--;

            if (galleryCurrent < 0) {
                galleryCurrent = galleryImgs.length - 1;
            }

            updateGallery();
        });
    }

    if (galleryNext) {
        galleryNext.addEventListener('click', () => {
            galleryCurrent++;

            if (galleryCurrent >= galleryImgs.length) {
                galleryCurrent = 0;
            }

            updateGallery();
        });
    }

    /* ── LIGHTBOX ── */

    const overlay = document.createElement('div');

    overlay.id = 'lightbox';

    overlay.innerHTML = `
        <button id="lb-close" aria-label="Затвори">✕</button>
        <button id="lb-prev" aria-label="Претходна">&#8249;</button>
        <img id="lb-img" src="" alt="Галерија">
        <button id="lb-next" aria-label="Следна">&#8250;</button>
    `;

    document.body.appendChild(overlay);

    let lightboxCurrent = 0;

    function openLightbox(index) {
        lightboxCurrent = index;

        document.getElementById('lb-img').src =
            galleryImgs[lightboxCurrent].src;

        overlay.classList.add('lb-open');

        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        overlay.classList.remove('lb-open');

        document.body.style.overflow = '';
    }

    galleryImgs.forEach((img, index) => {
        img.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    document.getElementById('lb-close')
        .addEventListener('click', closeLightbox);

    document.getElementById('lb-prev')
        .addEventListener('click', () => {

            lightboxCurrent--;

            if (lightboxCurrent < 0) {
                lightboxCurrent = galleryImgs.length - 1;
            }

            document.getElementById('lb-img').src =
                galleryImgs[lightboxCurrent].src;
        });

    document.getElementById('lb-next')
        .addEventListener('click', () => {

            lightboxCurrent++;

            if (lightboxCurrent >= galleryImgs.length) {
                lightboxCurrent = 0;
            }

            document.getElementById('lb-img').src =
                galleryImgs[lightboxCurrent].src;
        });

    overlay.addEventListener('click', e => {
        if (e.target === overlay) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', e => {

        if (!overlay.classList.contains('lb-open')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        }

        if (e.key === 'ArrowLeft') {
            document.getElementById('lb-prev').click();
        }

        if (e.key === 'ArrowRight') {
            document.getElementById('lb-next').click();
        }
    });
}

/* ── 7. SMOOTH SCROLL for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = header ? header.offsetHeight + 10 : 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
});

/* ── 8. COOKIE BANNER ── */
if (!localStorage.getItem('vbb_cookies')) {
    const banner = document.createElement('div');
    banner.id    = 'cookie-banner';
    banner.innerHTML = `
    <p>
      🍪 Оваа страница користи колачиња за подобро корисничко искуство.
      <a href="#" id="cookie-policy">Прочитај повеќе</a>
    </p>
    <div class="cookie-btns">
      <button id="cookie-accept">Прифати</button>
      <button id="cookie-decline">Одбиј</button>
    </div>
  `;
    document.body.appendChild(banner);

    setTimeout(() => banner.classList.add('cb-visible'), 800);

    document.getElementById('cookie-accept').addEventListener('click', () => {
        localStorage.setItem('vbb_cookies', 'accepted');
        banner.classList.remove('cb-visible');
        setTimeout(() => banner.remove(), 400);
    });

    document.getElementById('cookie-decline').addEventListener('click', () => {
        localStorage.setItem('vbb_cookies', 'declined');
        banner.classList.remove('cb-visible');
        setTimeout(() => banner.remove(), 400);
    });

    document.getElementById('cookie-policy').addEventListener('click', e => {
        e.preventDefault();
        showToast('Политиката за приватност е достапна на барање преку e-mail.', 'success');
    });
}

/* ── 9. BACK-TO-TOP BUTTON ── */
const btt = document.createElement('button');
btt.id          = 'back-to-top';
btt.innerHTML   = '&#8679;';
btt.title       = 'Назад на врв';
document.body.appendChild(btt);

btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

window.addEventListener('scroll', () => {
    btt.classList.toggle('btt-visible', window.scrollY > 400);
});

/* ── 11. CUSTOM CURSOR (коктел чаша) ── */

const isFineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (isFineHover) {

    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.innerHTML = `
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <!-- Чаша за коктел (мартини стил) -->
            <path d="M8 10 L32 34 L56 10 Z"
                  fill="none" stroke="#d4af37" stroke-width="3"
                  stroke-linejoin="round" stroke-linecap="round"/>
            <line x1="32" y1="34" x2="32" y2="54"
                  stroke="#d4af37" stroke-width="3" stroke-linecap="round"/>
            <line x1="20" y1="54" x2="44" y2="54"
                  stroke="#d4af37" stroke-width="3" stroke-linecap="round"/>
            <!-- Маслинка -->
            <circle cx="38" cy="20" r="3" fill="#d4af37"/>
        </svg>
    `;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.classList.add('cc-visible');
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('cc-visible');
    });

    /* Smooth lag анимација (glue-follow) */
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;

        cursor.style.left = cursorX + 'px';
        cursor.style.top  = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    /* Зголеми се над клликабилни елементи */
    const hoverTargets = document.querySelectorAll(
        'a, button, .menu-card, .gallery-container img, .card, .event-card'
    );

    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cc-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cc-hover'));
    });
}

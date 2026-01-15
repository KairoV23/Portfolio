// PAGE NAVIGATION
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page + 'Page').classList.add('active');
    window.scrollTo(0, 0);
    if (page === 'gdd') {
        currentGddSlide = 0;
        updateGddSlider();
    }
    if (page === 'web') {
        currentWebSlide = 0;
        updateWebSlider();
    }
}

// GDD SLIDER
let currentGddSlide = 0;

function updateGddSlider() {
    document.getElementById('gddSlides').style.transform = `translateX(-${currentGddSlide * 100}%)`;
    document.querySelectorAll('#gddPage .dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentGddSlide);
    });
}

function nextGddSlide() {
    currentGddSlide = (currentGddSlide + 1) % 2;
    updateGddSlider();
}

function prevGddSlide() {
    currentGddSlide = (currentGddSlide - 1 + 2) % 2;
    updateGddSlider();
}

function goToGddSlide(i) {
    currentGddSlide = i;
    updateGddSlider();
}

// WEB SLIDER
let currentWebSlide = 0;

function updateWebSlider() {
    document.getElementById('webSlides').style.transform = `translateX(-${currentWebSlide * 100}%)`;
    document.querySelectorAll('#webPage .dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentWebSlide);
    });
}

function nextWebSlide() {
    currentWebSlide = (currentWebSlide + 1) % 2;
    updateWebSlider();
}

function prevWebSlide() {
    currentWebSlide = (currentWebSlide - 1 + 2) % 2;
    updateWebSlider();
}

function goToWebSlide(i) {
    currentWebSlide = i;
    updateWebSlider();
}

// KEYBOARD NAV
document.addEventListener('keydown', (e) => {
    if (document.getElementById('gddPage').classList.contains('active')) {
        if (e.key === 'ArrowLeft') prevGddSlide();
        if (e.key === 'ArrowRight') nextGddSlide();
    }
    if (document.getElementById('webPage').classList.contains('active')) {
        if (e.key === 'ArrowLeft') prevWebSlide();
        if (e.key === 'ArrowRight') nextWebSlide();
    }
});


// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.classList.add('hide');
    }, 2500);
});

// ===== MENU DROPDOWN =====
function toggleMenu() {
    const dropdown = document.getElementById('menuDropdown');
    dropdown.classList.toggle('show');
}

function closeMenu() {
    const dropdown = document.getElementById('menuDropdown');
    if (dropdown) dropdown.classList.remove('show');
}

// Fermer le menu si on clique ailleurs
document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-dropdown')) {
        closeMenu();
    }
});

// ===== LANGUAGE SWITCHER =====
let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim() === lang.toUpperCase()) {
            btn.classList.add('active');
        }
    });
    document.querySelectorAll('.txt').forEach(el => {
        const translation = el.getAttribute('data-' + lang);
        if (translation) {
            el.textContent = translation;
        }
    });
    document.querySelectorAll('[data-en][data-fr]').forEach(el => {
        const translation = el.getAttribute('data-' + lang);
        if (translation) {
            el.textContent = translation;
        }
    });
}

// ===== AMÉLIORATION DES TRANSITIONS =====
const originalShowPage = showPage;
showPage = function(page) {
    const pages = ['home', 'gdd', 'web', 'pricing'];
    const currentPageEl = document.querySelector('.page.active');
    const currentPageName = currentPageEl ? currentPageEl.id.replace('Page', '') : 'home';
    const oldPageIndex = pages.indexOf(currentPageName);
    const newPageIndex = pages.indexOf(page);

    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active', 'slide-left', 'slide-right');
    });

    const pageElement = document.getElementById(page + 'Page');
    if (!pageElement) return;

    if (page === 'home') {
        pageElement.classList.remove('slide-left', 'slide-right');
    } else if (newPageIndex > oldPageIndex) {
        pageElement.classList.add('slide-left');
    } else {
        pageElement.classList.add('slide-right');
    }

    setTimeout(() => {
        pageElement.classList.add('active');
        if (page === 'gdd' && typeof currentGddSlide !== 'undefined') {
            currentGddSlide = 0;
            if (typeof updateGddSlider === 'function') updateGddSlider();
        }
        if (page === 'web' && typeof currentWebSlide !== 'undefined') {
            currentWebSlide = 0;
            if (typeof updateWebSlider === 'function') updateWebSlider();
        }
    }, 50);
};

// ===== KONAMI CODE =====
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === konamiCode[konamiIndex] || e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            konamiIndex = 0;
            startGame();
        }
    } else {
        konamiIndex = 0;
    }
});

// ===== DODGE GAME =====
let gameRunning = false;
let gameScore = 0;
let playerX = 200;
let playerY = 350;
let playerSize = 20;
let enemies = [];
let gameCanvas, gameCtx;

function startGame() {
    const modal = document.getElementById('gameModal');
    if (!modal) return;

    modal.classList.add('show');
    gameCanvas = document.getElementById('gameCanvas');
    gameCtx = gameCanvas.getContext('2d');
    gameRunning = true;
    gameScore = 0;
    playerX = 200;
    enemies = [];

    const scoreEl = document.getElementById('gameScore');
    if (scoreEl) scoreEl.textContent = '0';

    gameLoop();
}

function closeGame() {
    const modal = document.getElementById('gameModal');
    if (modal) modal.classList.remove('show');
    gameRunning = false;
}

function gameLoop() {
    if (!gameRunning || !gameCtx) return;

    gameCtx.fillStyle = '#000';
    gameCtx.fillRect(0, 0, 400, 400);

    gameCtx.fillStyle = '#d4a574';
    gameCtx.fillRect(playerX - playerSize / 2, playerY - playerSize / 2, playerSize, playerSize);

    if (Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * 380 + 10,
            y: 0,
            speed: Math.random() * 2 + 2
        });
    }

    gameCtx.fillStyle = '#fff';
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        enemy.y += enemy.speed;

        gameCtx.beginPath();
        gameCtx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
        gameCtx.fill();

        let dx = playerX - enemy.x;
        let dy = playerY - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < playerSize / 2 + 10) {
            gameRunning = false;
            gameCtx.fillStyle = '#fff';
            gameCtx.font = '30px Inter';
            gameCtx.textAlign = 'center';
            gameCtx.fillText('GAME OVER!', 200, 200);
            return;
        }

        if (enemy.y > 410) {
            enemies.splice(i, 1);
            gameScore++;
            const scoreEl = document.getElementById('gameScore');
            if (scoreEl) scoreEl.textContent = gameScore;
        }
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        playerX = Math.max(playerSize / 2, playerX - 15);
    }
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        playerX = Math.min(400 - playerSize / 2, playerX + 15);
    }
});

function navToSec(id) {
    showPage('home');
    setTimeout(() => {
        const t = document.getElementById(id) || document.querySelector('.hero');
        if (!t) return;
        if (id === 'hero' || t.classList.contains('hero')) {
            window.scrollTo({
                top: 0,
                behavior: 'instant'
            });
            t.classList.add('hero-popup');
            setTimeout(() => t.classList.remove('hero-popup'), 600);
            return;
        }
        const all = ['about', 'services', 'skills', 'projects', 'contact'];
        const ti = all.indexOf(id);
        const ci = all.findIndex(s => {
            const e = document.getElementById(s);
            return e && e.offsetTop <= window.scrollY + window.innerHeight / 2
        });
        const isDown = ti > ci || id === 'about';
        t.scrollIntoView({
            behavior: 'instant',
            block: 'start'
        });
        t.classList.add(isDown ? 'sec-slide-up' : 'sec-slide-down');
        setTimeout(() => t.classList.remove('sec-slide-up', 'sec-slide-down'), 600);
    }, 50);
}

function smoothScrollTo(element, duration) {
    const target = element.offsetTop;
    const start = window.pageYOffset || document.documentElement.scrollTop;
    const distance = target - start;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        window.scrollTo(0, start + distance * ease);
        if (progress < 1) requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
}

function goToContact() {
    const hp = document.getElementById('homePage');
    const contact = document.getElementById('contact');
    if (!hp || !contact) return;
    showPage('home');
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
    setTimeout(() => {
        hp.classList.add('blur-transition');
        setTimeout(() => {
            smoothScrollTo(contact, 2000);
            setTimeout(() => {
                hp.classList.remove('blur-transition');
            }, 1000);
        }, 400);
    }, 100);
}
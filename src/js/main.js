// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar hover functionality
const nav = document.querySelector('nav');
const sideMenu = document.getElementById('sideMenu');
let isMenuOpen = false;

nav.addEventListener('mouseenter', () => {
    sideMenu.style.width = '250px';
    isMenuOpen = true;
});

nav.addEventListener('mouseleave', () => {
    sideMenu.style.width = '0';
    isMenuOpen = false;
});

// Optional: Close menu when clicking a link
document.querySelectorAll('#sideMenu a').forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(() => {
            sideMenu.style.width = '0';
            isMenuOpen = false;
        }, 300);
    });
});

// Matrix efekti
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Canvas boyutlarını ayarla
function setCanvasSize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

// Matrix karakterleri
const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const charArray = chars.split('');

const fontSize = 14;
const columns = canvas.width / fontSize;

// Her sütun için y pozisyonları
const drops = [];
for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

// Matrix yağmuru
function drawMatrix() {
    ctx.fillStyle = 'rgba(26, 26, 26, 0.1)'; // Arka plan opaklığını azalttık
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#C5A572'; // secondary renk
    ctx.font = `${fontSize}px monospace`;
    ctx.globalAlpha = 0.8; // Karakterlerin opaklığını artırdık

    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) { // Düşme hızını biraz artırdık
            drops[i] = 0;
        }
        drops[i]++;
    }
    ctx.globalAlpha = 1;
}

// Animasyon hızını artıralım
setInterval(drawMatrix, 40); // 50ms'den 40ms'ye düşürdük 
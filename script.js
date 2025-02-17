// script.js
// Cosmic Background
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.prepend(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = Array(200).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5,
    velocityX: 0,
    velocityY: 0
}));
function backspace() {
    display.value = display.value.slice(0, -1);
}
function drawStars() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#0ff';
        ctx.shadowBlur = 15;
        ctx.fill();
        
        star.x += star.velocityX;
        star.y += star.velocityY;
        
        if (star.x < 0 || star.x > canvas.width) star.velocityX *= -0.5;
        if (star.y < 0 || star.y > canvas.height) star.velocityY *= -0.5;
        
        star.velocityX *= 0.95;
        star.velocityY *= 0.95;
    });
}

document.addEventListener('mousemove', (e) => {
    stars.forEach(star => {
        const dx = e.clientX - star.x;
        const dy = e.clientY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            star.velocityX += -dx * 0.01;
            star.velocityY += -dy * 0.01;
        }
    });
});
function switchMode(mode) {
    // Hide all modes
    document.querySelectorAll('.mode-basic, .mode-scientific, .mode-stat, .mode-equation, .mode-converter')
            .forEach(el => el.classList.add('hidden'));
    
    // Show selected mode
    document.querySelector(`.mode-${mode}`).classList.remove('hidden');
    
    // Update button states
    document.querySelectorAll('.mode-selector button').forEach(btn => {
        btn.style.background = btn.onclick.toString().includes(mode) ? '#0ff' : '#002929';
        btn.style.color = btn.onclick.toString().includes(mode) ? '#000' : '#0ff';
    });
}

// Initialize with basic mode
switchMode('basic');
function animate() {
    drawStars();
    requestAnimationFrame(animate);
}
animate();

// Calculator Functions
let display = document.getElementById('result');

function appendToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function calculate() {
    try {
        let expression = display.value
            .replace(/\^/g, '**')
            .replace(/Math\.sqrt\(/g, 'Math.sqrt(')
            .replace(/Math\.log10\(/g, 'Math.log10(')
            .replace(/Math\.log\(/g, 'Math.log(');
        
        display.value = eval(expression);
    } catch (error) {
        display.value = 'Error';
    }
}

// Geolocation and Weather
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        document.getElementById('location').textContent = `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
        
        try {
            const weather = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=YOUR_API_KEY`
            ).then(res => res.json());
            document.getElementById('temperature').textContent = `${Math.round(weather.main.temp)}°C`;
        } catch {
            document.getElementById('temperature').textContent = 'N/A';
        }
    }, () => {
        document.getElementById('location').textContent = 'Permission denied';
    });
}

// Window Resize Handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
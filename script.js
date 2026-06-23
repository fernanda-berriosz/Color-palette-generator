const paletteContainer = document.getElementById('palette-container');
const generateBtn = document.getElementById('generate-btn');
const appContainer = document.querySelector('.app-container');
const harmonySelect = document.getElementById('harmony-select');

const COLORS_COUNT = 4;

// Función auxiliar para convertir HSL a HEX
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Genera una paleta basada en la armonía seleccionada
function generatePalette() {
    paletteContainer.innerHTML = '';
    const colors = [];
    const harmony = harmonySelect.value;

    // 1. Elegimos un tono base al azar (entre 0 y 360 grados)
    const baseHue = Math.floor(Math.random() * 360);
    const saturation = 85; 
    const lightness = 60;

    for (let i = 0; i < COLORS_COUNT; i++) {
        let currentHue = baseHue;
        let currentLightness = lightness;

        // 2. Aplicamos la matemática según la regla elegida
        if (harmony === 'analogous') {
            // Colores vecinos: sumamos de a 30 grados a cada muestra
            currentHue = (baseHue + (i * 30)) % 360;
        } 
        else if (harmony === 'complementary') {
            // Colores opuestos: dos del lado base, dos del lado opuesto (+180 grados)
            if (i >= 2) {
                currentHue = (baseHue + 180) % 360;
            }
            currentLightness = i % 2 === 0 ? lightness : lightness - 15;
        } 
        else if (harmony === 'monochromatic') {
            // Mismo tono, pero variamos la luminosidad
            currentLightness = 30 + (i * 18); 
        }
        else if (harmony === 'random') {
            // Cada color tiene un tono completamente desvinculado
            currentHue = Math.floor(Math.random() * 360);
        }

        // Convertimos el resultado matemático a un código HEX real
        const hexColor = hslToHex(currentHue, saturation, currentLightness);
        colors.push(hexColor);

        // Creamos la tarjeta visual
        const swatch = document.createElement('div');
        swatch.classList.add('color-swatch');
        swatch.innerHTML = `
            <div class="color-box" style="background-color: ${hexColor}"></div>
            <span class="color-label">${hexColor}</span>
        `;

        swatch.addEventListener('click', () => copyToClipboard(hexColor, swatch));
        paletteContainer.appendChild(swatch);
    }

    // Cambiamos el fondo con un degradado de los dos primeros colores calculados
    appContainer.style.background = `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
}

// Función de copiado
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const label = element.querySelector('.color-label');
        const originalText = label.innerText;
        label.innerText = '¡Copiado!';
        label.style.color = '#00b074';
        
        setTimeout(() => {
            label.innerText = originalText;
            label.style.color = '';
        }, 1000);
    });
}

// EVENTOS
generateBtn.addEventListener('click', generatePalette);
harmonySelect.addEventListener('change', generatePalette); // Detecta cambios en el menú desplegable

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        generatePalette();
    }
});

// Inicializar la primera paleta al cargar
generatePalette();
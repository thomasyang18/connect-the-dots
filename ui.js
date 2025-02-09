let n = 6;
let m = 3;
let colors = generatePermutation(n, m);
let connections = [];
let selectedVertex = null;

const nDisplay = document.getElementById('n-display');
const mDisplay = document.getElementById('m-display');
const title = document.getElementById('title');

nDisplay.textContent = n;
mDisplay.textContent = m;

function adjustN(delta) {
    n = Math.max(2, n + delta); // Ensure n is at least 2
    nDisplay.textContent = n;
    colors = generatePermutation(n, m);
    connections = []; // Clear connections on resize
    selectedVertex = null;
    drawPolygon();
}

function adjustM(delta) {
    m = Math.max(2, m + delta); // Ensure m is at least 2
    mDisplay.textContent = m;
    colors = generatePermutation(n, m);
    drawPolygon();
}

// Make functions globally accessible
window.adjustN = adjustN;
window.adjustM = adjustM;

title.addEventListener('click', () => {
    colors = generatePermutation(n, m);
    drawPolygon();
});

import { drawPolygon } from './polygon.js';
import { generatePermutation } from './permutation.js';
import { handleClick, doIntersect } from './interaction.js';

export let n = 6; // export n, m, colors, connections, selectedVertex
export let m = 3;
export let colors = generatePermutation(n, m);
export let connections = [];
export let selectedVertex = null;

// ... other code ...

document.getElementById('canvas').addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        if (Math.sqrt((mouseX - x)**2 + (mouseY - y)**2) < 10) { // Check if click is near a vertex
            handleClick(i);
            break;
        }
    }
});

function connectDots() {
    // This function is removed as it's no longer used
}

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

title.addEventListener('click', () => {
    colors = generatePermutation(n, m);
    drawPolygon();
});

document.getElementById('canvas').addEventListener('click', function(event) {
    // ... (rest of the click handling logic remains the same)
});
import { drawPolygon } from './polygon.js';
import { generatePermutation } from './permutation.js';

// ... (rest of the code)

function connectDots() {
    // This function is removed as it's no longer used
}

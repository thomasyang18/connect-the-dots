import { globalState } from "./global_state.js";

export function drawPolygon(polygon, ui) {
    const state = polygon.getState();
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.9; // Make the polygon as big as possible

    const targetX = state.proofVisible ? 250 : 0;
    const currentX = parseFloat(canvas.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
    const newX = lerp(currentX, targetX, 0.1);
    canvas.style.transform = `translateX(${newX}px)`;

    // Draw freebie connections
    for (const connection of state.freebieConnections) {
        const [a, b] = connection;
        const angleA = (2 * Math.PI * a) / state.n;
        const angleB = (2 * Math.PI * b) / state.n;
        const xA = centerX + radius * Math.cos(angleA);
        const yA = centerY + radius * Math.sin(angleA);
        const xB = centerX + radius * Math.cos(angleB);
        const yB = centerY + radius * Math.sin(angleB);

        ctx.beginPath();
        ctx.moveTo(xA, yA);
        ctx.lineTo(xB, yB);
        ctx.lineWidth = 2; // Make the lines thicker
        if (state.colors[a] === state.colors[b]) {
            ctx.setLineDash([5, 5]); // Dashed line for same color
        } else {
            ctx.setLineDash([]); // Solid line for different colors
        }
        ctx.stroke();
        ctx.lineWidth = 1; // Reset line width
        ctx.setLineDash([]); // Reset line dash
    }

    // Draw user connections
    for (const connection of state.userConnections) {
        const [a, b] = connection;
        const angleA = (2 * Math.PI * a) / state.n;
        const angleB = (2 * Math.PI * b) / state.n;
        const xA = centerX + radius * Math.cos(angleA);
        const yA = centerY + radius * Math.sin(angleA);
        const xB = centerX + radius * Math.cos(angleB);
        const yB = centerY + radius * Math.sin(angleB);
        ctx.beginPath();
        ctx.moveTo(xA, yA);
        ctx.lineTo(xB, yB);
        ctx.lineWidth = 2; // Make the lines thicker
        ctx.strokeStyle = 'black'; // Make the lines black
        ctx.stroke();
        ctx.lineWidth = 1; // Reset line width

        // Draw red dot at the midpoint
        const midX = (xA + xB) / 2;
        const midY = (yA + yB) / 2;
        ctx.beginPath();
        ctx.arc(midX, midY, ui.redDotRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fill();
    }

    // Draw nodes
    for (let i = 0; i < state.n; i++) {
        const angle = (2 * Math.PI * i) / state.n;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI); // Make the nodes bigger
        ctx.fillStyle = `hsl(${state.colors[i] * (360 / state.m)}, 100%, 50%)`;
        ctx.fill();
        ctx.stroke();
    }

    // Draw selected node
    if (state.selectedVertex !== null) {
        const angle = (2 * Math.PI * state.selectedVertex) / state.n;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, 2 * Math.PI); // Make the selected node bigger
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // Make the highlight transparent
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Make the highlight transparent
        ctx.fill();
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', x, y); // Add a plus sign to indicate selected
    }

    // Reset stroke style to black
    ctx.strokeStyle = 'black';
}

function lerp(start, end, amount) {
    return start + (end - start) * amount;
}

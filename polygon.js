import { n, m, colors, connections, selectedVertex } from './ui.js';

export function drawPolygon() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;


    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${colors[i] * 360 / m}, 100%, 50%)`;
        if (selectedVertex === i) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
        ctx.fill();
    }

    // Draw connections
    ctx.strokeStyle = 'black';
    connections.forEach(connection => {
        const start = connection[0];
        const end = connection[1];
        const startX = centerX + radius * Math.cos((2 * Math.PI * start) / n);
        const startY = centerY + radius * Math.sin((2 * Math.PI * start) / n);
        const endX = centerX + radius * Math.cos((2 * Math.PI * end) / n);
        const endY = centerY + radius * Math.sin((2 * Math.PI * end) / n);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    });
}

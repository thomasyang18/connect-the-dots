import { globalState } from "./global_state.js";
import { loadHint, hints } from "./hints.js";
import { globalRec, localRec } from "./reccomender.js";

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

    // Again, this is such a damn meme LMFAO, horrible swe practices
    // But hardcoded if statement for the triangle exposure case

    if (Math.max(...globalState.numbersSolved) + 1 >= [...hints.keys()][1]) { // enable ONLY IF we've reached the second hint
        // Draw triangles
        for (let i = 0; i < state.n; i++) {
            for (let j = 0; j < state.n; j++) {
                for (let k = 0; k < state.n; k++) {
                    if (i !== j && j !== k && k !== i) {
                        const edges = [
                            [i, j],
                            [j, k],
                            [k, i]
                        ];
                        const hasAllEdges = edges.every(([a, b]) =>
                            state.userConnections.some(conn => (conn[0] === a && conn[1] === b) || (conn[0] === b && conn[1] === a)) ||
                            state.freebieConnections.some(conn => (conn[0] === a && conn[1] === b) || (conn[0] === b && conn[1] === a))
                        );
                        if (hasAllEdges) {
                            const angleA = (2 * Math.PI * i) / state.n;
                            const angleB = (2 * Math.PI * j) / state.n;
                            const angleC = (2 * Math.PI * k) / state.n;
                            const xA = centerX + radius * Math.cos(angleA);
                            const yA = centerY + radius * Math.sin(angleA);
                            const xB = centerX + radius * Math.cos(angleB);
                            const yB = centerY + radius * Math.sin(angleB);
                            const xC = centerX + radius * Math.cos(angleC);
                            const yC = centerY + radius * Math.sin(angleC);

                            ctx.beginPath();
                            ctx.moveTo(xA, yA);
                            ctx.lineTo(xB, yB);
                            ctx.lineTo(xC, yC);
                            ctx.closePath();
                            ctx.fillStyle = 'rgba(173, 216, 230, 0.5)'; // Light blue color
                            ctx.fill();
                        }
                    }
                }
            }
        }
    }

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

    // AIDER: Draw Reccomendation systemms here


    function drawEdge(a, b, ctx, centerX, centerY, radius) {
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
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // Light red color
        ctx.stroke();
        ctx.lineWidth = 1; // Reset line width
        ctx.strokeStyle = 'black'; // Reset stroke style to black
    }


    if (Math.max(...globalState.numbersSolved) + 1 >= [...hints.keys()][2]) {
        // Draw the basic, 1 node in section, to all reccomender system. (global)
        let pair = globalRec(polygon.getState());
        if (pair !== null) {
            drawEdge(pair[0], pair[1], ctx, centerX, centerY, radius);
        }
    } else if (Math.max(...globalState.numbersSolved) + 1 >= [...hints.keys()][3]) {
        // Importantly here, we *first place the adj rec* then the global rec, *which is wrong*.
        let pair = localRec(polygon.getState());
        if (pair === null) pair = globalRec(polygon.getState());

        if (pair !== null) {
            drawEdge(pair[0], pair[1], ctx, centerX, centerY, radius);
        }


    } else if (Math.max(...globalState.numbersSolved) + 1 >= [...hints.keys()][5]) {
        // Here, we place the global rec, then the adj rec, which is correct. :)

        let pair = globalRec(polygon.getState());
        if (pair === null) pair = localRec(polygon.getState());

        if (pair !== null) {
            drawEdge(pair[0], pair[1], ctx, centerX, centerY, radius);
        }
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
        // console.log("Selected ertex " + state.selectedVertex);

        const angle = (2 * Math.PI * state.n) / state.n;
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

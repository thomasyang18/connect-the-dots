import { doIntersect } from './utils.js';

export class Polygon {
    constructor() {
        this.n = 6;
        this.m = 3;
        this.colors = this.generatePermutation(this.n, this.m);
        this.connections = [];
        this.selectedVertex = null;
        this.state = 'idle'; // 'idle', 'firstSelected'
    }

    generatePermutation(n, m) {
        // Generate a random permutation of colors such that there are at most m colors, and every color shows up at least once
        const colors = Array.from({ length: n }, (_, i) => i < m ? i : Math.floor(Math.random() * m));
        // Shuffle the colors array
        for (let i = colors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [colors[i], colors[j]] = [colors[j], colors[i]];
        }
        return colors;
    }

    handleClick(i) {
        switch (this.state) {
            case 'idle':
                this.selectedVertex = i;
                this.state = 'firstSelected';
                this.drawPolygon(); // Redraw to highlight selected vertex
                break;
            case 'firstSelected':
                if (this.selectedVertex === i) {
                    this.selectedVertex = null; // Deselect if same vertex clicked again
                    this.state = 'idle';
                    this.drawPolygon(); // Redraw to remove highlight
                } else {
                    this.handleSecondClick(i);
                }
                break;
        }
    }

    handleSecondClick(i) {
        if (this.colors[this.selectedVertex] !== this.colors[i]) { // Check for different colors
            let intersects = false;
            for (const existingConnection of this.connections) {
                if (doIntersect(this.selectedVertex, i, existingConnection[0], existingConnection[1], this.n)) {
                    intersects = true;
                    break;
                }
            }

            if (this.selectedVertex < i) {
                var a = this.selectedVertex;
                var b = i;
            } else {
                var a = i;
                var b = this.selectedVertex;
            }

            if (!intersects && !this.connections.some(connection => (connection[0] === a && connection[1] === b))) {
                this.connections.push([a, b]);
            }
        }
        this.selectedVertex = null; // Deselect after handling second click
        this.state = 'idle';
        this.drawPolygon(); // Redraw to show the connection or reset the selection
    }

    drawPolygon() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.9; // Make the polygon as big as possible

        // Draw adjacent lines
        for (let i = 0; i < this.n; i++) {
            const nextIndex = (i + 1) % this.n;
            const angleA = (2 * Math.PI * i) / this.n;
            const angleB = (2 * Math.PI * nextIndex) / this.n;
            const xA = centerX + radius * Math.cos(angleA);
            const yA = centerY + radius * Math.sin(angleA);
            const xB = centerX + radius * Math.cos(angleB);
            const yB = centerY + radius * Math.sin(angleB);

            ctx.beginPath();
            ctx.moveTo(xA, yA);
            ctx.lineTo(xB, yB);
            ctx.lineWidth = 2; // Make the lines thicker
            if (this.colors[i] === this.colors[nextIndex]) {
                ctx.setLineDash([5, 5]); // Dashed line for same color
            } else {
                ctx.setLineDash([]); // Solid line for different colors
            }
            ctx.stroke();
            ctx.lineWidth = 1; // Reset line width
            ctx.setLineDash([]); // Reset line dash
        }

        // Draw connections
        for (const connection of this.connections) {
            const [a, b] = connection;
            const angleA = (2 * Math.PI * a) / this.n;
            const angleB = (2 * Math.PI * b) / this.n;
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
        }

        // Draw nodes
        for (let i = 0; i < this.n; i++) {
            const angle = (2 * Math.PI * i) / this.n;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, 2 * Math.PI); // Make the nodes bigger
            ctx.fillStyle = `hsl(${this.colors[i] * (360 / this.m)}, 100%, 50%)`;
            ctx.fill();
            ctx.stroke();
        }

        // Draw selected node
        if (this.selectedVertex !== null) {
            const angle = (2 * Math.PI * this.selectedVertex) / this.n;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, 17, 0, 2 * Math.PI); // Make the selected node bigger
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }

        // Reset stroke style to black
        ctx.strokeStyle = 'black';
    }
}

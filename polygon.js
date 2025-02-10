import { doIntersect } from './utils.js';

export class Polygon {
    constructor(ui) {
        this.ui = ui;
        this.n = 6;
        this.m = 3;
        this.colors = this.generatePermutation(this.n, this.m);
        this.userConnections = [];
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

    calculateMaxEdges(n, m, C) {
        if (m >= 3) {
            return n - 3;
        } else if (m === 2) {
            return n - 2 + Math.floor(C / 2);
        } else {
            return 0; // No edges can be added if there is only one color
        }
    }

    handleClick(i) {
        switch (this.state) {
            case 'idle':
                this.selectedVertex = i;
                this.state = 'firstSelected';
                break;
            case 'firstSelected':
                if (this.selectedVertex === i) {
                    this.selectedVertex = null; // Deselect if same vertex clicked again
                    this.state = 'idle';
                } else {
                    this.handleSecondClick(i);
                }
                break;
        }
    }

    handleSecondClick(i) {
        if (this.colors[this.selectedVertex] !== this.colors[i]) { // Check for different colors
            let intersects = false;
            for (const existingConnection of this.userConnections) {
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

            const maxEdges = this.calculateMaxEdges(this.n, this.m, this.n);
            if (!intersects && !this.userConnections.some(connection => (connection[0] === a && connection[1] === b)) && this.userConnections.length < maxEdges) {
                this.userConnections.push([a, b]);
            }
        }
        this.selectedVertex = null; // Deselect after handling second click
        this.state = 'idle';
    }

    handleEdgeClick(connection) {
        const index = this.userConnections.findIndex(conn => conn[0] === connection[0] && conn[1] === connection[1]);
        if (index !== -1) {
            this.userConnections.splice(index, 1);
        }
    }

    getState() {
        return {
            n: this.n,
            m: this.m,
            colors: this.colors,
            userConnections: this.userConnections,
            selectedVertex: this.selectedVertex,
            state: this.state,
            maxEdges: this.calculateMaxEdges(this.n, this.m, this.n),
            edgesLeft: this.calculateMaxEdges(this.n, this.m, this.n) - this.userConnections.length
        };
    }

    adjustN(delta) {
        this.n = Math.max(3, this.n + delta); // Ensure n is at least 3
        this.m = Math.min(this.m, this.n); // Ensure m is not greater than n
        this.colors = this.generatePermutation(this.n, this.m);
        this.userConnections = []; // Clear connections on resize
        this.selectedVertex = null;
        this.state = 'idle'; // Reset state
    }

    adjustM(delta) {
        this.m = Math.max(2, Math.min(this.n, this.m + delta)); // Ensure m is at least 2 and not greater than n
        this.colors = this.generatePermutation(this.n, this.m);
        this.userConnections = []; // Clear connections on resize
        this.selectedVertex = null;
        this.state = 'idle'; // Reset state
    }

    reset() {
        this.colors = this.generatePermutation(this.n, this.m);
        this.userConnections = []; // Reset connections
        this.selectedVertex = null; // Reset selected vertex
        this.state = 'idle'; // Reset state
    }
}

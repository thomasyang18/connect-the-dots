import { doIntersect } from './utils.js';
import { globalState } from './global_state.js';

export class Polygon {
    constructor(n, m, colors, userConnections = [], freebieConnections = [], selectedVertex = null, state = 'idle', proofVisible = false) {
        this.n = n;
        // this.m = m;
        this.m = 3; // constant now

        this.colors = colors;
        this.userConnections = userConnections;
        this.freebieConnections = freebieConnections;
        this.selectedVertex = selectedVertex;
        this.state = state;
        this.proofVisible = proofVisible;
    }

    static generatePermutation(n, m) {

        if (n == 13) {
            // Look at hints.js for the idea here. 
            // Putting 0 at index 1 is also coupled with render logic, which is coupled with the random shit at 13...
            // Like this is not good swe. At all. 
            return [1, 0, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
        }

        // Generate a random permutation of colors such that there are at most m colors, and every color shows up at least once
        const colors = Array.from({ length: n }, (_, i) => i < m ? i : Math.floor(Math.random() * m));
        // Shuffle the colors array
        for (let i = colors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [colors[i], colors[j]] = [colors[j], colors[i]];
        }
        return colors;
    }

    static generateFreebieConnections(n, colors) {
        const freebieConnections = [];
        for (let i = 0; i < n; i++) {
            const nextIndex = (i + 1) % n;
            freebieConnections.push([i, nextIndex]);
        }
        return freebieConnections;
    }

    static calculateMaxEdges(n, m, C) {
        if (m >= 3) {
            return n - 3;
        }
        console.assert(false);
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

            if ((this.selectedVertex + 1) % this.n == i || (i + 1) % this.n == this.selectedVertex); // skip freebie connections... since apparently aider cant detect shit 
            else {
                const maxEdges = Polygon.calculateMaxEdges(this.n, this.m, this.n);
                if (!intersects && !this.userConnections.some(connection => (connection[0] === a && connection[1] === b)) && !this.freebieConnections.some(connection => (connection[0] === a && connection[1] === b)) && this.userConnections.length < maxEdges) {
                    this.userConnections.push([a, b]);
                }
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

    toggleProofVisibility() {
        this.proofVisible = !this.proofVisible;
    }

    getState() {
        return {
            n: this.n,
            m: this.m,
            colors: this.colors,
            userConnections: this.userConnections,
            freebieConnections: this.freebieConnections,
            selectedVertex: this.selectedVertex,
            state: this.state,
            maxEdges: Polygon.calculateMaxEdges(this.n, this.m, this.n),
            edgesLeft: Polygon.calculateMaxEdges(this.n, this.m, this.n) - this.userConnections.length,
            proofVisible: this.proofVisible
        };
    }

    adjustN(newN) {
        newN = Math.max(4, newN); // Ensure n is at least 4

        newN = Math.min(newN, Math.max(...globalState.numbersSolved) + 1); // can be no more than 1 + next instance

        // newN = Math.min(newN, 38);

        // console.log("AWTF " + newN);

        const newColors = Polygon.generatePermutation(newN, 3);
        const newFreebieConnections = Polygon.generateFreebieConnections(newN, newColors);
        return new Polygon(newN, 3, newColors, [], newFreebieConnections);
    }

    // adjustM(delta) {
    //     // at most 3 colors. I mean, you can technically solve this with 2 colors? But it's not that interesting.
    //     const newM = Math.max(3, Math.min(this.n, this.m + delta));
    //     const newColors = Polygon.generatePermutation(this.n, newM);
    //     const newFreebieConnections = Polygon.generateFreebieConnections(this.n, newColors);
    //     return new Polygon(this.n, newM, newColors, [], newFreebieConnections);
    // }

    reset() {
        const newColors = Polygon.generatePermutation(this.n, this.m);
        const newFreebieConnections = Polygon.generateFreebieConnections(this.n, newColors);
        return new Polygon(this.n, this.m, newColors, [], newFreebieConnections);
    }
}

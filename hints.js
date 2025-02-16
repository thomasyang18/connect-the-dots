const hints = new Map([
    [4, 
        [
            `Hey! Didn't see you there.`,
            `The rules are simple. Don't connect two nodes of the same color, and don't make any line intersect. Capiche? :)`
        ]
    ],
    [6, 
        [
            `I've noticed something!`,
            `We can keep on cutting off triangles at the 'edges' of the original shape. This way, we can cleanly think about the smaller shapes.`,
            `It's hard to visualize until you see it. Keep on playing, I'll highlight the 'cut off' triangles for you...`
        ]
    ],
    
    // Add more hints here
]);

function loadHint(state) {
    const hintsDiv = document.getElementById('hints-div');
    hintsDiv.innerHTML = ''; // Clear previous hints

    // Sort the keys and iterate over the map
    for (const key of Array.from(hints.keys()).sort((a, b) => a - b)) {
        if (state.has(key)) {
            for (const str of hints.get(key)) {
                const hintElement = document.createElement('div');
                hintElement.classList.add('hint');
                hintElement.textContent = str;
                hintsDiv.appendChild(hintElement);
            }
        }
    }
}

export { loadHint }
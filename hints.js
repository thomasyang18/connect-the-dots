const hints = new Map([
    [4, 
        [
            `Hey! Didn't see you there.`,
            `The rules are simple. Don't connect two nodes of the same color, and don't make any line intersect. Capiche? :)`
        ]
    ],
    // Add more hints here
]);

export function loadHint(state) {
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

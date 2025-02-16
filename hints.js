const hints = new Map([
    [1, "How would you come up with a general algorithm? Solve 5 puzzles from scratch for the next hint. Yes, N=4 nodes counts :)"],
    // Add more hints here
]);

export function loadHint(state) {
    const hintsDiv = document.getElementById('hints-div');
    hintsDiv.innerHTML = ''; // Clear previous hints

    // Sort the keys and iterate over the map
    for (const key of Array.from(hints.keys()).sort((a, b) => a - b)) {
        if (state.has(key)) {
            const hintElement = document.createElement('div');
            hintElement.classList.add('hint');
            hintElement.textContent = hints.get(key);
            hintsDiv.appendChild(hintElement);
        }
    }
}

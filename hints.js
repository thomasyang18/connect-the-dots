const hints = [
    "How would you come up with a general algorithm? Solve 5 puzzles from scratch for the next hint. Yes, N=4 nodes counts :)",
    // Add more hints here
];

export function loadHint(state) {
    state = Math.floor((state.size + 1) / 2);

    const hintsDiv = document.getElementById('hints-div');
    hintsDiv.innerHTML = ''; // Clear previous hints
    for (let i = 0; i < state; i++) {
        const hintElement = document.createElement('p');
        hintElement.textContent = hints[i];
        hintsDiv.appendChild(hintElement);
    }
}

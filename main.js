import { Polygon } from './polygon.js';
import { UI } from './ui.js';
import { globalState } from './global_state.js';

document.addEventListener('DOMContentLoaded', () => {
    const initialN = 4;
    const initialM = 3;
    const initialColors = Polygon.generatePermutation(initialN, initialM);
    const initialFreebieConnections = Polygon.generateFreebieConnections(initialN, initialColors);
    const polygon = new Polygon(initialN, initialM, initialColors, [], initialFreebieConnections);
    const ui = new UI(polygon);
    ui.init();

    ui.polygon.handleClick(0); // Make it a little more obvious what I want the player to do, by pre-selecting a node. 
    ui.updateDisplay(); // again, horrible SWE practice, but I just wanna get this website out :)

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            const newN = Math.max(...globalState.numbersSolved);
            globalState.numbersSolved.add(newN + 1);
            ui.adjustN(newN + 2);
        }
    });
});

import { Polygon } from './polygon.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const polygon = new Polygon(ui);
    ui.polygon = polygon;
    ui.init();
});

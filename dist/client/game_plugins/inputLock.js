"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeInputLock = initializeInputLock;
function initializeInputLock() {
    // Allow normal mouse wheel scrolling; only prevent browser Ctrl+zoom
    window.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
            e.preventDefault();
        }
    });
    window.addEventListener('contextmenu', (e) => e.preventDefault());
}

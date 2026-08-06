"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleServerEvents = handleServerEvents;
function handleServerEvents(state) {
    const modal = document.getElementById('maintenance-overlay');
    const annText = document.getElementById('announcement-banner');
    if (annText && state.announcement) {
        annText.innerText = state.announcement;
    }
    if (modal) {
        if (state.isMaintenance) {
            modal.classList.remove('hidden');
        }
        else {
            modal.classList.add('hidden');
        }
    }
}

export interface GameEventState {
  isMaintenance: boolean;
  announcement: string;
}

export function handleServerEvents(state: GameEventState): void {
  const modal = document.getElementById('maintenance-overlay');
  const annText = document.getElementById('announcement-banner');

  if (annText && state.announcement) {
    annText.innerText = state.announcement;
  }

  if (modal) {
    if (state.isMaintenance) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }
}

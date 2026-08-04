export function initializeInputLock(): void {
  // Allow normal mouse wheel scrolling; only prevent browser Ctrl+zoom
  window.addEventListener('wheel', (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  }, { passive: false });

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
      e.preventDefault();
    }
  });

  window.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());
}

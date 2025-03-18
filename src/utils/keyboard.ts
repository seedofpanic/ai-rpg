import { gameStore } from 'models/gameStore';

export const keysDown = new Set<string>();

export function handleKeyDown(event: KeyboardEvent) {
  gameStore.updateControls(event.code);
  keysDown.add(event.code);
}

export function handleKeyUp(event: KeyboardEvent) {
  keysDown.delete(event.code);
}

// Initialize keyboard event listeners
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

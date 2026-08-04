export interface PlaceMode {
  id: 'DUNGEON' | 'IDLE' | 'TOWER';
  name: string;
  description: string;
}

export const GAME_PLACES: Record<string, PlaceMode> = {
  DUNGEON: {
    id: 'DUNGEON',
    name: 'Emerald Dungeon',
    description: 'Active combat zone with aggressive enemies and armor drops.'
  },
  IDLE: {
    id: 'IDLE',
    name: 'Sanctuary Grove',
    description: 'Safe zone offering automated passive EXP over time.'
  },
  TOWER: {
    id: 'TOWER',
    name: 'Tower of Trial',
    description: 'Climb endless floors to test your Combat Power against bosses.'
  }
};

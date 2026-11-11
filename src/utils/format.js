export const capitalize = (s = '') =>
  s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const dexNumber = (id) => `#${String(id).padStart(4, '0')}`;

export const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

export const statPercent = (value, max = 255) => Math.round((Math.min(value, max) / max) * 100);

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '../app/store';

export function renderWithStore(ui, { preloadedState, store = setupStore(preloadedState) } = {}) {
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}

export const jsonResponse = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
});

export const listResponse = (names, offset = 0, count = 1025) =>
  jsonResponse({
    count,
    results: names.map((name, i) => ({ name, url: `https://pokeapi.co/api/v2/pokemon/${offset + i + 1}/` })),
  });

export const detailResponse = (id, name, types = ['electric']) =>
  jsonResponse({
    id,
    name,
    height: 4,
    weight: 60,
    sprites: { other: { 'official-artwork': { front_default: `https://img/${id}.png` } } },
    types: types.map((t) => ({ type: { name: t } })),
    abilities: [{ ability: { name: 'static' } }],
    stats: [
      { stat: { name: 'hp' }, base_stat: 35 },
      { stat: { name: 'speed' }, base_stat: 90 },
    ],
  });

export const typesResponse = jsonResponse({ results: [{ name: 'fire' }, { name: 'water' }, { name: 'unknown' }] });

// Route fetch calls by URL to fake responses.
export const routeFetch = (routes) => async (url) => {
  for (const [pattern, response] of routes) {
    if (url.includes(pattern)) return typeof response === 'function' ? response(url) : response;
  }
  throw new TypeError('Failed to fetch');
};

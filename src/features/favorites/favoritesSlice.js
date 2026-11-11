import { createSlice } from '@reduxjs/toolkit';

export const STORAGE_KEY = 'pokedex:favorites';

export function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [], showOnly: false },
  reducers: {
    toggleFavorite(state, action) {
      const pokemon = action.payload; // { id, name, image }
      const index = state.items.findIndex((p) => p.id === pokemon.id);
      if (index >= 0) state.items.splice(index, 1);
      else state.items.push(pokemon);
    },
    toggleShowOnly(state) {
      state.showOnly = !state.showOnly;
    },
  },
});

export const { toggleFavorite, toggleShowOnly } = favoritesSlice.actions;
export default favoritesSlice.reducer;

export const selectFavorites = (state) => state.favorites.items;
export const selectIsFavorite = (id) => (state) => state.favorites.items.some((p) => p.id === id);
export const selectShowOnlyFavorites = (state) => state.favorites.showOnly;

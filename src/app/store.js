import { combineReducers, configureStore } from '@reduxjs/toolkit';
import pokemonReducer from '../features/pokemon/pokemonSlice';
import detailsReducer from '../features/details/detailsSlice';
import favoritesReducer, { loadFavorites, STORAGE_KEY } from '../features/favorites/favoritesSlice';

export const rootReducer = combineReducers({
  pokemon: pokemonReducer,
  details: detailsReducer,
  favorites: favoritesReducer,
});

export const setupStore = (preloadedState) => configureStore({ reducer: rootReducer, preloadedState });

export const store = setupStore({ favorites: { items: loadFavorites(), showOnly: false } });

// Persist favorites between visits (best effort – storage can be unavailable).
let lastSaved;
store.subscribe(() => {
  const items = store.getState().favorites.items;
  if (items === lastSaved) return;
  lastSaved = items;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
});

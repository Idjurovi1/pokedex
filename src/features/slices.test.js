import { describe, expect, it } from 'vitest';
import { setupStore } from '../app/store';
import pokemonReducer, { selectCanShowMore, selectVisiblePokemon, setSearch, setType } from './pokemon/pokemonSlice';
import favoritesReducer, { toggleFavorite } from './favorites/favoritesSlice';
import detailsReducer, { closeDetails, openDetails } from './details/detailsSlice';

const mon = (id, name) => ({ id, name, image: `${id}.png` });

describe('pokemon slice', () => {
  it('filters visible pokemon by name or number', () => {
    const store = setupStore({
      pokemon: { ...pokemonReducer(undefined, { type: '@@init' }), items: [mon(1, 'bulbasaur'), mon(25, 'pikachu')] },
    });
    store.dispatch(setSearch('pika'));
    expect(selectVisiblePokemon(store.getState()).map((p) => p.name)).toEqual(['pikachu']);
    store.dispatch(setSearch('#1'));
    expect(selectVisiblePokemon(store.getState()).map((p) => p.id)).toEqual([1]);
    expect(selectCanShowMore(store.getState())).toBe(false);
  });

  it('resets the list when the type changes', () => {
    let state = pokemonReducer(undefined, { type: '@@init' });
    state = { ...state, items: [mon(1, 'bulbasaur')], offset: 24, status: 'succeeded' };
    state = pokemonReducer(state, setType('fire'));
    expect(state).toMatchObject({ type: 'fire', items: [], offset: 0, status: 'idle' });
  });
});

describe('favorites slice', () => {
  it('toggles favorites on and off', () => {
    let state = favoritesReducer(undefined, toggleFavorite(mon(4, 'charmander')));
    expect(state.items).toHaveLength(1);
    state = favoritesReducer(state, toggleFavorite(mon(4, 'charmander')));
    expect(state.items).toHaveLength(0);
  });
});

describe('details slice', () => {
  it('opens and closes the detail view', () => {
    let state = detailsReducer(undefined, openDetails('Pikachu'));
    expect(state.selected).toBe('pikachu');
    state = detailsReducer(state, closeDetails());
    expect(state.selected).toBeNull();
  });
});

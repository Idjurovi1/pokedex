import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPokemonPage, fetchPokemonByType, fetchTypes, PAGE_SIZE } from '../../api/pokeapi';

export const loadPage = createAsyncThunk('pokemon/loadPage', async (_, { getState }) => {
  const { offset } = getState().pokemon;
  return fetchPokemonPage(offset, PAGE_SIZE);
});

export const loadByType = createAsyncThunk('pokemon/loadByType', async (type) => fetchPokemonByType(type));

export const loadTypes = createAsyncThunk('pokemon/loadTypes', async () => fetchTypes());

const initialState = {
  items: [],
  offset: 0,
  hasMore: true,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  type: 'all',
  types: [],
  search: '',
  visibleCount: PAGE_SIZE, // used when a type filter returns a long list
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setType(state, action) {
      state.type = action.payload;
      state.items = [];
      state.offset = 0;
      state.hasMore = true;
      state.status = 'idle';
      state.error = null;
      state.visibleCount = PAGE_SIZE;
    },
    showMoreOfType(state) {
      state.visibleCount += PAGE_SIZE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadPage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const known = new Set(state.items.map((p) => p.id));
        state.items.push(...action.payload.items.filter((p) => !known.has(p.id)));
        state.offset += action.payload.items.length;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(loadPage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadByType.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadByType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.hasMore = false;
      })
      .addCase(loadByType.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadTypes.fulfilled, (state, action) => {
        state.types = action.payload;
      });
  },
});

export const { setSearch, setType, showMoreOfType } = pokemonSlice.actions;
export default pokemonSlice.reducer;

// Selectors
export const selectPokemonState = (state) => state.pokemon;

export const selectVisiblePokemon = (state) => {
  const { items, search, type, visibleCount } = state.pokemon;
  const term = search.trim().toLowerCase();
  let list = items;
  if (term) {
    list = list.filter((p) => p.name.includes(term) || String(p.id) === term.replace(/^#/, ''));
  }
  if (type !== 'all' && !term) list = list.slice(0, visibleCount);
  return list;
};

export const selectCanShowMore = (state) => {
  const { items, type, visibleCount, hasMore, search } = state.pokemon;
  if (search.trim()) return false;
  return type === 'all' ? hasMore : items.length > visibleCount;
};

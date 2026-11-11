import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPokemonDetails } from '../../api/pokeapi';

export const loadDetails = createAsyncThunk('details/load', async (nameOrId) => fetchPokemonDetails(nameOrId));

const detailsSlice = createSlice({
  name: 'details',
  initialState: {
    selected: null, // name or id the user opened
    byName: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    openDetails(state, action) {
      state.selected = String(action.payload).toLowerCase();
    },
    closeDetails(state) {
      state.selected = null;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDetails.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const p = action.payload;
        state.byName[p.name] = p;
        state.byName[String(p.id)] = p;
      })
      .addCase(loadDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { openDetails, closeDetails } = detailsSlice.actions;
export default detailsSlice.reducer;

export const selectSelectedPokemon = (state) => {
  const { selected, byName } = state.details;
  return selected ? byName[selected] || null : null;
};
export const selectDetailsState = (state) => state.details;

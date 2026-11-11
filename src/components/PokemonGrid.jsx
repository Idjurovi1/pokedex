import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadByType,
  loadPage,
  selectCanShowMore,
  selectPokemonState,
  selectVisiblePokemon,
  setType,
  showMoreOfType,
} from '../features/pokemon/pokemonSlice';
import { selectFavorites, selectShowOnlyFavorites } from '../features/favorites/favoritesSlice';
import PokemonCard from './PokemonCard';
import ErrorState from './ErrorState';

export default function PokemonGrid() {
  const dispatch = useDispatch();
  const { status, error, type, search } = useSelector(selectPokemonState);
  const visible = useSelector(selectVisiblePokemon);
  const canShowMore = useSelector(selectCanShowMore);
  const favorites = useSelector(selectFavorites);
  const showOnlyFavorites = useSelector(selectShowOnlyFavorites);

  useEffect(() => {
    if (status !== 'idle') return;
    dispatch(type === 'all' ? loadPage() : loadByType(type));
  }, [dispatch, status, type]);

  const retry = () => dispatch(type === 'all' ? loadPage() : loadByType(type));
  const loadMore = () => (type === 'all' ? dispatch(loadPage()) : dispatch(showMoreOfType()));

  const list = showOnlyFavorites
    ? favorites.filter((p) => !search.trim() || p.name.includes(search.trim().toLowerCase()))
    : visible;

  if (status === 'failed' && !showOnlyFavorites) {
    return <ErrorState message={error} onRetry={retry} onBack={type !== 'all' ? () => dispatch(setType('all')) : undefined} />;
  }

  return (
    <section aria-label="Pokémon list">
      {list.length === 0 && status === 'succeeded' && (
        <p className="empty">
          {showOnlyFavorites
            ? 'No favorites yet – tap ★ on a Pokémon to save it.'
            : 'No Pokémon match your search here. Press Search to look it up directly.'}
        </p>
      )}
      {showOnlyFavorites && list.length === 0 && status !== 'succeeded' && (
        <p className="empty">No favorites yet – tap ★ on a Pokémon to save it.</p>
      )}
      <ul className="grid">
        {list.map((p, i) => (
          <PokemonCard key={p.id} pokemon={p} index={i} />
        ))}
        {status === 'loading' &&
          !showOnlyFavorites &&
          Array.from({ length: 8 }, (_, i) => <li key={`s${i}`} className="card card--skeleton" aria-hidden="true" />)}
      </ul>
      {status === 'loading' && <p className="visually-hidden" role="status">Loading Pokémon…</p>}
      {canShowMore && !showOnlyFavorites && status !== 'loading' && (
        <div className="more">
          <button type="button" onClick={loadMore}>
            Load more
          </button>
        </div>
      )}
    </section>
  );
}

import { useDispatch, useSelector } from 'react-redux';
import { setSearch, selectPokemonState } from '../features/pokemon/pokemonSlice';
import { openDetails } from '../features/details/detailsSlice';
import { selectFavorites, selectShowOnlyFavorites, toggleShowOnly } from '../features/favorites/favoritesSlice';

export default function Header() {
  const dispatch = useDispatch();
  const { search } = useSelector(selectPokemonState);
  const favorites = useSelector(selectFavorites);
  const showOnly = useSelector(selectShowOnlyFavorites);

  const onSubmit = (e) => {
    e.preventDefault();
    const term = search.trim().replace(/^#/, '');
    if (term) dispatch(openDetails(term)); // exact lookup (works even if not loaded yet)
  };

  return (
    <header className="header">
      <div className="header__brand">
        <span className="pokeball" aria-hidden="true" />
        <h1>Pokédex</h1>
      </div>
      <form className="search" role="search" onSubmit={onSubmit}>
        <label htmlFor="search" className="visually-hidden">
          Search Pokémon by name or number
        </label>
        <input
          id="search"
          type="search"
          placeholder="Search name or #number…"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>
      <button
        type="button"
        className={`fav-toggle${showOnly ? ' fav-toggle--active' : ''}`}
        aria-pressed={showOnly}
        onClick={() => dispatch(toggleShowOnly())}
      >
        ★ Favorites ({favorites.length})
      </button>
    </header>
  );
}

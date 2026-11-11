import { useDispatch, useSelector } from 'react-redux';
import { openDetails } from '../features/details/detailsSlice';
import { selectIsFavorite, toggleFavorite } from '../features/favorites/favoritesSlice';
import { capitalize, dexNumber } from '../utils/format';

export default function PokemonCard({ pokemon, index = 0 }) {
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(pokemon.id));
  const label = capitalize(pokemon.name);

  return (
    <li className="card" style={{ animationDelay: `${Math.min(index % 24, 12) * 30}ms` }}>
      <button type="button" className="card__open" aria-label={`${label}, ${dexNumber(pokemon.id)}`} onClick={() => dispatch(openDetails(pokemon.name))}>
        <img src={pokemon.image} alt="" width="160" height="160" loading="lazy" />
        <span className="card__number">{dexNumber(pokemon.id)}</span>
        <span className="card__name">{label}</span>
      </button>
      <button
        type="button"
        className={`card__fav${isFavorite ? ' card__fav--on' : ''}`}
        aria-label={isFavorite ? `Remove ${label} from favorites` : `Add ${label} to favorites`}
        aria-pressed={isFavorite}
        onClick={() => dispatch(toggleFavorite(pokemon))}
      >
        ★
      </button>
    </li>
  );
}

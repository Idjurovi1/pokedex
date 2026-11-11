import { useDispatch, useSelector } from 'react-redux';
import { selectPokemonState, setType } from '../features/pokemon/pokemonSlice';
import { capitalize } from '../utils/format';

export default function TypeFilter() {
  const dispatch = useDispatch();
  const { types, type } = useSelector(selectPokemonState);

  return (
    <nav className="types" aria-label="Filter by type">
      {['all', ...types].map((t) => (
        <button
          key={t}
          type="button"
          className={`type-chip type--${t}${type === t ? ' type-chip--active' : ''}`}
          aria-pressed={type === t}
          onClick={() => dispatch(setType(t))}
        >
          {t === 'all' ? 'All' : capitalize(t)}
        </button>
      ))}
    </nav>
  );
}

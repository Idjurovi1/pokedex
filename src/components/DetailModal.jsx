import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDetails, loadDetails, selectDetailsState, selectSelectedPokemon } from '../features/details/detailsSlice';
import { selectIsFavorite, toggleFavorite } from '../features/favorites/favoritesSlice';
import { capitalize, dexNumber, STAT_LABELS, statPercent } from '../utils/format';
import ErrorState from './ErrorState';

export default function DetailModal() {
  const dispatch = useDispatch();
  const { selected, status, error } = useSelector(selectDetailsState);
  const pokemon = useSelector(selectSelectedPokemon);
  const isFavorite = useSelector(selectIsFavorite(pokemon?.id));
  const closeRef = useRef(null);

  useEffect(() => {
    if (selected && !pokemon) dispatch(loadDetails(selected));
  }, [dispatch, selected, pokemon]);

  useEffect(() => {
    if (!selected) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && dispatch(closeDetails());
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, selected]);

  if (!selected) return null;
  const close = () => dispatch(closeDetails());

  return (
    <div className="overlay" onClick={close}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="modal__close" aria-label="Close details" onClick={close}>
          ×
        </button>

        {status === 'failed' && (
          <ErrorState message={error} onRetry={() => dispatch(loadDetails(selected))} onBack={close} />
        )}

        {!pokemon && status !== 'failed' && (
          <p className="modal__loading" role="status">
            Loading…
          </p>
        )}

        {pokemon && (
          <article className={`detail type-bg--${pokemon.types[0]}`}>
            <img className="detail__img" src={pokemon.image} alt={capitalize(pokemon.name)} width="240" height="240" />
            <div className="detail__body">
              <p className="detail__number">{dexNumber(pokemon.id)}</p>
              <h2 id="modal-title">{capitalize(pokemon.name)}</h2>
              <ul className="detail__types">
                {pokemon.types.map((t) => (
                  <li key={t} className={`type-chip type--${t}`}>
                    {capitalize(t)}
                  </li>
                ))}
              </ul>
              <dl className="detail__facts">
                <div>
                  <dt>Height</dt>
                  <dd>{pokemon.height} m</dd>
                </div>
                <div>
                  <dt>Weight</dt>
                  <dd>{pokemon.weight} kg</dd>
                </div>
                <div>
                  <dt>Abilities</dt>
                  <dd>{pokemon.abilities.map(capitalize).join(', ')}</dd>
                </div>
              </dl>
              <h3>Base stats</h3>
              <ul className="stats">
                {pokemon.stats.map((s) => (
                  <li key={s.name}>
                    <span className="stats__label">{STAT_LABELS[s.name] || capitalize(s.name)}</span>
                    <span className="stats__value">{s.value}</span>
                    <span className="stats__bar" aria-hidden="true">
                      <span style={{ width: `${statPercent(s.value)}%` }} />
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="detail__fav"
                aria-pressed={isFavorite}
                onClick={() => dispatch(toggleFavorite({ id: pokemon.id, name: pokemon.name, image: pokemon.image }))}
              >
                {isFavorite ? '★ Remove from favorites' : '☆ Add to favorites'}
              </button>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

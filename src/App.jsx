import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from './components/Header';
import TypeFilter from './components/TypeFilter';
import PokemonGrid from './components/PokemonGrid';
import DetailModal from './components/DetailModal';
import { loadTypes } from './features/pokemon/pokemonSlice';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTypes());
  }, [dispatch]);

  return (
    <>
      <Header />
      <main className="container">
        <TypeFilter />
        <PokemonGrid />
      </main>
      <DetailModal />
      <footer className="footer">
        Data from <a href="https://pokeapi.co">PokéAPI</a>. Pokémon and its names are trademarks of Nintendo / Game Freak.
      </footer>
    </>
  );
}

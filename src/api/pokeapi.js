// Thin wrapper around the free PokeAPI (https://pokeapi.co) – no key needed.
export const API_ROOT = 'https://pokeapi.co/api/v2';
export const PAGE_SIZE = 24;
export const MAX_POKEMON = 1025; // national dex (forms above this are skipped)

const cache = new Map();

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function getJson(url) {
  if (cache.has(url)) return cache.get(url);
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new ApiError('Network error – check your connection and try again.');
  }
  if (response.status === 404) throw new ApiError('Pokémon not found.', 404);
  if (!response.ok) throw new ApiError(`PokeAPI error (${response.status}). Please try again.`, response.status);
  const data = await response.json();
  cache.set(url, data);
  return data;
}

// "https://pokeapi.co/api/v2/pokemon/25/" -> 25
export const idFromUrl = (url) => Number(url.split('/').filter(Boolean).pop());

export const artworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const toSummary = ({ name, url }) => {
  const id = idFromUrl(url);
  return { id, name, image: artworkUrl(id) };
};

export async function fetchPokemonPage(offset = 0, limit = PAGE_SIZE) {
  const safeLimit = Math.max(0, Math.min(limit, MAX_POKEMON - offset));
  const data = await getJson(`${API_ROOT}/pokemon?offset=${offset}&limit=${safeLimit}`);
  return {
    items: data.results.map(toSummary),
    hasMore: offset + safeLimit < Math.min(data.count, MAX_POKEMON),
  };
}

export async function fetchTypes() {
  const data = await getJson(`${API_ROOT}/type`);
  return data.results
    .map((t) => t.name)
    .filter((name) => !['unknown', 'shadow', 'stellar'].includes(name));
}

export async function fetchPokemonByType(type) {
  const data = await getJson(`${API_ROOT}/type/${type}`);
  return data.pokemon
    .map((p) => toSummary(p.pokemon))
    .filter((p) => p.id <= MAX_POKEMON)
    .sort((a, b) => a.id - b.id);
}

export async function fetchPokemonDetails(nameOrId) {
  const key = String(nameOrId).trim().toLowerCase();
  const data = await getJson(`${API_ROOT}/pokemon/${encodeURIComponent(key)}`);
  return {
    id: data.id,
    name: data.name,
    image: data.sprites?.other?.['official-artwork']?.front_default || artworkUrl(data.id),
    height: data.height / 10, // metres
    weight: data.weight / 10, // kg
    types: data.types.map((t) => t.type.name),
    abilities: data.abilities.map((a) => a.ability.name),
    stats: data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
  };
}

export function _resetForTests() {
  cache.clear();
}

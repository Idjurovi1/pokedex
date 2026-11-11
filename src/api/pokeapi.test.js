import { describe, expect, it, vi } from 'vitest';
import { fetchPokemonDetails, fetchPokemonPage, fetchTypes, idFromUrl, ApiError } from './pokeapi';
import { detailResponse, jsonResponse, listResponse, typesResponse } from '../test/utils';

describe('pokeapi', () => {
  it('extracts ids from resource urls', () => {
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  });

  it('maps a page of pokemon to summaries with artwork', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(listResponse(['bulbasaur', 'ivysaur']));
    const page = await fetchPokemonPage(0, 2);
    expect(page.items[1]).toEqual({ id: 2, name: 'ivysaur', image: expect.stringContaining('/2.png') });
    expect(page.hasMore).toBe(true);
  });

  it('filters out non-standard types', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(typesResponse);
    expect(await fetchTypes()).toEqual(['fire', 'water']);
  });

  it('normalises details (units, types, stats)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(detailResponse(25, 'pikachu'));
    const p = await fetchPokemonDetails('Pikachu ');
    expect(p).toMatchObject({ id: 25, name: 'pikachu', height: 0.4, weight: 6, types: ['electric'] });
    expect(p.stats[0]).toEqual({ name: 'hp', value: 35 });
  });

  it('throws friendly errors for 404 and network failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse({}, 404));
    await expect(fetchPokemonDetails('missingno')).rejects.toThrow('Pokémon not found.');
    globalThis.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(fetchPokemonDetails('mew')).rejects.toBeInstanceOf(ApiError);
  });
});

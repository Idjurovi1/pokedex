import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { detailResponse, listResponse, renderWithStore, routeFetch, typesResponse } from './test/utils';

describe('App', () => {
  it('loads the first page, opens details and saves a favorite', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      routeFetch([
        ['/type', typesResponse],
        ['/pokemon?offset', listResponse(['bulbasaur', 'ivysaur'])],
        ['/pokemon/ivysaur', detailResponse(2, 'ivysaur', ['grass', 'poison'])],
      ]),
    );
    const user = userEvent.setup();
    const { store } = renderWithStore(<App />);

    expect(await screen.findByRole('button', { name: /^Ivysaur, #0002/ })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Fire' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Ivysaur, #0002/ }));
    const dialog = await screen.findByRole('dialog');
    expect(await within(dialog).findByRole('heading', { name: 'Ivysaur' })).toBeInTheDocument();
    expect(within(dialog).getByText('Poison')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /Add to favorites/ }));
    expect(store.getState().favorites.items.map((p) => p.name)).toEqual(['ivysaur']);

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('shows an error state with a working retry button', async () => {
    let fail = true;
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      routeFetch([
        ['/type', typesResponse],
        [
          '/pokemon?offset',
          () => {
            if (fail) throw new TypeError('Failed to fetch');
            return listResponse(['bulbasaur']);
          },
        ],
      ]),
    );
    const user = userEvent.setup();
    renderWithStore(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/Network error/);
    fail = false;
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('button', { name: /^Bulbasaur, #0001/ })).toBeInTheDocument();
  });

  it('looks up a pokemon directly from the search form', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      routeFetch([
        ['/type', typesResponse],
        ['/pokemon?offset', listResponse(['bulbasaur'])],
        ['/pokemon/25', detailResponse(25, 'pikachu')],
      ]),
    );
    const user = userEvent.setup();
    renderWithStore(<App />);
    await user.type(screen.getByRole('searchbox'), '#25');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(await screen.findByRole('heading', { name: 'Pikachu' })).toBeInTheDocument();
  });
});

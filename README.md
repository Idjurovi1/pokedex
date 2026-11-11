# Pokédex

A fast, responsive Pokédex built with **React** and **Redux Toolkit**, using the free [PokéAPI](https://pokeapi.co).
Final open-ended portfolio project for the Codecademy Front-End Engineer career path.

## Features

- Browse all 1025 Pokémon with paging ("Load more")
- Filter by type (fire, water, grass…)
- Live search by name or number, plus direct lookup with the Search button (`pikachu`, `#25`)
- Detail view with artwork, types, height, weight, abilities and animated base-stat bars
- Favorites saved in the browser (localStorage)
- Error states with **Try again** / **Go back** buttons for failed or offline requests
- Loading skeletons, card animations and transitions (respects `prefers-reduced-motion`)
- Responsive layout from mobile to desktop, keyboard accessible (Esc closes the dialog)

## Tech

React 19 · Redux Toolkit · Vite · Vitest + Testing Library · Netlify

## Wireframe

```
+-----------------------------------------------------------+
| (o) Pokédex     [ Search name or #number… ][Search]  ★ Fav |
+-----------------------------------------------------------+
| [All] [Fire] [Water] [Grass] [Electric] ...               |
|                                                           |
| +-------+ +-------+ +-------+ +-------+ +-------+          |
| |  img  | |  img  | |  img  | |  img  | |  img  |          |
| | #0001 | | #0002 | | #0003 | | #0004 | | #0005 |          |
| | name ★| | name ★| | name ★| | name ★| | name ★|          |
| +-------+ +-------+ +-------+ +-------+ +-------+          |
|                     [ Load more ]                         |
+-----------------------------------------------------------+
Detail dialog: artwork | #, name, types, facts, stat bars, ★
```

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit + component tests
npm run build    # production build in dist/
```

## Future work

- Evolution chains and move lists
- Compare two Pokémon side by side
- Progressive Web App / offline cache

# playful Studio 1031

An interactive micro-learning studio for making difficult ideas memorable. Visitors choose a small learning “seed,” turn its ingredients into an odd little scene, then practice retrieving the key idea.

It is intentionally not a flashcard app: the experience makes elaboration and retrieval feel tactile, brief, and inviting. The included content is illustrative demo content for a portfolio presentation.

## Quick start

```bash
npm install
npm run dev
```

Open the local address Vite prints (normally `http://localhost:5173`).

```bash
npm test       # Node unit tests for the learning-scene helpers
npm run build  # production bundle in dist/
npm run preview
```

Node 20+ is recommended. The project has no required accounts, keys, database, or paid services.

## What’s inside

- A distinctive three-part learning ritual: **Notice → Make → Recall**.
- Three realistic sample learning seeds: photosynthesis, compound interest, and feedback loops.
- Interactive memory-scene building with clear selected states and a rotating local “studio coach.”
- Multiple recall questions with helpful empty, incorrect, and success states.
- Browser-local completion storage; the app remains useful if storage is unavailable and reports that limitation clearly.
- Keyboard support: `1`, `2`, and `3` switch stages; `N` picks the next seed; `Escape` resets the studio. All controls work with standard Tab/Enter/Space interaction.
- Responsive layouts, skip navigation, visible focus styles, semantic tabs/fieldset controls, reduced-motion support, and a friendly loading state.

## Architecture

This is a lightweight React + Vite single-page application. It keeps the product intentionally client-side because the core activity has no need for accounts or a backend.

```text
src/
  App.jsx             interface, activity state, keyboard behavior, local progress
  lib/studio.js       demo seed data + pure scene/coach helpers
  lib/studio.test.js  Node tests for the pure helpers
  styles.css          responsive visual system and animation
```

`SEEDS` in `src/lib/studio.js` is the small content model. Add a new seed there to extend the shelf: give it a question, a concise factual nugget, memory pieces, and a retrieval prompt/options.

## Demo mode and optional integrations

The “Local coach” is a deliberate demo-mode interaction, not an API call. It cycles through useful prompts entirely in the browser, so the experience works in every deployment without configuration.

`.env.example` reserves `VITE_STUDIO_COACH_ENDPOINT` for a future coach service, but the current app does not read it and never needs a key. If adding an external integration later, keep the local coach as the default fallback and do not expose secrets in `VITE_` variables.

## Representation and screenshot guidance

For the strongest portfolio capture:

1. Use a desktop viewport around **1440 × 1100** and capture the hero plus the top of the open studio. This shows the visual identity and clear product purpose.
2. Capture the **Make** stage after selecting 3–4 memory pieces. It best demonstrates the central interaction, coaching, and intentional empty/selected-state design.
3. At mobile width (about **390 px**), capture the horizontally scrollable seed shelf and the stacked workbench to demonstrate responsive craft.
4. The seed content and coaching are fictional demo representations; avoid presenting them as measured learning outcomes or customer claims.

## Deployment notes

`npm run build` produces a static `dist/` folder that can be deployed to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages with SPA fallback configuration, etc.). No server routes, environment variables, or runtime secrets are required.

For a subpath deployment, set Vite’s `base` option before building. Because state is stored in `localStorage`, users’ progress stays on the device/browser they use; it is not synced between devices.

## Validation

The shipped implementation is verified with:

```text
npm test       # 3 passing tests
npm run build  # successful production build
```

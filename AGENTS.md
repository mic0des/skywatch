# AGENTS.md

Project facts for any AI coding tool (Claude Code, Cursor, Codex, ...).

## What this is

**SkyWatch** is a small React app that shows a flight departures board for the fictional
"Hack the Skies International" airport. It exists to practice responsible agentic engineering,
so changes should be small, tested, and easy for a beginner to review.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start the dev server (Vite) and print a local URL
npm test           # run all tests once (Vitest + Testing Library, jsdom)
npm run test:watch # re-run tests on save
npm run build      # production build into dist/
npm run doctor     # check the workshop setup
```

Run a single test file: `npx vitest run src/components/DeparturesBoard.test.jsx`

## Stack

- React 19 with plain JavaScript (`.jsx`), no TypeScript
- Vite 8 for dev server and build
- Vitest 5 + `@testing-library/react` + `@testing-library/jest-dom` for tests; `globals: true`, setup in `src/setupTests.js`
- Plain CSS in `src/styles.css` (CSS variables at the top). No CSS framework.
- No router, no state library, no backend.

## Layout

```
src/
  main.jsx                       React entry point
  App.jsx                        loads departures and renders the board
  api/getDepartures.js           FAKE API: resolves data/departures.json after 1500 ms; { fail: true } rejects
  data/departures.json           the flight data
  components/DeparturesBoard.jsx the departures table (empty-state message when no flights)
  styles.css                     all styles
scripts/                         workshop helper scripts (plain Node, no deps) - see README
docs/plans/                      feature plans, one file per feature, chunked
workshop/                        handout, prompts, and requirements for students
```

## Conventions

- Tests live next to the code they test: `Thing.jsx` + `Thing.test.jsx`.
- Prefer Testing Library queries by role or visible text (`getByRole`, `findByText`) over test IDs.
- When testing timing, use `vi.useFakeTimers()` or mock `getDepartures` instead of waiting real seconds.
- Components are function components with hooks. Keep components small; put data-loading logic in hooks under `src/hooks/`.
- Accessibility matters: loading and error states should be announced (`role="status"` / `role="alert"`).
- Do not add dependencies without asking.

## Current known gaps

- `App.jsx` shows nothing while departures load (about 1.5 s of blank screen).
- If `getDepartures` rejects, the error is ignored and the user sees nothing.

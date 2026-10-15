# Feature: Loading screen

**Why:** Right now the app shows a blank page for about 1.5 seconds while departures load, so it looks broken. If loading fails, nothing happens at all.

**Done means:** While flights load you see a plane and "Fetching departures...". If loading fails you see a clear message and a Retry button that works.

## Chunk 1: LoadingScreen component
**Goal:** A reusable `LoadingScreen` component exists and looks good. It is not used by the app yet.

**Acceptance criteria**
- Shows the text "Fetching departures..."
- Uses `role="status"` so screen readers announce it
- Shows a plane animation that is hidden from screen readers (`aria-hidden`)
- The animation stops for users who turn on "reduce motion" in their OS settings (CSS only)

**Tests to write first**
- renders "Fetching departures..."
- has an element with role `status`
- accepts an optional `message` prop that replaces the default text

**Files likely touched**
- `src/components/LoadingScreen.jsx` (new)
- `src/components/LoadingScreen.test.jsx` (new)
- `src/styles.css`

**Out of scope**
- Using it in `App.jsx` (chunk 3)

## Chunk 2: useDepartures hook
**Goal:** Move data loading out of `App` into a hook that reports `loading`, `success`, or `error`, and can retry.

**Acceptance criteria**
- `useDepartures()` returns `{ status, flights, error, retry }`
- `status` starts as `'loading'`, becomes `'success'` with `flights` when the API resolves
- `status` becomes `'error'` with `error.message` when the API rejects
- calling `retry()` goes back to `'loading'` and calls the API again

**Tests to write first**
- starts in the loading state
- returns flights on success
- returns the error message on failure
- retry calls the API again and can recover from an error

**Files likely touched**
- `src/hooks/useDepartures.js` (new)
- `src/hooks/useDepartures.test.js` (new)

**Out of scope**
- Changing what `App` renders (chunk 3)

## Chunk 3: Show loading and error states in App
**Goal:** `App` uses `useDepartures` and `LoadingScreen`, so users never see a blank page.

**Acceptance criteria**
- While loading: `LoadingScreen` is shown
- On success: the departures board is shown and the loading screen is gone
- On error: a message with `role="alert"` and a "Retry" button are shown; clicking Retry tries again
- Visiting `/?fail` simulates an outage so a human can check the error state by hand

**Tests to write first**
- shows the loading screen first, then the board
- shows an error and a Retry button when loading fails
- clicking Retry loads the board

**Files likely touched**
- `src/App.jsx`
- `src/App.test.jsx`
- `src/styles.css`

**Out of scope**
- Auto-retry, real network calls

## Risks and open questions
- Timing-based tests can be flaky; mock `getDepartures` instead of waiting real seconds.
- React StrictMode runs effects twice in development; the hook must ignore results from a stale request.

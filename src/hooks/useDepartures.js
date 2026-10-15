import { useCallback, useEffect, useState } from 'react';
import { getDepartures } from '../api/getDepartures.js';

/**
 * Loads departures and tracks where we are:
 * status is 'loading', 'success', or 'error'. Call retry() to try again.
 */
export function useDepartures({ fail = false } = {}) {
  const [state, setState] = useState({ status: 'loading', flights: [], error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Ignore answers from an old request (StrictMode runs effects twice, and retry starts a new one).
    let stale = false;

    getDepartures({ fail })
      .then((flights) => {
        if (!stale) setState({ status: 'success', flights, error: null });
      })
      .catch((error) => {
        if (!stale) setState({ status: 'error', flights: [], error });
      });

    return () => {
      stale = true;
    };
  }, [fail, attempt]);

  const retry = useCallback(() => {
    setState({ status: 'loading', flights: [], error: null });
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}

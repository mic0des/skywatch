import DeparturesBoard from './components/DeparturesBoard.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import { useDepartures } from './hooks/useDepartures.js';

// Visit /?fail to see what an outage looks like.
const simulateOutage = new URLSearchParams(window.location.search).has('fail');

export default function App() {
  const { status, flights, error, retry } = useDepartures({ fail: simulateOutage });

  return (
    <main className="app">
      <header className="app__header">
        <h1>SkyWatch</h1>
        <p className="app__tagline">Live departures from Hack the Skies International</p>
      </header>

      {status === 'loading' && <LoadingScreen />}

      {status === 'error' && (
        <div className="error" role="alert">
          <p>{error.message}</p>
          <button type="button" onClick={retry}>
            Retry
          </button>
        </div>
      )}

      {status === 'success' && <DeparturesBoard flights={flights} />}
    </main>
  );
}

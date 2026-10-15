export default function LoadingScreen({ message = 'Fetching departures...' }) {
  return (
    <div className="loading" role="status">
      <div className="loading__sky" aria-hidden="true">
        <span className="loading__plane">✈</span>
      </div>
      <p className="loading__message">{message}</p>
    </div>
  );
}

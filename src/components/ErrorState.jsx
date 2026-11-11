export default function ErrorState({ message, onRetry, onBack }) {
  return (
    <div className="error" role="alert">
      <p className="error__title">Oops! Something went wrong.</p>
      <p>{message}</p>
      <div className="error__actions">
        {onRetry && (
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        )}
        {onBack && (
          <button type="button" className="secondary" onClick={onBack}>
            Go back
          </button>
        )}
      </div>
    </div>
  );
}


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function mountApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Could not find root element to mount to. Retrying in 100ms...");
    // Add a small delay and retry, as a fallback, though DOMContentLoaded should handle it.
    setTimeout(mountApp, 100);
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

if (document.readyState === 'loading') {
  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  // `DOMContentLoaded` has already fired
  mountApp();
}

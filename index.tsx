
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // Initialize i18next

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<div className="flex justify-center items-center h-screen text-white bg-gray-900">Loading translations...</div>}>
      <App />
    </React.Suspense>
  </React.StrictMode>
);
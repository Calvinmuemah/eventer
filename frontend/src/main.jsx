import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PostHogErrorBoundary, PostHogProvider } from 'posthog-js/react';
import App from './App';
import posthogClient from './posthog';
import './styles/global.css';

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {posthogClient ? (
      <PostHogProvider client={posthogClient}>
        <PostHogErrorBoundary>{app}</PostHogErrorBoundary>
      </PostHogProvider>
    ) : (
      app
    )}
  </React.StrictMode>
);

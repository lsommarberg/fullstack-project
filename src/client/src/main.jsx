import { Provider } from '@/components/ui/provider';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Router>
        <Provider>
          <App />
        </Provider>
      </Router>
    </React.StrictMode>,
  );
}

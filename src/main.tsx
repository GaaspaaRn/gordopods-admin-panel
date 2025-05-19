
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/responsiveHelper.css';
import { checkEnvironment } from './utils/debug';

// Verificar ambiente no carregamento da aplicação (apenas em DEV)
if (import.meta.env.DEV) {
  checkEnvironment().catch(console.error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

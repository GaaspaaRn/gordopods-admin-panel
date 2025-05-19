
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/responsiveHelper.css';
import { checkEnvironment, logger } from './utils/debug';

// Gerenciador de erros global para React 18+
// Ajuda a identificar erros não tratados
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  if (import.meta.env.DEV) {
    return (
      <React.StrictMode>
        {children}
      </React.StrictMode>
    );
  }
  return <>{children}</>;
};

// Verificar ambiente no carregamento da aplicação (apenas em DEV)
if (import.meta.env.DEV) {
  checkEnvironment().catch(err => 
    logger.error('Falha ao verificar ambiente', err)
  );
}

// Capturar erros não tratados
window.addEventListener('error', (event) => {
  logger.error('Erro não tratado:', event.error);
});

// Capturar rejeições de promessas não tratadas
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Promessa rejeitada não tratada:', event.reason);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

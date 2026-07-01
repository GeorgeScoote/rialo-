import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/App';
import { LangProvider } from '@i18n/LangContext';
import { AppProvider } from '@/state/AppContext';
import '@styles/index.css';

function Root() {
  return (
    <LangProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </LangProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);

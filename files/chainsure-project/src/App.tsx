import { useApp } from '@/state/AppContext';
import type { AppPage } from '@/lib/routes';
import { NavBar } from '@components/NavBar';
import { SiteFooter } from '@components/SiteFooter';
import { HomePage } from '@pages/HomePage';
import { PoliciesPage } from '@pages/PoliciesPage';
import { ClaimsPage } from '@pages/ClaimsPage';
import { WalletPage } from '@pages/WalletPage';
import { FONT_SANS, T } from '@/theme/tokens';
import type { ComponentType } from 'react';

const PAGE_VIEWS: Record<AppPage, ComponentType> = {
  home: HomePage,
  policies: PoliciesPage,
  claims: ClaimsPage,
  wallet: WalletPage,
};

export function App() {
  const { page } = useApp();
  const PageView = PAGE_VIEWS[page] ?? HomePage;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: T.bg, color: T.tx, fontFamily: FONT_SANS }}>
      <NavBar />
      <main className="app-main">
        <div key={page} className="page-transition">
          <PageView />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

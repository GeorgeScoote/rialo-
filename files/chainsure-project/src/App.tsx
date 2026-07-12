import { useApp } from '@/state/AppContext';
import { NavBar } from '@components/NavBar';
import { SiteFooter } from '@components/SiteFooter';
import { HomePage } from '@pages/HomePage';
import { PoliciesPage } from '@pages/PoliciesPage';
import { ClaimsPage } from '@pages/ClaimsPage';
import { WalletPage } from '@pages/WalletPage';
import { FONT_SANS, T } from '@/theme/tokens';

export function App() {
  const { page } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: T.bg, color: T.tx, fontFamily: FONT_SANS }}>
      <NavBar />
      <main style={{ flex: 1 }}>
        {page === 'home' && <HomePage />}
        {page === 'policies' && <PoliciesPage />}
        {page === 'claims' && <ClaimsPage />}
        {page === 'wallet' && <WalletPage />}
      </main>
      <SiteFooter />
    </div>
  );
}

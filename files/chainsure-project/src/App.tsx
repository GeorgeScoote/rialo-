import { useApp } from '@/state/AppContext';
import { NavBar } from '@components/NavBar';
import { HomePage } from '@pages/HomePage';
import { PoliciesPage } from '@pages/PoliciesPage';
import { ClaimsPage } from '@pages/ClaimsPage';
import { WalletPage } from '@pages/WalletPage';
import { FONT_SANS, T } from '@/theme/tokens';

export function App() {
  const { page } = useApp();

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.tx, fontFamily: FONT_SANS }}>
      <NavBar />
      {page === 'home' && <HomePage />}
      {page === 'policies' && <PoliciesPage />}
      {page === 'claims' && <ClaimsPage />}
      {page === 'wallet' && <WalletPage />}
    </div>
  );
}

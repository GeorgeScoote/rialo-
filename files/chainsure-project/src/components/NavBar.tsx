import { useState } from 'react';
import { useApp } from '@/state/AppContext';
import { useLang } from '@i18n/LangContext';
import { LANGS } from '@i18n/index';
import { shortAddr } from '@/lib/format';
import { Anim } from '@components/ui';
import { FONT_MONO, FONT_SANS, T } from '@/theme/tokens';

export function NavBar() {
  const { wallet, balance, page, setPage, connect, disconnect, loading } = useApp();
  const { lang, setLang, $ } = useLang();
  const [showLangMenu, setShowLangMenu] = useState(false);

  void disconnect;

  const navItems = [
    { id: 'home', labelKey: 'nav_insure', icon: '◈' },
    { id: 'policies', labelKey: 'nav_policies', icon: '◇' },
    { id: 'claims', labelKey: 'nav_claims', icon: '◆' },
    { id: 'wallet', labelKey: 'nav_wallet', icon: '○' },
  ];

  const goHome = () => {
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(6,10,20,0.85)',
        backdropFilter: 'blur(20px) saturate(1.2)',
        borderBottom: '1px solid ' + T.b,
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          height: 64,
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo + Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div
            role="button"
            tabIndex={0}
            aria-label="ChainSure Home"
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            onClick={goHome}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goHome();
              }
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #22d3ee 0%, #0e7490 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 800,
                color: '#0a0a0a',
                boxShadow: '0 4px 12px rgba(34,211,238,0.3)',
                letterSpacing: '-0.05em',
              }}
            >
              CS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: T.tx }}>ChainSure</span>
              <span style={{ fontSize: 10, color: T.gold, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{$('brand_sub')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 4, marginLeft: 16 }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: page === item.id ? '1px solid ' + T.goldBd : '1px solid transparent',
                  background: page === item.id ? T.goldBg : 'transparent',
                  color: page === item.id ? T.gold : T.tx3,
                  fontSize: 13,
                  fontWeight: page === item.id ? 600 : 500,
                  cursor: 'pointer',
                  fontFamily: FONT_SANS,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.01em',
                }}
              >
                <span style={{ opacity: page === item.id ? 1 : 0.5 }}>{item.icon}</span>
                {$(item.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Language + Wallet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              style={{
                height: 36,
                padding: '0 12px',
                borderRadius: 8,
                border: '1px solid ' + T.b,
                background: 'transparent',
                color: T.tx2,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: FONT_SANS,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{LANGS[lang]?.flag}</span>
              <span style={{ fontSize: 11 }}>{lang.toUpperCase()}</span>
            </button>
            {showLangMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  background: T.panel,
                  border: '1px solid ' + T.b,
                  borderRadius: 12,
                  padding: 6,
                  minWidth: 140,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  zIndex: 200,
                }}
              >
                {Object.values(LANGS).map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setShowLangMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: 'none',
                      background: lang === l.code ? T.goldBg : 'transparent',
                      color: lang === l.code ? T.gold : T.tx2,
                      fontSize: 13,
                      fontWeight: lang === l.code ? 600 : 400,
                      cursor: 'pointer',
                      fontFamily: FONT_SANS,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      textAlign: 'left',
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {wallet && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: T.goldBg,
                border: '1px solid ' + T.goldBd,
                borderRadius: 10,
              }}
            >
              <span style={{ fontSize: 15, fontFamily: FONT_MONO, fontWeight: 600, color: T.gold }}>
                <Anim value={balance} />
              </span>
              <span style={{ fontSize: 11, color: T.tx4, fontWeight: 500 }}>ETH</span>
            </div>
          )}

          <button
            onClick={wallet ? () => setPage('wallet') : connect}
            disabled={loading}
            style={{
              height: 40,
              padding: '0 20px',
              borderRadius: 10,
              border: '1px solid ' + (wallet ? T.successBd : T.b2),
              background: wallet ? T.successBg : 'rgba(255,255,255,0.03)',
              color: wallet ? T.success : T.tx2,
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer',
              fontFamily: FONT_SANS,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'all 0.2s ease',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: wallet ? T.success : T.tx4,
                boxShadow: wallet ? '0 0 8px ' + T.success : 'none',
              }}
            />
            {loading ? $('connecting') : wallet ? shortAddr(wallet) : $('connect_wallet')}
          </button>
        </div>
      </div>
    </nav>
  );
}

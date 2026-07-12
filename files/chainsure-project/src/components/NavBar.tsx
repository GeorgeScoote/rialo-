import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/state/AppContext';
import { useLang } from '@i18n/LangContext';
import { LANGS } from '@i18n/index';
import { shortAddr } from '@/lib/format';
import { Anim } from '@components/ui';
import { FONT_MONO, FONT_SANS, T } from '@/theme/tokens';

const MOBILE_NAV_MQ = '(max-width: 960px)';

export function NavBar() {
  const { wallet, balance, page, setPage, connect, disconnect, loading } = useApp();
  const { lang, setLang, $ } = useLang();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // 点击外部或按 Esc 关闭语言选择 / 移动端菜单
  useEffect(() => {
    if (!showLangMenu && !mobileMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (showLangMenu && langMenuRef.current && !langMenuRef.current.contains(target)) {
        setShowLangMenu(false);
      }
      if (
        mobileMenuOpen &&
        !mobileToggleRef.current?.contains(target) &&
        !mobilePanelRef.current?.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLangMenu(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showLangMenu, mobileMenuOpen]);

  // 切回桌面宽度时收起移动端菜单
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_NAV_MQ);
    const onChange = () => {
      if (!mq.matches) setMobileMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  void disconnect;

  const navItems = [
    { id: 'home', labelKey: 'nav_insure', icon: '◈' },
    { id: 'policies', labelKey: 'nav_policies', icon: '◇' },
    { id: 'claims', labelKey: 'nav_claims', icon: '◆' },
    { id: 'wallet', labelKey: 'nav_wallet', icon: '○' },
  ];

  const goHome = () => {
    setPage('home');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPage = (id: string) => {
    setPage(id);
    setMobileMenuOpen(false);
  };

  const renderNavButton = (item: (typeof navItems)[number], compact = false) => {
    const active = page === item.id;
    return (
      <button
        key={item.id}
        type="button"
        aria-current={active ? 'page' : undefined}
        onClick={() => goToPage(item.id)}
        style={{
          width: compact ? '100%' : undefined,
          padding: compact ? '14px 16px' : '10px 18px',
          borderRadius: 10,
          border: active ? '1px solid ' + T.goldBd : '1px solid transparent',
          background: active ? T.goldBg : 'transparent',
          color: active ? T.gold : T.tx3,
          fontSize: compact ? 14 : 13,
          fontWeight: active ? 600 : 500,
          cursor: 'pointer',
          fontFamily: FONT_SANS,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 0.2s ease',
          letterSpacing: '0.01em',
          textAlign: 'left',
        }}
      >
        <span style={{ opacity: active ? 1 : 0.5 }}>{item.icon}</span>
        {$(item.labelKey)}
      </button>
    );
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
        className="navbar-inner"
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
        {/* Logo + 桌面导航 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, minWidth: 0 }}>
          <div
            role="button"
            tabIndex={0}
            aria-label="ChainSure Home"
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', flexShrink: 0 }}
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
              <span className="navbar-brand-sub" style={{ fontSize: 10, color: T.gold, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {$('brand_sub')}
              </span>
            </div>
          </div>

          <div role="navigation" aria-label={$('footer_nav')} className="navbar-desktop-nav">
            {navItems.map((item) => renderNavButton(item))}
          </div>
        </div>

        {/* 右侧：语言 + 钱包 + 汉堡 */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div ref={langMenuRef} className="navbar-secondary" style={{ position: 'relative' }}>
            <button
              type="button"
              aria-expanded={showLangMenu}
              aria-haspopup="listbox"
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
              className="navbar-secondary"
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
            className={'navbar-wallet-btn' + (wallet ? ' is-connected' : '')}
            onClick={wallet ? () => goToPage('wallet') : connect}
            disabled={loading}
            aria-label={loading ? $('connecting') : wallet ? shortAddr(wallet) : $('connect_wallet')}
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
            <span className="navbar-wallet-label">
              {loading ? $('connecting') : wallet ? shortAddr(wallet) : $('connect_wallet')}
            </span>
          </button>

          <button
            ref={mobileToggleRef}
            type="button"
            className="navbar-mobile-toggle"
            aria-expanded={mobileMenuOpen}
            aria-controls="navbar-mobile-panel"
            aria-label={mobileMenuOpen ? $('nav_menu_close') : $('nav_menu_open')}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>
              {mobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          ref={mobilePanelRef}
          id="navbar-mobile-panel"
          role="navigation"
          aria-label={$('footer_nav')}
          className="navbar-mobile-panel"
        >
          {navItems.map((item) => renderNavButton(item, true))}
          <div className="navbar-mobile-panel-lang">
            {Object.values(LANGS).map((l) => (
              <button
                key={l.code}
                type="button"
                className={'navbar-mobile-panel-lang-btn' + (lang === l.code ? ' is-active' : '')}
                aria-pressed={lang === l.code}
                onClick={() => setLang(l.code)}
              >
                <span>{l.flag}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

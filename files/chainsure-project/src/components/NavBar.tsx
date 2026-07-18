import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/state/AppContext';
import { useLang } from '@i18n/LangContext';
import { LANGS } from '@i18n/index';
import { shortAddr } from '@/lib/format';
import { Anim } from '@components/ui';
import { FONT_MONO, FONT_SANS, T } from '@/theme/tokens';

const MOBILE_NAV_MQ = '(max-width: 960px)';

export function NavBar() {
  const { wallet, balance, page, setPage, connect, disconnect, loading, disconnecting } = useApp();
  const { lang, setLang, $ } = useLang();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const walletMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // 滚动时增强顶栏阴影，区分内容区
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 点击外部或按 Esc 关闭语言 / 钱包 / 移动端菜单
  useEffect(() => {
    if (!showLangMenu && !showWalletMenu && !mobileMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (showLangMenu && langMenuRef.current && !langMenuRef.current.contains(target)) {
        setShowLangMenu(false);
      }
      if (showWalletMenu && walletMenuRef.current && !walletMenuRef.current.contains(target)) {
        setShowWalletMenu(false);
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
        setShowWalletMenu(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showLangMenu, showWalletMenu, mobileMenuOpen]);

  // 切回桌面宽度时收起移动端菜单
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_NAV_MQ);
    const onChange = () => {
      if (!mq.matches) {
        setMobileMenuOpen(false);
        setShowWalletMenu(false);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isConnecting = loading && !wallet;
  const isWalletPage = page === 'wallet';

  const goToPage = (id: string) => {
    setPage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWallet = () => {
    if (isConnecting || !wallet) return;
    setShowWalletMenu(false);
    goToPage('wallet');
  };

  const handleDisconnect = async () => {
    if (disconnecting) return;
    setShowWalletMenu(false);
    setMobileMenuOpen(false);
    await disconnect();
    goToPage('home');
  };

  const handleWalletClick = () => {
    if (isConnecting || disconnecting) return;
    if (wallet) {
      setShowLangMenu(false);
      setShowWalletMenu((open) => !open);
    } else {
      connect();
    }
  };

  const walletBtnLabel = isConnecting
    ? $('connecting')
    : wallet
      ? `${shortAddr(wallet)} · ${$('connected')}`
      : $('connect_wallet');

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
    <nav className={'app-navbar' + (scrolled ? ' is-scrolled' : '')}>
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
              onClick={() => {
                setShowWalletMenu(false);
                setShowLangMenu(!showLangMenu);
              }}
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
              role="button"
              tabIndex={0}
              className="navbar-secondary navbar-balance-btn"
              aria-label={walletBtnLabel}
              title={walletBtnLabel}
              onClick={openWallet}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openWallet();
                }
              }}
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

          <div ref={walletMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className={
                'navbar-wallet-btn' +
                (wallet ? ' is-connected' : '') +
                (isConnecting ? ' is-connecting' : '') +
                (wallet && isWalletPage ? ' is-active' : '') +
                (wallet && showWalletMenu ? ' is-menu-open' : '')
              }
              onClick={handleWalletClick}
              disabled={isConnecting || disconnecting}
              aria-busy={isConnecting || disconnecting}
              aria-expanded={wallet ? showWalletMenu : undefined}
              aria-haspopup={wallet ? 'menu' : undefined}
              aria-current={wallet && isWalletPage ? 'page' : undefined}
              aria-label={walletBtnLabel}
              title={wallet ? walletBtnLabel : undefined}
              style={{
                height: 40,
                padding: '0 20px',
                borderRadius: 10,
                border: '1px solid ' + (wallet ? T.successBd : T.b2),
                background: wallet ? T.successBg : 'rgba(255,255,255,0.03)',
                color: wallet ? T.success : T.tx2,
                fontSize: 13,
                fontWeight: 600,
                cursor: isConnecting || disconnecting ? 'wait' : 'pointer',
                fontFamily: FONT_SANS,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.2s ease',
                opacity: isConnecting || disconnecting ? 0.55 : 1,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: isConnecting ? T.gold : wallet ? T.success : T.tx4,
                  boxShadow: isConnecting ? '0 0 8px ' + T.gold : wallet ? '0 0 8px ' + T.success : 'none',
                }}
              />
              <span className="navbar-wallet-label">
                {isConnecting ? $('connecting') : wallet ? shortAddr(wallet) : $('connect_wallet')}
              </span>
              {wallet && (
                <span className="navbar-wallet-chevron" aria-hidden style={{ fontSize: 10, opacity: 0.7 }}>
                  ▾
                </span>
              )}
            </button>
            {wallet && showWalletMenu && (
              <div className="navbar-wallet-menu" role="menu" aria-label={$('nav_wallet')}>
                <button
                  type="button"
                  role="menuitem"
                  className="navbar-wallet-menu-item"
                  onClick={openWallet}
                >
                  <span aria-hidden>○</span>
                  {$('nav_wallet_open')}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="navbar-wallet-menu-item is-danger"
                  disabled={disconnecting}
                  aria-busy={disconnecting}
                  onClick={() => void handleDisconnect()}
                >
                  <span aria-hidden>⏻</span>
                  {disconnecting ? $('disconnecting') : $('disconnect')}
                </button>
              </div>
            )}
          </div>

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
          {wallet && (
            <button
              type="button"
              className="navbar-mobile-disconnect"
              disabled={disconnecting}
              aria-busy={disconnecting}
              onClick={() => void handleDisconnect()}
            >
              {disconnecting ? $('disconnecting') : $('disconnect')}
            </button>
          )}
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

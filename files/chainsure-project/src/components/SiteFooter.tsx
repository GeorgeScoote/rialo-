import { useApp } from '@/state/AppContext';
import { useLang } from '@i18n/LangContext';
import { PROGRAM_ID } from '@/lib/constants';
import { FONT_MONO, FONT_SANS, T } from '@/theme/tokens';

export function SiteFooter() {
  const { setPage } = useApp();
  const { $ } = useLang();
  const year = new Date().getFullYear();

  const linkBtn = (label: string, page: string) => (
    <button
      type="button"
      onClick={() => setPage(page)}
      style={{
        border: 'none',
        background: 'transparent',
        color: T.tx3,
        fontSize: 13,
        cursor: 'pointer',
        fontFamily: FONT_SANS,
        padding: '4px 0',
        textAlign: 'left',
        transition: 'color 0.15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = T.gold; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = T.tx3; }}
    >
      {label}
    </button>
  );

  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid ' + T.b,
        background: 'linear-gradient(180deg, rgba(6,10,20,0.4) 0%, rgba(6,10,20,0.95) 100%)',
      }}
    >
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.35), transparent)' }} />

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '40px 32px 28px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32,
            marginBottom: 32,
          }}
        >
          {/* 品牌 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #22d3ee 0%, #0e7490 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#0a0a0a',
                  boxShadow: '0 2px 10px rgba(34,211,238,0.25)',
                }}
              >
                CS
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.tx, letterSpacing: '-0.02em' }}>ChainSure</div>
                <div style={{ fontSize: 10, color: T.gold, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{$('brand_sub')}</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: T.tx3, lineHeight: 1.65, maxWidth: 280, margin: 0 }}>
              {$('footer_tagline')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              {[$('footer_badge_onchain'), $('footer_badge_oracle'), $('footer_badge_demo')].map((badge) => (
                <span
                  key={badge}
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: T.goldBg,
                    border: '1px solid ' + T.goldBd,
                    color: T.gold,
                    letterSpacing: '0.03em',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* 导航 */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.tx4, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              {$('footer_nav')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {linkBtn($('nav_insure'), 'home')}
              {linkBtn($('nav_policies'), 'policies')}
              {linkBtn($('nav_claims'), 'claims')}
              {linkBtn($('nav_wallet'), 'wallet')}
            </div>
          </div>

          {/* 协议信息 */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.tx4, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              {$('footer_protocol')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: T.tx4, marginBottom: 4 }}>Program ID</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: T.tx3, wordBreak: 'break-all', lineHeight: 1.5 }}>
                  {PROGRAM_ID.slice(0, 16)}…{PROGRAM_ID.slice(-8)}
                </div>
              </div>
              <div style={{ fontSize: 12, color: T.tx4, lineHeight: 1.6 }}>
                {$('footer_powered')}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: 12, color: T.tx4 }}>{$('footer_copyright', { year })}</span>
          <span style={{ fontSize: 11, color: T.tx4 }}>{$('footer_demo')}</span>
        </div>
      </div>
    </footer>
  );
}

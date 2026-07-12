import { useState, type CSSProperties } from 'react';
import { useLang } from '@i18n/LangContext';
import { Badge } from '@components/ui';
import { FONT_MONO, FONT_SANS, T } from '@/theme/tokens';

const PANEL: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: 20,
  borderRadius: 12,
  background: 'rgba(17,27,48,0.9)',
  border: '1px solid ' + T.b,
  minHeight: 0,
};

const COL_LABEL: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: T.tx4,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 12,
};

export function NFTMintSection() {
  const { $ } = useLang();
  const [notified, setNotified] = useState(false);

  const nfts = [
    { id: 1, name: 'ChainSure #001', rarityKey: 'nft_rarity_legendary', rarityColor: '#22d3ee', emoji: '✈️', descKey: 'nft_sample_flight' },
    { id: 2, name: 'ChainSure #042', rarityKey: 'nft_rarity_epic', rarityColor: '#a855f7', emoji: '🌐', descKey: 'nft_sample_multi' },
    { id: 3, name: 'ChainSure #128', rarityKey: 'nft_rarity_rare', rarityColor: '#3b82f6', emoji: '🛡️', descKey: 'nft_sample_shield' },
  ] as const;

  const progress = [
    { labelKey: 'nft_progress_contract', pct: 65, color: '#a855f7' },
    { labelKey: 'nft_progress_mint_ui', pct: 40, color: '#22d3ee' },
    { labelKey: 'nft_progress_metadata', pct: 30, color: '#3b82f6' },
    { labelKey: 'nft_progress_market', pct: 10, color: '#10b981' },
  ];

  const features = [
    { icon: '🔗', labelKey: 'nft_feature1' },
    { icon: '💱', labelKey: 'nft_feature2' },
    { icon: '💎', labelKey: 'nft_feature3' },
    { icon: '👑', labelKey: 'nft_feature4' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* 标题栏：标题与徽章紧凑排列 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
          padding: '16px 20px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(10,16,30,0.98) 100%)',
          border: '1px solid rgba(168,85,247,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 220px', minWidth: 0 }}>
          <span style={{ fontSize: 26, lineHeight: 1 }}>🎨</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#c084fc' }}>{$('nft_title')}</div>
            <div style={{ fontSize: 12, color: T.tx4, marginTop: 4, lineHeight: 1.5 }}>{$('nft_collection_desc')}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, flexShrink: 0 }}>
          <Badge variant="warning">🚧 {$('nft_dev_badge')}</Badge>
          <span
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(168,85,247,0.1)',
              border: '1px solid rgba(168,85,247,0.25)',
              fontSize: 12,
              color: '#c084fc',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {$('nft_total_supply')}
          </span>
        </div>
      </div>

      {/* 三列等高布局 */}
      <div
        className="nft-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 16,
          alignItems: 'stretch',
        }}
      >
        {/* 预览 */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 360 }}>
          <div style={COL_LABEL}>{$('nft_preview')}</div>
          <div style={{ ...PANEL, gap: 10, justifyContent: 'flex-start' }}>
            {nfts.map((nft) => (
              <div
                key={nft.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: `radial-gradient(circle at 40% 40%, ${nft.rarityColor}33, transparent 70%), linear-gradient(135deg, ${nft.rarityColor}18, #060a14)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    border: '1px solid ' + nft.rarityColor + '30',
                  }}
                >
                  {nft.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, color: T.tx, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {nft.name}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                        flexShrink: 0,
                        background: nft.rarityColor + '18',
                        color: nft.rarityColor,
                        border: '1px solid ' + nft.rarityColor + '35',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {$(nft.rarityKey)}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: T.tx4, marginTop: 4 }}>{$(nft.descKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 开发进度 */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 360 }}>
          <div style={COL_LABEL}>{$('nft_dev_progress')}</div>
          <div style={{ ...PANEL, gap: 16, justifyContent: 'center' }}>
            {progress.map((item, i) => (
              <div key={item.labelKey} style={{ marginBottom: i === progress.length - 1 ? 0 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: T.tx3 }}>{$(item.labelKey)}</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 12, fontWeight: 600, color: item.color }}>{item.pct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: item.pct + '%',
                      background: `linear-gradient(90deg, ${item.color}99, ${item.color})`,
                      borderRadius: 6,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 功能 + 操作：合并为单卡片 */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 360 }}>
          <div style={COL_LABEL}>{$('nft_core_features')}</div>
          <div style={{ ...PANEL, padding: 0, overflow: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {features.map((f, i) => (
                <div
                  key={f.labelKey}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 18px',
                    borderBottom: '1px solid ' + T.b,
                  }}
                >
                  <span style={{ fontSize: 17, width: 22, textAlign: 'center', flexShrink: 0 }}>{f.icon}</span>
                  <span style={{ fontSize: 13, color: T.tx2, lineHeight: 1.4 }}>{$(f.labelKey)}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 'auto',
                padding: 16,
                borderTop: '1px solid ' + T.b,
                background: 'rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: notified ? T.successBg : 'rgba(168,85,247,0.06)',
                  border: '1px solid ' + (notified ? T.successBd : 'rgba(168,85,247,0.2)'),
                  textAlign: 'center',
                }}
              >
                {notified ? (
                  <div style={{ fontSize: 13, color: T.success, fontWeight: 600 }}>✅ {$('nft_notify_sent')}</div>
                ) : (
                  <>
                    <div style={{ fontSize: 12, color: T.tx3, marginBottom: 10 }}>🔔 {$('nft_notify_me')}</div>
                    <button
                      type="button"
                      onClick={() => setNotified(true)}
                      style={{
                        width: '100%',
                        height: 36,
                        borderRadius: 8,
                        background: 'rgba(168,85,247,0.15)',
                        border: '1px solid rgba(168,85,247,0.3)',
                        color: '#c084fc',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: FONT_SANS,
                      }}
                    >
                      {$('nft_register_now')}
                    </button>
                  </>
                )}
              </div>

              <button
                type="button"
                disabled
                style={{
                  width: '100%',
                  height: 42,
                  borderRadius: 10,
                  background: 'rgba(168,85,247,0.08)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  color: 'rgba(192,132,252,0.45)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'not-allowed',
                  fontFamily: FONT_SANS,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span>🔒</span> {$('nft_mint_locked')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

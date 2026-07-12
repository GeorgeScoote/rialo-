import { useState, type CSSProperties } from 'react';
import { useLang } from '@i18n/LangContext';
import { Badge } from '@components/ui';
import { FONT_MONO, FONT_SANS, T } from '@/theme/tokens';

const COL_LABEL: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: T.tx4,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 10,
};

const PANEL: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  background: 'rgba(17,27,48,0.9)',
  border: '1px solid ' + T.b,
  overflow: 'hidden',
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
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          padding: '14px 18px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(10,16,30,0.98) 100%)',
          border: '1px solid rgba(168,85,247,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 200px', minWidth: 0 }}>
          <span style={{ fontSize: 24 }}>🎨</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#c084fc' }}>{$('nft_title')}</div>
            <div style={{ fontSize: 12, color: T.tx4, marginTop: 3 }}>{$('nft_collection_desc')}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Badge variant="warning">🚧 {$('nft_dev_badge')}</Badge>
          <span style={{ padding: '5px 11px', borderRadius: 8, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', fontSize: 12, color: '#c084fc', fontWeight: 600 }}>
            {$('nft_total_supply')}
          </span>
        </div>
      </div>

      <div className="nft-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14, alignItems: 'stretch' }}>
        {/* 预览：三卡均分高度 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={COL_LABEL}>{$('nft_preview')}</div>
          <div style={{ ...PANEL, padding: 10, gap: 8 }}>
            {nfts.map((nft) => (
              <div
                key={nft.id}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '0 14px',
                  minHeight: 72,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, color: T.tx }}>{nft.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, flexShrink: 0, background: nft.rarityColor + '18', color: nft.rarityColor, border: '1px solid ' + nft.rarityColor + '35' }}>
                      {$(nft.rarityKey)}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: T.tx4, marginTop: 4 }}>{$(nft.descKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 进度：四项均分，进度条加粗 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={COL_LABEL}>{$('nft_dev_progress')}</div>
          <div style={{ ...PANEL, padding: '12px 16px', gap: 0 }}>
            {progress.map((item, i) => (
              <div
                key={item.labelKey}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '8px 0',
                  borderBottom: i < progress.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: T.tx2 }}>{$(item.labelKey)}</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 600, color: item.color }}>{item.pct}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 8, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: item.pct + '%', background: `linear-gradient(90deg, ${item.color}99, ${item.color})`, borderRadius: 8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 功能 + 操作：行均分 + 底部按钮 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={COL_LABEL}>{$('nft_core_features')}</div>
          <div style={PANEL}>
            {features.map((f, i) => (
              <div
                key={f.labelKey}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '0 16px',
                  minHeight: 52,
                  borderBottom: '1px solid ' + T.b,
                }}
              >
                <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{f.icon}</span>
                <span style={{ fontSize: 13, color: T.tx2 }}>{$(f.labelKey)}</span>
              </div>
            ))}

            <div style={{ padding: 14, borderTop: '1px solid ' + T.b, background: 'rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
              <div style={{ padding: '10px 12px', borderRadius: 10, background: notified ? T.successBg : 'rgba(168,85,247,0.06)', border: '1px solid ' + (notified ? T.successBd : 'rgba(168,85,247,0.2)'), textAlign: 'center' }}>
                {notified ? (
                  <div style={{ fontSize: 13, color: T.success, fontWeight: 600 }}>✅ {$('nft_notify_sent')}</div>
                ) : (
                  <>
                    <div style={{ fontSize: 12, color: T.tx3, marginBottom: 8 }}>🔔 {$('nft_notify_me')}</div>
                    <button
                      type="button"
                      onClick={() => setNotified(true)}
                      style={{ width: '100%', height: 34, borderRadius: 8, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT_SANS }}
                    >
                      {$('nft_register_now')}
                    </button>
                  </>
                )}
              </div>
              <button
                type="button"
                disabled
                style={{ width: '100%', height: 38, borderRadius: 8, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', color: 'rgba(192,132,252,0.45)', fontSize: 12, fontWeight: 600, cursor: 'not-allowed', fontFamily: FONT_SANS, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
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

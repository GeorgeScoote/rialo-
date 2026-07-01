import { useState } from 'react';
import { useLang } from '@i18n/LangContext';
import { Badge } from '@components/ui';
import { FONT_MONO, FONT_SANS, T } from '@/theme/tokens';

export function NFTMintSection() {
  const { $ } = useLang();
  const [notified, setNotified] = useState(false);

  const nfts = [
    { id: 1, name: 'ChainSure #001', rarity: 'Legendary', rarityColor: '#22d3ee', emoji: '✈️', desc: 'Flight · Cyan Tier' },
    { id: 2, name: 'ChainSure #042', rarity: 'Epic', rarityColor: '#a855f7', emoji: '🌐', desc: 'Multi-Chain · Purple' },
    { id: 3, name: 'ChainSure #128', rarity: 'Rare', rarityColor: '#3b82f6', emoji: '🛡️', desc: 'Shield · Blue Tier' },
  ];

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
      {/* 顶部标题栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
          padding: '18px 24px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(10,16,30,0.98) 100%)',
          border: '1px solid rgba(168,85,247,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 28 }}>🎨</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#c084fc' }}>ChainSure NFT Mint</div>
            <div style={{ fontSize: 12, color: T.tx4, marginTop: 2 }}>{$('nft_collection_desc')}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Badge variant="warning">🚧 {$('nft_dev_badge')}</Badge>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              background: 'rgba(168,85,247,0.1)',
              border: '1px solid rgba(168,85,247,0.25)',
              fontSize: 12,
              color: '#c084fc',
              fontWeight: 600,
            }}
          >
            {$('nft_total_supply')}
          </div>
        </div>
      </div>

      {/* 主体三列 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* 列1: NFT 预览卡 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.tx4, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{$('nft_preview')}</div>
          {nfts.map((nft) => (
            <div
              key={nft.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(17,27,48,0.9)',
                border: '1px solid ' + T.b,
                transition: 'border-color 0.2s',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: `radial-gradient(circle at 40% 40%, ${nft.rarityColor}33, transparent 70%), linear-gradient(135deg, ${nft.rarityColor}18, #060a14)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  border: '1px solid ' + nft.rarityColor + '30',
                }}
              >
                {nft.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, color: T.tx }}>{nft.name}</span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 4,
                      flexShrink: 0,
                      background: nft.rarityColor + '18',
                      color: nft.rarityColor,
                      border: '1px solid ' + nft.rarityColor + '35',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {nft.rarity}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: T.tx4, marginTop: 3 }}>{nft.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 列2: 开发进度 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.tx4, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>{$('nft_dev_progress')}</div>
          <div
            style={{
              flex: 1,
              padding: '20px',
              borderRadius: 12,
              background: 'rgba(17,27,48,0.9)',
              border: '1px solid ' + T.b,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {progress.map((item) => (
              <div key={item.labelKey}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                  <span style={{ fontSize: 12, color: T.tx3 }}>{$(item.labelKey)}</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 12, fontWeight: 600, color: item.color }}>{item.pct}%</span>
                </div>
                <div style={{ height: 5, borderRadius: 5, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', marginBottom: 18 }}>
                  <div
                    style={{
                      height: '100%',
                      width: item.pct + '%',
                      background: `linear-gradient(90deg, ${item.color}99, ${item.color})`,
                      borderRadius: 5,
                      transition: 'width 1.2s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 列3: 功能 + 提醒 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.tx4, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{$('nft_core_features')}</div>
          <div style={{ borderRadius: 12, background: 'rgba(17,27,48,0.9)', border: '1px solid ' + T.b, overflow: 'hidden' }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '13px 16px',
                  borderBottom: i < features.length - 1 ? '1px solid ' + T.b : 'none',
                }}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{f.icon}</span>
                <span style={{ fontSize: 13, color: T.tx2 }}>{$(f.labelKey)}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: 12,
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
            disabled
            style={{
              width: '100%',
              height: 44,
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
  );
}

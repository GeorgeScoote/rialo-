import { useApp } from '@/state/AppContext';
import { useLang } from '@i18n/LangContext';
import { KELVIN_PER_ETH } from '@/lib/constants';
import { n, shortSig } from '@/lib/format';
import { Anim, Badge, Button, Card, Empty, Stat } from '@components/ui';
import { FONT_MONO, T } from '@/theme/tokens';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function WalletPage() {
  const { wallet, balance, txHistory, connect, disconnect, loading, disconnecting } = useApp();
  const { $ } = useLang();

  if (!wallet) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '32px 24px' }}>
        <Card style={{ textAlign: 'center', padding: '48px 32px' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>👛</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{$('connect_wallet')}</h2>
          <p style={{ fontSize: 14, color: T.tx3, marginBottom: 24 }}>Rialo Wallet → ChainSure</p>
          <Button onClick={connect} disabled={loading} size="lg">
            {loading ? $('connecting') : $('connect_wallet')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24 }}>{$('wallet_title')}</h1>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Stat label={$('balance')} value={<Anim value={balance} />} sub="ETH" />
          <Badge variant="success">{$('connected')}</Badge>
        </div>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid ' + T.b }}>
          <div style={{ fontSize: 11, color: T.tx4, marginBottom: 6 }}>{$('address')}</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: T.tx2, wordBreak: 'break-all' }}>{wallet}</div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <Button onClick={disconnect} disabled={loading || disconnecting} variant="danger" size="sm">
            {disconnecting ? $('disconnecting') : $('disconnect')}
          </Button>
        </div>
      </Card>

      <div style={{ fontSize: 12, fontWeight: 600, color: T.tx4, textTransform: 'uppercase', marginBottom: 12 }}>{$('tx_history')}</div>
      {txHistory.length === 0 ? (
        <Card>
          <Empty icon="📝" title={$('no_tx')} />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {txHistory.map((tx, i) => {
            let desc = '';
            if (tx.type === 'connect') desc = $('tx_connect');
            else if (tx.type === 'disconnect') desc = $('tx_disconnect');
            else if (tx.type === 'purchase') desc = $('tx_purchase', { flight: tx.flightIata || '' });
            else if (tx.type === 'demo_purchase') desc = $('demo_purchased', { flight: tx.flightIata || '' });
            else if (tx.type === 'claim') desc = $('tx_claim', { flight: tx.flightIata || '', min: tx.delayMin || 0 });
            else if (tx.type === 'expire') desc = $('tx_expire', { flight: tx.flightIata || '', min: tx.delayMin || 0 });
            else if (tx.type === 'wc_purchase' || tx.type === 'wc_claim' || tx.type === 'wc_expire') desc = tx.desc || tx.type;
            else desc = tx.desc || tx.type;

            return (
              <Card key={i} style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20 }}>
                      {tx.type === 'connect'
                        ? '🔗'
                        : tx.type === 'disconnect'
                          ? '🔌'
                          : tx.type === 'purchase' || tx.type === 'demo_purchase' || tx.type === 'wc_purchase'
                            ? '🛡️'
                            : tx.type === 'claim' || tx.type === 'wc_claim'
                              ? '💰'
                              : '📋'}
                    </span>
                    <div>
                      <div style={{ fontSize: 13, color: T.tx }}>{desc}</div>
                      <div style={{ fontSize: 11, color: T.tx4, marginTop: 2 }}>
                        {new Date(tx.time).toLocaleString()}
                        {tx.signature && <span style={{ marginLeft: 8, fontFamily: FONT_MONO }}>{shortSig(tx.signature)}</span>}
                      </div>
                    </div>
                  </div>
                  {tx.amount !== undefined && tx.amount !== 0 && (
                    <div style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 600, color: tx.amount > 0 ? T.gold : T.error }}>
                      {tx.amount > 0 ? '+' : ''}
                      {n(tx.amount)} ETH
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 24, padding: '16px', background: T.raised, borderRadius: 10, fontSize: 12, color: T.tx4, textAlign: 'center' }}>ChainSure</div>
    </div>
  );
}

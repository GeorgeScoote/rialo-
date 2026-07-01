import { useApp } from '@/state/AppContext';
import { useLang } from '@i18n/LangContext';
import { KELVIN_PER_ETH } from '@/lib/constants';
import { n, shortSig } from '@/lib/format';
import { Badge, Button, Card, Empty, Stat } from '@components/ui';
import { FONT_MONO, T } from '@/theme/tokens';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function ClaimsPage() {
  const { wallet, claims, setPage } = useApp();
  const { $ } = useLang();

  if (!wallet) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        <Card>
          <Empty icon="🔒" title={$('connect_first')} />
        </Card>
      </div>
    );
  }

  const totalClaimed = claims.reduce((sum: number, c: any) => sum + Number(c.amount / KELVIN_PER_ETH), 0);
  const wcClaims = claims.filter((c: any) => c.type === 'worldcup');
  const flightClaims = claims.filter((c: any) => c.type !== 'worldcup');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24 }}>{$('claims_title')}</h1>

      {claims.length === 0 ? (
        <Card>
          <Empty icon="💰" title={$('no_claims')} desc={$('no_claims_desc_full', { threshold: 120 })} action={<Button onClick={() => setPage('home')}>{$('go_insure')}</Button>} />
        </Card>
      ) : (
        <>
          <Card style={{ marginBottom: 24, background: T.goldBg, border: '1px solid ' + T.goldBd }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stat label={$('total_claimed')} value={`+${n(totalClaimed)}`} sub="ETH" color={T.gold} />
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: T.tx4, marginBottom: 4 }}>✈️ 航班</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700 }}>{flightClaims.length}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: T.tx4, marginBottom: 4 }}>⚽ 世界杯</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700 }}>{wcClaims.length}</div>
                </div>
                <div style={{ fontSize: 40, opacity: 0.25, alignSelf: 'center' }}>💰</div>
              </div>
            </div>
          </Card>

          <div style={{ fontSize: 12, fontWeight: 600, color: T.tx4, textTransform: 'uppercase', marginBottom: 12 }}>{$('claim_details')} ({claims.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {claims.map((c: any) => {
              const amountETH = Number(c.amount / KELVIN_PER_ETH);
              return (
                <Card key={c.address}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {c.type === 'worldcup' ? <span style={{ fontSize: 22 }}>{c.wcTeam?.flag}</span> : null}
                        <span style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 700 }}>{c.type === 'worldcup' ? c.wcTeam?.name : c.policy.split('_')[2]}</span>
                        {c.type === 'worldcup' ? (
                          <Badge variant="warning">⚽ {$('product_worldcup')} · {c.wcResultScore || $('worldcup_win_short')}</Badge>
                        ) : (
                          <Badge variant="warning">{$('delay_min', { min: c.delayMinutes })}</Badge>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: T.tx4, marginTop: 6 }}>{new Date(c.timestamp).toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: 700, color: T.gold }}>+{n(amountETH)}</div>
                      <div style={{ fontSize: 11, color: T.tx4 }}>ETH</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 11, color: T.tx4, fontFamily: FONT_MONO }}>TX: {shortSig(c.transferSignature)}</div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

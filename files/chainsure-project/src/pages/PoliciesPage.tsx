import { useState } from 'react';
import { useApp } from '@/state/AppContext';
import { useLang } from '@i18n/LangContext';
import { DELAY_THRESHOLD, KELVIN_PER_ETH, PolicyStatus } from '@/lib/constants';
import { n, sleep } from '@/lib/format';
import { Badge, Button, Card, Empty } from '@components/ui';
import { FONT_MONO, T } from '@/theme/tokens';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function PoliciesPage() {
  const { wallet, policies, settlePolicy, settleWCPolicy, setPage, addDemoPolicy, connect } = useApp();
  const { $ } = useLang();
  const [settling, setSettling] = useState<string | null>(null);
  const [settleStep, setSettleStep] = useState(0);
  const [settleMsg, setSettleMsg] = useState('');
  const [settleResult, setSettleResult] = useState<any>(null);

  const today = new Date().toISOString().split('T')[0];

  const handleDemoWithConnect = async () => {
    await connect();
    setTimeout(async () => {
      const demoPolicy = addDemoPolicy();
      if (demoPolicy) {
        await sleep(500);
        handleSettle(demoPolicy);
      }
    }, 500);
  };

  const handleDemo = async () => {
    const demoPolicy = addDemoPolicy();
    if (demoPolicy) {
      await sleep(500);
      handleSettle(demoPolicy);
    }
  };

  const handleSettle = async (policy: any) => {
    setSettling(policy.address);
    setSettleStep(0);
    setSettleMsg('');
    setSettleResult(null);

    try {
      if (policy.type === 'worldcup') {
        await settleWCPolicy(policy, (msg) => {
          setSettleStep((s) => Math.min(s + 1, 5));
          setSettleMsg(msg);
        });
        // settleWCPolicy 自身管理状态；这里给一个占位结果
        setSettleResult({ hit: true, delayed: 0, wcResult: '' });
      } else {
        const result = await settlePolicy(
          policy,
          (step, msg) => {
            setSettleStep(step);
            setSettleMsg(msg);
          },
          $
        );
        setSettleResult(result);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }

    // 让用户充分看到高级流程结果（更长时间）
    setTimeout(() => {
      setSettling(null);
      setSettleStep(0);
      setSettleMsg('');
      setSettleResult(null);
    }, 6200);
  };

  const SettleModal = () => {
    if (!settling) return null;

    // 高级专业赔付流程（更多步骤 + 更慢的节奏）
    const steps = [
      { num: 1, label: $('step_request') },
      { num: 2, label: $('step_query') },
      { num: 3, label: $('step_cross_verify') },
      { num: 4, label: $('step_proof_gen') },
      { num: 5, label: $('step_execute') },
      { num: 6, label: $('step_complete') },
    ];

    const progress = Math.min(100, Math.round((settleStep / steps.length) * 100));

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <div style={{
          background: T.card,
          border: '1px solid ' + T.b2,
          borderRadius: 22,
          padding: '32px 36px',
          width: 'min(560px, 94vw)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.65)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>{settleResult ? (settleResult.hit ? '✅' : '📋') : '🔗'}</div>
            <h3 style={{ fontSize: 19, fontWeight: 700, color: T.tx, letterSpacing: '-0.01em' }}>
              {settleResult ? (settleResult.hit ? $('settle_title_success') : $('settle_title_done')) : $('settle_title_processing')}
            </h3>
            <div style={{ fontSize: 12, color: T.tx4, marginTop: 4 }}>ChainSure • On-chain Oracle Settlement</div>
          </div>

          {/* 进度条 */}
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 999, marginBottom: 18, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(to right, ' + T.gold + ', #fff)', transition: 'width .4s ease' }} />
          </div>

          {/* 步骤指示器 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
            {steps.map((s) => (
              <div key={s.num} style={{ textAlign: 'center', flex: 1 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: settleStep >= s.num ? T.gold : T.raised,
                    color: settleStep >= s.num ? '#000' : T.tx4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    margin: '0 auto 5px',
                    border: settleStep === s.num ? '2px solid ' + T.goldBd : 'none',
                    transition: 'all .25s ease',
                  }}
                >
                  {settleStep > s.num ? '✓' : s.num}
                </div>
                <div style={{ fontSize: 10, color: settleStep >= s.num ? T.tx2 : T.tx4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* 当前消息 + 模拟日志区 */}
          <div style={{
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid ' + T.b2,
            borderRadius: 12,
            padding: '14px 16px',
            fontSize: 13,
            color: T.tx2,
            minHeight: 64,
            marginBottom: 16,
            fontFamily: FONT_MONO,
            whiteSpace: 'pre-wrap',
          }}>
            {settleMsg || $('settle_preparing')}
            {settleStep >= 2 && <div style={{ marginTop: 8, fontSize: 11, opacity: .6 }}>tx: 0x{Array.from({length:8}).map(()=>Math.floor(Math.random()*16).toString(16)).join('')}...</div>}
          </div>

          {/* 结果展示 */}
          {settleResult && (
            <div style={{ marginTop: 8, padding: '18px 20px', background: settleResult.hit ? T.successBg : T.warnBg, border: '1px solid ' + (settleResult.hit ? T.successBd : T.warnBd), borderRadius: 14, textAlign: 'center' }}>
              {settleResult.wcResult ? (
                <>
                  <div style={{ fontSize: 12, color: settleResult.hit ? T.success : T.warn, marginBottom: 4 }}>⚽ {$('worldcup_result')}：{settleResult.wcResult || '—'}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: settleResult.hit ? T.success : T.tx2 }}>{settleResult.hit ? $('worldcup_claim_success') : $('worldcup_claim_fail')}</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 12, color: settleResult.hit ? T.success : T.warn, marginBottom: 6 }}>
                    {$('delay_min', { min: settleResult.delayed })} {settleResult.hit ? '≥' : '<'} {DELAY_THRESHOLD} min
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: settleResult.hit ? T.success : T.tx2 }}>{settleResult.hit ? $('settle_condition_met') : $('settle_condition_not_met')}</div>
                  {settleResult.hit && settleResult.signature && (
                    <div style={{ marginTop: 8, fontSize: 11, color: T.tx3, fontFamily: FONT_MONO }}>sig: {settleResult.signature.slice(0, 18)}...</div>
                  )}
                </>
              )}
            </div>
          )}

          <div style={{ marginTop: 14, fontSize: 11, textAlign: 'center', color: T.tx4 }}>
            {settleResult ? $('settle_done_onchain') : $('settle_waiting_oracles')}
          </div>
        </div>
      </div>
    );
  };

  const DemoEntryCard = () => (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <Card style={{ textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎬</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: T.tx }}>{$('demo_title')}</h2>
        <p style={{ fontSize: 14, color: T.tx3, marginBottom: 28, lineHeight: 1.7 }}>
          {$('demo_desc')}
          <br />
          {$('demo_desc2')}
        </p>
        <Button onClick={handleDemoWithConnect} size="lg" style={{ padding: '0 32px' }}>
          🚀 {$('demo_start')}
        </Button>
      </Card>
    </div>
  );

  if (!wallet) return <DemoEntryCard />;

  const active = policies.filter((p: any) => p.status === PolicyStatus.Active);
  const history = policies.filter((p: any) => p.status !== PolicyStatus.Active);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <SettleModal />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>{$('my_policies')}</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Button
            onClick={handleDemo}
            variant="ghost"
            size="sm"
            style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(8,145,178,0.1) 100%)', border: '1px solid ' + T.goldBd }}
          >
            🎬 {$('demo_btn')}
          </Button>
          <Badge>{$('policies_count', { count: policies.length })}</Badge>
        </div>
      </div>

      {policies.length === 0 ? (
        <Card>
          <Empty
            icon="📋"
            title={$('no_policies')}
            desc={$('no_policies_desc')}
            action={
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <Button onClick={() => setPage('home')}>{$('go_insure')}</Button>
                <Button onClick={handleDemo} variant="ghost">
                  🎬 {$('demo_start')}
                </Button>
              </div>
            }
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {active.length > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.tx4, textTransform: 'uppercase' }}>{$('active_policies')} ({active.length})</div>
              {active.map((p: any) => {
                const canSettle = p.date <= today;
                const isSettling = settling === p.address;
                const payoutETH = Number(p.payoutAmount / KELVIN_PER_ETH);
                return (
                  <Card key={p.address}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {p.type === 'worldcup' ? (
                            <span style={{ fontSize: 22 }}>{p.wcTeam?.flag}</span>
                          ) : (
                            <span style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700 }}>{p.flightIata}</span>
                          )}
                          <Badge variant="success">{$('policy_active')}</Badge>
                          {p.type === 'worldcup' && <Badge variant="warning">⚽ {$('product_worldcup')}</Badge>}
                        </div>
                        <div style={{ fontSize: 13, color: T.tx3, marginTop: 6 }}>
                          {p.type === 'worldcup' ? p.wcTeam?.name + ' · ' + (p.wcBetType === 'win' ? $('worldcup_bet_win') : $('worldcup_bet_draw')) + ' ×' + p.wcOdds : p.depAirport + ' → ' + p.arrAirport}
                        </div>
                        <div style={{ fontSize: 12, color: T.tx4, marginTop: 2 }}>
                          {p.type === 'worldcup' ? p.wcMatch?.date + ' · ' + p.wcMatch?.venue : p.date + ' ' + p.scheduledDeparture}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: T.tx4 }}>{$('you_get')}</div>
                        <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700 }}>
                          {n(payoutETH)} <span style={{ fontSize: 11, color: T.tx4 }}>ETH</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid ' + T.b, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 12, color: T.tx4 }}>
                        {p.type === 'worldcup' ? '⚽ ' + $('worldcup_pending') : canSettle ? '✅ ' + $('can_settle') : '⏰ ' + $('waiting_flight', { date: p.date })}
                      </div>
                      {p.type === 'worldcup' || canSettle ? (
                        <Button onClick={() => handleSettle(p)} disabled={isSettling} size="sm">
                          {isSettling ? $('settling') : $('settle_now')}
                        </Button>
                      ) : (
                        <Badge>{$('waiting')}</Badge>
                      )}
                    </div>
                  </Card>
                );
              })}
            </>
          )}

          {history.length > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.tx4, textTransform: 'uppercase', marginTop: 16 }}>{$('history_policies')} ({history.length})</div>
              {history.map((p: any) => {
                const payoutETH = Number(p.payoutAmount / KELVIN_PER_ETH);
                const isClaimed = p.status === PolicyStatus.Claimed;
                return (
                  <Card key={p.address} style={{ opacity: 0.75 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {p.type === 'worldcup' ? (
                          <span style={{ fontSize: 20 }}>{p.wcTeam?.flag}</span>
                        ) : (
                          <span style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 600 }}>{p.flightIata}</span>
                        )}
                        <span style={{ fontSize: 12, color: T.tx4 }}>{p.type === 'worldcup' ? p.wcMatch?.date : p.date}</span>
                        {p.type === 'worldcup' && <Badge variant="warning">⚽ 世界杯</Badge>}
                        <Badge variant={isClaimed ? 'success' : 'error'}>
                          {isClaimed
                            ? $('claimed') + ' +' + n(payoutETH)
                            : p.type === 'worldcup'
                              ? $('expired') + (p.wcResultScore ? ' · ' + p.wcResultScore : '')
                              : $('expired') + ' (' + $('delay_min', { min: p.actualDelayMinutes }) + ')'}
                        </Badge>
                      </div>
                      <div style={{ fontSize: 12, color: T.tx4 }}>
                        {p.type === 'worldcup' ? p.wcTeam?.name + ' · ' + (p.wcBetType === 'win' ? $('worldcup_win_short') : $('worldcup_draw_short')) : p.depAirport + ' → ' + p.arrAirport}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}

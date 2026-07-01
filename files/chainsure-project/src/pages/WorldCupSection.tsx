import { useState } from 'react';
import { useApp } from '@/state/AppContext';
import { useLang } from '@i18n/LangContext';
import { KELVIN_PER_ETH, PolicyStatus, type WCTeam, WC_TEAMS, WC_MATCHES } from '@/lib/constants';
import { Badge, Button, Card } from '@components/ui';
import { FONT_MONO, FONT_SANS, T } from '@/theme/tokens';

/* eslint-disable @typescript-eslint/no-explicit-any */

// 使用真实 2026 世界杯数据（来自 constants）
const TEAMS = WC_TEAMS;
const MATCHES = WC_MATCHES;

const PLANS = [{ premium: 50 }, { premium: 100 }, { premium: 200 }, { premium: 500 }];

export function WorldCupSection() {
  const { wallet, connect, purchaseWCPolicy, settleWCPolicy, policies } = useApp();
  const { $ } = useLang();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [betType, setBetType] = useState<'win' | 'draw'>('win');
  const [planIdx, setPlanIdx] = useState(1);
  const [busy, setBusy] = useState(false);
  const [settlingId, setSettlingId] = useState<string | null>(null);
  const [settleLog, setSettleLog] = useState<string[]>([]);
  const [tab, setTab] = useState<'insure' | 'records'>('insure');
  const bets = policies.filter((p: any) => p.type === 'worldcup');

  const getTeam = (id: string) => TEAMS.find((t) => t.id === id);
  const selTeam = teamsafe(selectedTeam);
  function teamsafe(id: string | null): WCTeam | undefined {
    return id ? TEAMS.find((t) => t.id === id) : undefined;
  }
  const selMatch = MATCHES[selectedMatch];
  const selPlan = PLANS[planIdx];
  const odds = selTeam ? selTeam.odds[betType] : 2.1;
  const payout = selPlan ? Math.round(selPlan.premium * odds) : 0;

  const handleInsure = async () => {
    if (!wallet) {
      await connect();
      return;
    }
    if (!selectedTeam) return;
    setBusy(true);
    await purchaseWCPolicy({ match: selMatch, team: selTeam, betType, premium: selPlan.premium, payout, odds });
    setBusy(false);
    setTab('records');
  };

  const handleSettle = async (bet: any) => {
    if (settlingId) return;
    setSettlingId(bet.address);
    setSettleLog([]);
    await settleWCPolicy(bet, (msg) => setSettleLog((prev) => [...prev, msg]));
    setSettlingId(null);
  };

  const handleDemo = async () => {
    if (!wallet) {
      await connect();
      return;
    }
    const demoMatch = MATCHES[0];
    const demoTeam = getTeam('bra')!;
    const demoBet: any = await purchaseWCPolicy({
      match: demoMatch,
      team: demoTeam,
      betType: 'win',
      premium: 100,
      payout: Math.round(100 * demoTeam.odds.win),
      odds: demoTeam.odds.win,
    });
    demoBet.isDemo = true;
    setTab('records');
    await new Promise((r) => setTimeout(r, 300));
    handleSettle(demoBet);
  };

  const statusStyle = (s: number) =>
    ({
      [PolicyStatus.Active]: { bg: T.warnBg, bd: T.warnBd, c: T.warn, label: $('waiting') },
      [PolicyStatus.Claimed]: { bg: T.successBg, bd: T.successBd, c: T.success, label: $('claimed') },
      [PolicyStatus.Expired]: { bg: T.errorBg, bd: T.errorBd, c: T.error, label: $('expired') },
    }[s] || { bg: T.warnBg, bd: T.warnBd, c: T.warn, label: $('waiting') });

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* 顶部横幅 */}
      <div
        style={{
          marginBottom: 24,
          padding: '16px 24px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(34,211,238,0.06) 100%)',
          border: '1px solid rgba(245,158,11,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 32 }}>🏆</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fbbf24' }}>{$('worldcup_banner_title')}</div>
            <div style={{ fontSize: 12, color: T.tx3, marginTop: 2 }}>{$('worldcup_banner_sub')}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleDemo}
            style={{
              height: 36,
              padding: '0 16px',
              borderRadius: 8,
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: '#fbbf24',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: FONT_SANS,
            }}
          >
            ⚡ {$('wc_demo')}
          </button>
          <Badge variant="warning">2026</Badge>
        </div>
      </div>

      {/* Tab 切换 */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {(['insure', 'records'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              background: tab === k ? T.goldBg : 'transparent',
              color: tab === k ? T.gold : T.tx4,
              fontSize: 13,
              fontWeight: tab === k ? 600 : 500,
              cursor: 'pointer',
              fontFamily: FONT_SANS,
              border: tab === k ? '1px solid ' + T.goldBd : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {k === 'insure' ? '🛡️ ' + $('wc_insure_tab') : '📋 ' + $('wc_records_tab') + (bets.length ? ` (${bets.length})` : '')}
          </button>
        ))}
      </div>

      {/* TAB: 投保 */}
      {tab === 'insure' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Card>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.tx2, marginBottom: 14 }}>🏟️ {$('wc_select_match')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MATCHES.map((m, i) => {
                  const ht = getTeam(m.home);
                  const at = getTeam(m.away);
                  const sel = selectedMatch === i;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMatch(i);
                        setSelectedTeam(null);
                      }}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 12,
                        cursor: 'pointer',
                        border: '1px solid ' + (sel ? 'rgba(245,158,11,0.45)' : T.b),
                        background: sel ? 'rgba(245,158,11,0.07)' : 'rgba(255,255,255,0.02)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 5,
                            background: sel ? 'rgba(245,158,11,0.2)' : T.wBg,
                            color: sel ? '#fbbf24' : T.tx4,
                            border: '1px solid ' + (sel ? 'rgba(245,158,11,0.3)' : T.b),
                            textTransform: 'uppercase',
                          }}
                        >
                          {m.stage === 'semis' ? $('wc_semifinals') : $('wc_quarterfinals')}
                        </span>
                        <span style={{ fontSize: 11, color: T.tx4, fontFamily: FONT_MONO }}>{m.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: sel ? T.tx : T.tx2 }}>{ht?.name}</span>
                          <span style={{ fontSize: 20 }}>{ht?.flag}</span>
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: T.gold,
                            padding: '4px 10px',
                            background: T.goldBg,
                            border: '1px solid ' + T.goldBd,
                            borderRadius: 6,
                          }}
                        >
                          VS
                        </span>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 20 }}>{at?.flag}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: sel ? T.tx : T.tx2 }}>{at?.name}</span>
                        </div>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 11, color: T.tx4 }}>📍 {m.venue}</div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.tx2, marginBottom: 14 }}>⚽ {$('wc_support_team')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[getTeam(selMatch.home), getTeam(selMatch.away)].filter(Boolean).map((team) => {
                  const sel = selectedTeam === team!.id;
                  return (
                    <div
                      key={team!.id}
                      onClick={() => setSelectedTeam(team!.id)}
                      style={{
                        padding: '16px',
                        borderRadius: 12,
                        cursor: 'pointer',
                        textAlign: 'center',
                        border: '1px solid ' + (sel ? 'rgba(245,158,11,0.5)' : T.b),
                        background: sel ? 'rgba(245,158,11,0.09)' : 'rgba(255,255,255,0.02)',
                        transition: 'all 0.25s ease',
                        boxShadow: sel ? '0 4px 16px rgba(245,158,11,0.12)' : 'none',
                      }}
                    >
                      <div style={{ fontSize: 36, marginBottom: 6 }}>{team!.flag}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: sel ? '#fbbf24' : T.tx2 }}>{team!.name}</div>
                      <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 5, background: T.successBg, color: T.success, border: '1px solid ' + T.successBd }}>
                          {$('wc_win')}{team!.odds.win}
                        </span>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 5, background: T.goldBg, color: T.gold, border: '1px solid ' + T.goldBd }}>
                          {$('wc_draw')}{team!.odds.draw}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.tx2, marginBottom: 12 }}>📊 {$('wc_bet_type')}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['win', 'draw'] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setBetType(k)}
                    style={{
                      flex: 1,
                      padding: '13px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      fontFamily: FONT_SANS,
                      border: '1px solid ' + (betType === k ? T.goldBd : T.b),
                      background: betType === k ? T.goldBg : 'transparent',
                      color: betType === k ? T.gold : T.tx3,
                      fontSize: 13,
                      fontWeight: betType === k ? 600 : 500,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {k === 'win' ? '🏆 ' + $('worldcup_bet_win') : '🤝 ' + $('worldcup_bet_draw')}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* 右列: 订单确认 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card style={{ background: T.raised }}>
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 5,
                    background: 'rgba(245,158,11,0.15)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245,158,11,0.3)',
                    textTransform: 'uppercase',
                  }}
                >
                  {selMatch.stage === 'semis' ? $('wc_semifinals') : $('wc_quarterfinals')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32 }}>{getTeam(selMatch.home)?.flag}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.tx2, marginTop: 5 }}>{getTeam(selMatch.home)?.name}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.gold, padding: '6px 12px', background: T.goldBg, borderRadius: 8, border: '1px solid ' + T.goldBd }}>VS</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32 }}>{getTeam(selMatch.away)?.flag}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.tx2, marginTop: 5 }}>{getTeam(selMatch.away)?.name}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: T.tx4, textAlign: 'center' }}>📅 {selMatch.date} · 📍 {selMatch.venue}</div>
            </Card>

            <Card>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.tx2, marginBottom: 10 }}>{$('wc_premium_select')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {PLANS.map((p, i) => {
                  const po = Math.round(p.premium * (selTeam ? selTeam.odds[betType] : 2.1));
                  const sel = planIdx === i;
                  return (
                    <div
                      key={i}
                      onClick={() => setPlanIdx(i)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 9,
                        cursor: 'pointer',
                        border: '1px solid ' + (sel ? T.goldBd : T.b),
                        background: sel ? T.goldBg : 'transparent',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ fontSize: 13, color: sel ? T.gold : T.tx2, fontWeight: sel ? 600 : 400 }}>{p.premium} ETH</span>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700, color: T.gold }}>→ +{po} ETH</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {selTeam ? (
              <div style={{ padding: '16px', borderRadius: 12, background: T.goldBg, border: '1px solid ' + T.goldBd }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <div style={{ textAlign: 'center', padding: '10px', background: T.bg, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: T.tx4, marginBottom: 3 }}>{$('wc_premium_label')}</div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700 }}>{selPlan.premium}</div>
                    <div style={{ fontSize: 10, color: T.tx4 }}>ETH</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(34,211,238,0.12)', borderRadius: 8, border: '1px solid ' + T.goldBd }}>
                    <div style={{ fontSize: 10, color: T.gold, marginBottom: 3 }}>{$('wc_payout_label2')}</div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: 700, color: T.gold }}>+{payout}</div>
                    <div style={{ fontSize: 10, color: T.gold }}>ETH</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: T.tx3, textAlign: 'center' }}>
                  {selTeam.flag} {selTeam.name} · {betType === 'win' ? $('wc_bet_win_short') : $('wc_bet_draw_short')} · ×{odds} {$('worldcup_odds')}
                </div>
              </div>
            ) : (
              <div style={{ padding: '14px', borderRadius: 12, textAlign: 'center', background: T.raised, border: '1px solid ' + T.b }}>
                <span style={{ fontSize: 13, color: T.tx4 }}>{$('wc_please_select_team')}</span>
              </div>
            )}

            <Button onClick={handleInsure} disabled={busy || !selectedTeam} size="lg" style={{ width: '100%' }}>
              {busy ? $('wc_processing') : !wallet ? $('wc_connect_wallet') : !selectedTeam ? $('wc_select_team_first') : $('wc_insure_now_prefix') + ` ${selPlan.premium} ETH`}
            </Button>

            <div style={{ fontSize: 11, color: T.tx4, textAlign: 'center' }}>{$('worldcup_footer')}</div>
          </div>
        </div>
      )}

      {/* TAB: 投注记录 */}
      {tab === 'records' && (
        <div>
          {bets.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '50px 24px' }}>
                <div style={{ fontSize: 48, opacity: 0.3, marginBottom: 16 }}>⚽</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.tx3, marginBottom: 8 }}>{$('wc_no_bets')}</div>
                <div style={{ fontSize: 13, color: T.tx4, marginBottom: 20 }}>{$('wc_go_insure_hint')}</div>
                <Button onClick={() => setTab('insure')} variant="ghost">{$('wc_go_insure')}</Button>
              </div>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 8 }}>
                {[
                  { label: $('wc_all_policies'), value: bets.length, color: T.tx },
                  { label: $('wc_claimed_count'), value: bets.filter((b: any) => b.status === PolicyStatus.Claimed).length, color: T.success },
                  { label: $('wc_total_payout'), value: bets.filter((b: any) => b.status === PolicyStatus.Claimed).reduce((s: number, b: any) => s + Number(b.payoutAmount / KELVIN_PER_ETH), 0) + ' ETH', color: T.gold },
                ].map((item) => (
                  <div key={item.label} style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(17,27,48,0.9)', border: '1px solid ' + T.b, textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: T.tx4, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: 700, color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {bets.map((bet: any) => {
                const ss = statusStyle(bet.status);
                const isSettling = settlingId === bet.address;
                return (
                  <Card key={bet.address} style={{ padding: '20px 22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 28 }}>{bet.wcTeam.flag}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: T.tx }}>{bet.wcTeam.name}</span>
                          </div>
                          <div style={{ fontSize: 12, color: T.tx4 }}>{bet.wcBetType === 'win' ? '🏆 ' + $('worldcup_bet_win') : '🤝 ' + $('worldcup_bet_draw')} · ×{bet.wcOdds}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: ss.bg, color: ss.c, border: '1px solid ' + ss.bd, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{ss.label}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '10px 14px', background: T.bg, borderRadius: 8 }}>
                      <span style={{ fontSize: 18 }}>{getTeam(bet.wcMatch.home)?.flag}</span>
                      <span style={{ fontSize: 12, color: T.tx3 }}>{getTeam(bet.wcMatch.home)?.name}</span>
                      <span style={{ fontSize: 11, color: T.gold, fontWeight: 700 }}>{$('worldcup_vs')}</span>
                      <span style={{ fontSize: 12, color: T.tx3 }}>{getTeam(bet.wcMatch.away)?.name}</span>
                      <span style={{ fontSize: 18 }}>{getTeam(bet.wcMatch.away)?.flag}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: T.tx4, fontFamily: FONT_MONO }}>{bet.wcMatch.date}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', gap: 20 }}>
                        <div>
                          <div style={{ fontSize: 10, color: T.tx4, marginBottom: 3 }}>{$('wc_premium_label')}</div>
                          <div style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 700 }}>{Number(bet.premiumPaid / KELVIN_PER_ETH)} ETH</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: T.gold, marginBottom: 3 }}>{$('wc_payout_label2')}</div>
                          <div style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 700, color: T.gold }}>+{Number(bet.payoutAmount / KELVIN_PER_ETH)} ETH</div>
                        </div>
                        {bet.status === PolicyStatus.Claimed && (
                          <div>
                            <div style={{ fontSize: 10, color: T.success, marginBottom: 3 }}>{$('wc_received')}</div>
                            <div style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 700, color: T.success }}>+{Number(bet.payoutAmount / KELVIN_PER_ETH)} ETH ✅</div>
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: T.tx4, fontFamily: FONT_MONO, textAlign: 'right' }}>
                        <div>TX: {bet.txSignature ? bet.txSignature.slice(0, 10) : ''}...</div>
                        <div style={{ marginTop: 2 }}>{new Date(bet.createdAt).toLocaleString()}</div>
                      </div>
                    </div>

                    {bet.wcResultScore && (
                      <div style={{ marginBottom: 12, padding: '8px 12px', borderRadius: 8, background: bet.status === PolicyStatus.Claimed ? T.successBg : T.errorBg, border: '1px solid ' + (bet.status === PolicyStatus.Claimed ? T.successBd : T.errorBd), fontSize: 12, color: bet.status === PolicyStatus.Claimed ? T.success : T.error }}>
                        📊 {$('wc_result_prefix')}{bet.wcResultScore}
                      </div>
                    )}

                    {isSettling && settleLog.length > 0 && (
                      <div style={{ marginBottom: 12, padding: '12px 14px', borderRadius: 8, background: 'rgba(34,211,238,0.06)', border: '1px solid ' + T.goldBd }}>
                        {settleLog.map((log, i) => (
                          <div key={i} style={{ fontSize: 12, color: i === settleLog.length - 1 ? T.gold : T.tx4, marginBottom: i < settleLog.length - 1 ? 5 : 0, transition: 'color 0.3s' }}>{log}</div>
                        ))}
                        <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                          {[0, 1, 2].map((i) => (
                            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: T.gold, opacity: 0.6, animation: `fadeIn 0.5s ${i * 0.2}s infinite alternate` }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {bet.status === PolicyStatus.Active && !isSettling && (
                      <button onClick={() => handleSettle(bet)} style={{ width: '100%', height: 38, borderRadius: 8, background: T.goldBg, border: '1px solid ' + T.goldBd, color: T.gold, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT_SANS }}>⚡ {$('wc_settle_this')}</button>
                    )}
                    {isSettling && <div style={{ textAlign: 'center', fontSize: 12, color: T.gold, padding: '8px' }}>{$('wc_settling')}</div>}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useLang } from '@i18n/LangContext';
import { PROGRAM_ID, KELVIN_PER_ETH, PolicyStatus } from '@/lib/constants';
import { buildPolicyTimeline, getPolicyClaimPda, getPolicyLifecycle } from '@/lib/policyStatus';
import { n, shortSig } from '@/lib/format';
import { Badge, Button } from '@components/ui';
import { FONT_MONO, FONT_SANS, T } from '@/theme/tokens';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  policy: any;
  claim?: any;
  onClose: () => void;
  onSettle?: () => void;
  settling?: boolean;
}

const LIFECYCLE_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  waiting: 'info',
  ready: 'warning',
  claimed: 'success',
  expired: 'error',
};

export function PolicyDetailPanel({ policy, claim, onClose, onSettle, settling }: Props) {
  const { $ } = useLang();
  const today = new Date().toISOString().split('T')[0];
  const lifecycle = getPolicyLifecycle(policy, today);
  const claimPda = getPolicyClaimPda(policy);
  const timeline = buildPolicyTimeline(policy, today);
  const payoutEth = n(Number(policy.payoutAmount / KELVIN_PER_ETH));
  const premiumEth = n(Number((policy.premiumPaid ?? 0n) / KELVIN_PER_ETH));
  const settleTx = claim?.transferSignature ?? policy.settleTxSignature;

  const title =
    policy.type === 'worldcup'
      ? `${policy.wcTeam?.flag ?? '⚽'} ${policy.wcTeam?.name ?? 'World Cup'}`
      : policy.flightIata;

  const subtitle =
    policy.type === 'worldcup'
      ? `${policy.wcMatch?.date ?? ''} · ${policy.wcBetType === 'win' ? $('worldcup_bet_win') : $('worldcup_bet_draw')}`
      : `${policy.depAirport} → ${policy.arrAirport} · ${policy.date}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(560px, 100%)',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: T.card,
          border: '1px solid ' + T.b2,
          borderRadius: 18,
          padding: '24px 26px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: T.tx, fontFamily: FONT_MONO }}>{title}</div>
            <div style={{ fontSize: 13, color: T.tx3, marginTop: 6 }}>{subtitle}</div>
            <div style={{ marginTop: 10 }}>
              <Badge variant={LIFECYCLE_VARIANT[lifecycle]}>{$('policy_lifecycle_' + lifecycle)}</Badge>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: T.raised, color: T.tx3, width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: 20, padding: 16, borderRadius: 12, background: 'rgba(0,0,0,0.25)', border: '1px solid ' + T.b }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.gold, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            {$('policy_onchain_title')}
          </div>
          {[
            [$('policy_pda'), policy.address],
            [$('policy_claim_pda'), claimPda],
            [$('policy_purchase_tx'), policy.txSignature],
            ...(settleTx ? [[$('policy_settle_tx'), settleTx] as const] : []),
            [$('policy_program'), PROGRAM_ID],
          ].map(([label, value]) => (
            <div key={label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: T.tx4, marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: T.tx2, wordBreak: 'break-all', lineHeight: 1.5, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <div style={{ padding: 12, borderRadius: 10, background: T.raised, border: '1px solid ' + T.b }}>
            <div style={{ fontSize: 11, color: T.tx4 }}>{$('premium_label')}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, marginTop: 4 }}>{premiumEth} ETH</div>
          </div>
          <div style={{ padding: 12, borderRadius: 10, background: T.goldBg, border: '1px solid ' + T.goldBd }}>
            <div style={{ fontSize: 11, color: T.gold }}>{$('you_get')}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: T.gold, marginTop: 4 }}>+{payoutEth} ETH</div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.tx4, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            {$('policy_timeline_title')}
          </div>
          {timeline.map((step, i) => (
            <div key={step.id} style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: step.done ? T.gold : step.active ? T.gold : 'rgba(255,255,255,0.15)',
                    boxShadow: step.active ? '0 0 0 3px rgba(34,211,238,0.25)' : 'none',
                    marginTop: 4,
                  }}
                />
                {i < timeline.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 28, background: step.done ? 'rgba(34,211,238,0.35)' : 'rgba(255,255,255,0.08)' }} />
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: i < timeline.length - 1 ? 16 : 0 }}>
                <div style={{ fontSize: 13, fontWeight: step.active ? 600 : 500, color: step.done || step.active ? T.tx : T.tx4 }}>
                  {$(step.labelKey)}
                </div>
                {step.detailKey && (
                  <div style={{ fontSize: 12, color: T.tx3, marginTop: 4 }}>{$(step.detailKey, step.detailParams ?? {})}</div>
                )}
                {step.time && (
                  <div style={{ fontSize: 11, color: T.tx4, marginTop: 4, fontFamily: FONT_MONO }}>
                    {new Date(step.time).toLocaleString()}
                    {step.id === 'purchase' && policy.txSignature && <span style={{ marginLeft: 8 }}>· {shortSig(policy.txSignature)}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {lifecycle === 'ready' && policy.status === PolicyStatus.Active && onSettle && (
            <Button onClick={onSettle} disabled={settling} size="md" style={{ flex: 1 }}>
              {settling ? $('settling') : $('settle_now')}
            </Button>
          )}
          <Button onClick={onClose} variant="secondary" size="md" style={{ flex: lifecycle === 'ready' ? undefined : 1 }}>
            {$('policy_close')}
          </Button>
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: T.tx4, textAlign: 'center', fontFamily: FONT_SANS }}>
          {$('policy_onchain_hint')}
        </div>
      </div>
    </div>
  );
}

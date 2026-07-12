import { DELAY_THRESHOLD, PolicyStatus } from '@/lib/constants';
import { getClaimAddress } from '@sdk/rialo';

export type PolicyLifecycle =
  | 'waiting'   // 等待触发（航班未起飞 / 赛事未结束）
  | 'ready'     // 可结算
  | 'claimed'   // 已理赔
  | 'expired';  // 已过期（未达条件）

export interface PolicyTimelineStep {
  id: string;
  labelKey: string;
  time?: number;
  done: boolean;
  active: boolean;
  detailKey?: string;
  detailParams?: Record<string, string | number>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export function getPolicyLifecycle(policy: any, today = new Date().toISOString().split('T')[0]): PolicyLifecycle {
  if (policy.status === PolicyStatus.Claimed) return 'claimed';
  if (policy.status === PolicyStatus.Expired) return 'expired';
  if (policy.type === 'worldcup') return 'ready';
  if (policy.date <= today) return 'ready';
  return 'waiting';
}

export function getPolicyClaimPda(policy: any): string {
  const [addr] = getClaimAddress(policy.address);
  return addr;
}

export function buildPolicyTimeline(policy: any, today = new Date().toISOString().split('T')[0]): PolicyTimelineStep[] {
  const lifecycle = getPolicyLifecycle(policy, today);
  const settled = policy.status !== PolicyStatus.Active;

  const steps: PolicyTimelineStep[] = [
    {
      id: 'purchase',
      labelKey: 'policy_step_purchase',
      time: policy.createdAt,
      done: true,
      active: false,
    },
    {
      id: 'waiting',
      labelKey: policy.type === 'worldcup' ? 'policy_step_wc_wait' : 'policy_step_wait',
      time: policy.createdAt,
      done: lifecycle !== 'waiting',
      active: lifecycle === 'waiting',
      detailKey: policy.type === 'worldcup' ? undefined : 'policy_step_wait_detail',
      detailParams: policy.type === 'worldcup' ? undefined : { date: policy.date },
    },
    {
      id: 'ready',
      labelKey: 'policy_step_ready',
      done: lifecycle === 'ready' || settled,
      active: lifecycle === 'ready',
    },
    {
      id: 'settle',
      labelKey: settled
        ? policy.status === PolicyStatus.Claimed
          ? 'policy_step_claimed'
          : 'policy_step_expired'
        : 'policy_step_settle_pending',
      time: policy.settledAt ?? undefined,
      done: settled,
      active: settled,
      detailKey: settled && policy.actualDelayMinutes != null ? 'policy_step_delay_detail' : undefined,
      detailParams:
        settled && policy.actualDelayMinutes != null
          ? { min: policy.actualDelayMinutes, threshold: DELAY_THRESHOLD }
          : undefined,
    },
  ];

  return steps;
}

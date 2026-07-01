import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { KELVIN_PER_ETH } from '@/lib/constants';
import { n } from '@/lib/format';
import { FONT_MONO, FONT_SANS, T } from '@/theme/tokens';

/* eslint-disable @typescript-eslint/no-explicit-any */

/** 数字滚动动画 */
export function Anim({ value }: { value: bigint | number }) {
  const [v, setV] = useState(0);
  const target = typeof value === 'bigint' ? Number(value / KELVIN_PER_ETH) : value;
  useEffect(() => {
    let from = v;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / 400, 1);
      setV(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { from = target; };
  }, [target]);
  return <>{n(v)}</>;
}

type CardVariant = 'default' | 'highlight';

export function Card({
  children,
  style = {},
  onClick,
  glow,
  variant = 'default',
}: {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  glow?: boolean;
  variant?: CardVariant;
}) {
  void glow;
  const variants: Record<CardVariant, { bg: string; bd: string; shadow: string }> = {
    default: {
      bg: T.card,
      bd: T.b,
      shadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
    },
    highlight: {
      bg: `linear-gradient(145deg, rgba(34,211,238,0.08) 0%, rgba(10,16,30,0.98) 100%)`,
      bd: T.goldBd,
      shadow: '0 4px 32px rgba(34,211,238,0.1), inset 0 1px 0 rgba(34,211,238,0.1)',
    },
  };
  const v = variants[variant];
  return (
    <div
      onClick={onClick}
      style={{
        background: v.bg,
        border: '1px solid ' + v.bd,
        borderRadius: 16,
        padding: '24px 26px',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: v.shadow,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.25s ease',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

type BadgeVariant = 'default' | 'warning' | 'success' | 'error' | 'info' | 'gold';

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: BadgeVariant }) {
  const styles: Record<BadgeVariant, { bg: string; bd: string; c: string }> = {
    default: { bg: 'rgba(191,219,254,0.08)', bd: 'rgba(191,219,254,0.12)', c: T.tx2 },
    warning: { bg: T.goldBg, bd: T.goldBd, c: T.gold },
    success: { bg: T.successBg, bd: T.successBd, c: T.success },
    error: { bg: T.errorBg, bd: T.errorBd, c: T.error },
    info: { bg: T.wBg, bd: T.wBd, c: T.w },
    gold: { bg: `linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(8,145,178,0.15) 100%)`, bd: T.goldBd, c: T.gold },
  };
  const s = styles[variant] || styles.default;
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: '4px 10px',
        borderRadius: 6,
        background: s.bg,
        color: s.c,
        border: '1px solid ' + s.bd,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export function Button({
  children,
  onClick,
  disabled,
  variant = 'primary',
  size = 'md',
  style = {},
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: CSSProperties;
}) {
  const sizes: Record<ButtonSize, { h: number; px: number; fs: number; radius: number }> = {
    sm: { h: 34, px: 16, fs: 12, radius: 8 },
    md: { h: 46, px: 24, fs: 14, radius: 10 },
    lg: { h: 54, px: 32, fs: 15, radius: 12 },
  };
  const variants: Record<ButtonVariant, { bg: string; c: string; shadow: string; border: string }> = {
    primary: {
      bg: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
      c: '#0a0a0a',
      shadow: '0 4px 16px rgba(34,211,238,0.3)',
      border: 'none',
    },
    secondary: { bg: 'transparent', c: T.tx2, shadow: 'none', border: '1px solid ' + T.b2 },
    danger: { bg: T.errorBg, c: T.error, shadow: 'none', border: '1px solid ' + T.errorBd },
    ghost: { bg: T.goldBg, c: T.gold, shadow: 'none', border: '1px solid ' + T.goldBd },
  };
  const sz = sizes[size];
  const vr = variants[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        height: sz.h,
        padding: `0 ${sz.px}px`,
        borderRadius: sz.radius,
        border: vr.border,
        background: disabled ? T.raised : vr.bg,
        color: disabled ? T.tx4 : vr.c,
        fontSize: sz.fs,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: FONT_SANS,
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        boxShadow: disabled ? 'none' : vr.shadow,
        letterSpacing: '0.01em',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Empty({
  icon,
  title,
  desc,
  action,
}: {
  icon: ReactNode;
  title: ReactNode;
  desc?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.4, filter: 'grayscale(0.3)' }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: T.tx3, marginBottom: 10, letterSpacing: '-0.01em' }}>{title}</div>
      {desc && <div style={{ fontSize: 14, color: T.tx4, marginBottom: 24, lineHeight: 1.6 }}>{desc}</div>}
      {action}
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  color,
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  color?: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 11, color: T.tx4, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 28, fontWeight: 700, color: color || T.tx, letterSpacing: '-0.02em' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: T.tx4, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/** 通用样式快捷：等宽字体 */
export const mono = (style: CSSProperties = {}): CSSProperties => ({ fontFamily: FONT_MONO, ...style });

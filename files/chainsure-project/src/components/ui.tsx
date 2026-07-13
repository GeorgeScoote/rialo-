import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { kelvinToEth, n } from '@/lib/format';
import { FONT_MONO, FONT_SANS, T } from '@/theme/tokens';

/* eslint-disable @typescript-eslint/no-explicit-any */

/** 数字滚动动画（支持小数 ETH） */
export function Anim({ value }: { value: bigint | number }) {
  const [v, setV] = useState(0);
  const target = typeof value === 'bigint' ? kelvinToEth(value) : value;
  useEffect(() => {
    let from = v;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / 400, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(from + (target - from) * eased);
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

/** 分段切换（全部 / 国内 / 国际等） */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  stretch = false,
  size = 'md',
}: {
  options: { value: T; label: ReactNode }[];
  value: T | null;
  onChange: (v: T) => void;
  stretch?: boolean;
  size?: 'sm' | 'md';
}) {
  const sz = size === 'sm'
    ? { pad: '6px 12px', fs: 12, minW: 48, outer: 8, inner: 6 }
    : { pad: '8px 16px', fs: 13, minW: 56, outer: 10, inner: 7 };

  return (
    <div
      role="tablist"
      className="seg-control"
      style={{
        display: stretch ? 'flex' : 'inline-flex',
        width: stretch ? '100%' : undefined,
        gap: 2,
        padding: 4,
        borderRadius: sz.outer,
        background: 'rgba(0,0,0,0.35)',
        border: '1px solid ' + T.b2,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={'seg-btn' + (active ? ' seg-btn--active' : '')}
            onClick={() => onChange(opt.value)}
            style={{
              flex: stretch ? 1 : undefined,
              padding: sz.pad,
              borderRadius: sz.inner,
              border: 'none',
              minWidth: stretch ? 0 : sz.minW,
              background: active
                ? 'linear-gradient(135deg, rgba(34,211,238,0.24) 0%, rgba(8,145,178,0.14) 100%)'
                : 'transparent',
              color: active ? T.gold : T.tx2,
              fontSize: sz.fs,
              fontWeight: active ? 600 : 500,
              cursor: 'pointer',
              fontFamily: FONT_SANS,
              transition: 'color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
              boxShadow: active ? 'inset 0 0 0 1px ' + T.goldBd + ', 0 1px 8px rgba(34,211,238,0.12)' : 'none',
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
              textAlign: 'center',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** 带搜索图标的输入框 */
export function SearchInput({
  value,
  onChange,
  placeholder,
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onClear?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 14px',
        borderRadius: 10,
        border: '1px solid ' + (focused ? T.goldBd : T.b2),
        background: focused ? 'rgba(34,211,238,0.04)' : 'rgba(0,0,0,0.3)',
        boxShadow: focused ? '0 0 0 3px rgba(34,211,238,0.08)' : 'none',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
      }}
    >
      <span style={{ fontSize: 14, color: focused ? T.gold : T.tx4, flexShrink: 0, lineHeight: 1 }} aria-hidden>
        ⌕
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          flex: 1,
          minWidth: 0,
          padding: '11px 0',
          border: 'none',
          background: 'transparent',
          color: T.tx,
          fontSize: 13,
          fontFamily: FONT_SANS,
          outline: 'none',
        }}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="clear"
          style={{
            border: 'none',
            background: T.raised,
            color: T.tx3,
            width: 22,
            height: 22,
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
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

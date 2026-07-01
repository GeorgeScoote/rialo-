/**
 * ChainSure 主题 Token —— Deep Blue Tech
 * 深蓝科技感：深海军蓝底 + 青色主色 + 电光蓝点缀
 */
export const T = {
  // 背景层
  bg: '#060a14',
  panel: 'rgba(13,21,38,0.8)',
  raised: 'rgba(20,32,58,0.9)',
  card: 'linear-gradient(145deg, rgba(17,27,48,0.95) 0%, rgba(10,16,30,0.98) 100%)',

  // 边框层
  b: 'rgba(34,211,238,0.10)',
  b2: 'rgba(34,211,238,0.18)',
  b3: 'rgba(34,211,238,0.30)',

  // 文字层
  tx: '#eaf2ff',
  tx2: '#9fb6d4',
  tx3: '#5a7090',
  tx4: '#3a4a64',

  // 主色 —— 青色（对应原 gold 系列，保持 key 名兼容）
  gold: '#22d3ee',
  goldLight: '#67e8f9',
  goldDark: '#0891b2',
  goldBg: 'rgba(34,211,238,0.10)',
  goldBd: 'rgba(34,211,238,0.28)',

  // 点缀蓝
  w: '#bfdbfe',
  wBg: 'rgba(96,165,250,0.08)',
  wBd: 'rgba(96,165,250,0.20)',

  // 状态色
  success: '#34d399',
  successBg: 'rgba(52,211,153,0.12)',
  successBd: 'rgba(52,211,153,0.30)',

  error: '#f87171',
  errorBg: 'rgba(248,113,113,0.12)',
  errorBd: 'rgba(248,113,113,0.30)',

  warn: '#fbbf24',
  warnBg: 'rgba(251,191,36,0.12)',
  warnBd: 'rgba(251,191,36,0.30)',
} as const;

export type Theme = typeof T;

/** 字体族 */
export const FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
export const FONT_MONO = "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace";

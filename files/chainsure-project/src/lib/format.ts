/** 通用工具函数 */

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/** 数字格式化：bigint 按 ETH 单位换算，普通数字带千分位 */
export const n = (v: number | bigint): string =>
  typeof v === 'bigint' ? Number(v).toLocaleString() : v.toLocaleString();

/** 缩写钱包地址 */
export const shortAddr = (addr?: string | null): string =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

/** 缩写交易签名 */
export const shortSig = (sig?: string | null): string =>
  sig ? `${sig.slice(0, 8)}...${sig.slice(-6)}` : '';

/** 生成随机十六进制签名（演示用） */
export const randomSig = (len = 64): string =>
  [...Array(len)].map(() => ((Math.random() * 16) | 0).toString(16)).join('');

/** 通用工具函数 */

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

import { KELVIN_PER_ETH } from '@/lib/constants';

/** Kelvin（链上最小单位）→ ETH 数值 */
export const kelvinToEth = (kelvin: bigint): number =>
  Number(kelvin) / Number(KELVIN_PER_ETH);

/** 数字格式化：支持小数 ETH 显示 */
export const n = (v: number | bigint): string => {
  const num =
    typeof v === 'bigint'
      ? kelvinToEth(v)
      : v;
  if (!Number.isFinite(num)) return '0';
  const abs = Math.abs(num);
  if (abs >= 1000) return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (Number.isInteger(num)) return num.toLocaleString();
  return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 });
};

/** 缩写钱包地址 */
export const shortAddr = (addr?: string | null): string =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

/** 缩写交易签名 */
export const shortSig = (sig?: string | null): string =>
  sig ? `${sig.slice(0, 8)}...${sig.slice(-6)}` : '';

/** 生成随机十六进制签名（演示用） */
export const randomSig = (len = 64): string =>
  [...Array(len)].map(() => ((Math.random() * 16) | 0).toString(16)).join('');

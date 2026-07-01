/**
 * ChainSure SDK —— Rialo 区块链交互封装
 *
 * 演示模式：模拟钱包连接、购买保单、结算等链上行为。
 * 生产环境可替换为 @rialo/ts-cdk + @rialo/frost-core 真实调用（见注释）。
 */
import { KELVIN_PER_ETH, PROGRAM_ID } from '@/lib/constants';
import { randomSig, sleep } from '@/lib/format';

/** PDA Seeds */
export const SEEDS = {
  CONFIG: new TextEncoder().encode('config'),
  POLICY: new TextEncoder().encode('policy'),
  CLAIM: new TextEncoder().encode('claim'),
  TREASURY: new TextEncoder().encode('treasury'),
};

/** PDA 派生：保单地址 */
export const getPolicyAddress = (owner: string, flightIata: string, date: string): [string, number] => {
  // 真实代码:
  // return PublicKey.findProgramAddress(
  //   [SEEDS.POLICY, PublicKey.fromString(owner).toBytes(),
  //    new TextEncoder().encode(flightIata), new TextEncoder().encode(date)],
  //   PublicKey.fromString(PROGRAM_ID),
  // );
  const hash = btoa(`${owner.slice(0, 16)}_${flightIata}_${date}`).replace(/[+/=]/g, 'x').slice(0, 32);
  return [`policy_${hash}`, 255];
};

/** PDA 派生：理赔地址 */
export const getClaimAddress = (policyAddress: string): [string, number] => {
  return [`claim_${policyAddress.slice(0, 24)}`, 255];
};

/** PDA 派生：Config 地址 */
export const getConfigAddress = (): [string, number] => {
  return [`config_${PROGRAM_ID.slice(0, 16)}`, 255];
};

/** PDA 派生：Treasury 地址 */
export const getTreasuryAddress = (): [string, number] => {
  return [`treasury_${PROGRAM_ID.slice(0, 16)}`, 255];
};

export interface PurchaseParams {
  owner: string;
  flightIata: string;
  flightIcao: string;
  date: string;
  scheduledDeparture: string;
  depAirport: string;
  arrAirport: string;
  payoutAmount: number;
  premiumAmount: number;
}

export interface SettleParams {
  owner: string;
  policyAddress: string;
  flightIata: string;
  date: string;
}

type Network = 'devnet' | 'testnet' | 'mainnet';

export class RialoSDK {
  network: Network;
  rpcUrl: string;
  client: unknown;
  frostConfig: unknown;
  registry: unknown;
  bridge: unknown;
  walletAddress: string | null;
  initialized: boolean;

  constructor(network: Network = 'devnet') {
    this.network = network;
    this.rpcUrl = `https://${network}.rialo.network`;
    this.client = null;
    this.frostConfig = null;
    this.registry = null;
    this.bridge = null;
    this.walletAddress = null;
    this.initialized = false;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    // 真实代码:
    // this.client = createRialoClient(getDefaultRialoClientConfig(this.network));
    // this.frostConfig = createConfig({ clientConfig: this.client, autoConnect: true });
    // this.registry = new WalletRegistry(this.frostConfig);
    // this.bridge = new WalletEventBridge(this.frostConfig);
    // initializeConfig(this.frostConfig, this.registry, this.bridge);
    // await this.registry.ready;
    // eslint-disable-next-line no-console
    console.log(`[RialoSDK] Initialized on ${this.network}`);
    this.initialized = true;
  }

  async connect(walletName = 'Rialo'): Promise<{ walletName: string; accountAddress: string }> {
    await this.initialize();
    // 真实代码: const { walletName: name, accountAddress } = await connect(this.frostConfig, { walletName });
    await sleep(800);
    const accountAddress =
      '7xKXtg' +
      [...Array(38)]
        .map(() => 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789'[(Math.random() * 58) | 0])
        .join('');
    this.walletAddress = accountAddress;
    // eslint-disable-next-line no-console
    console.log(`[RialoSDK] Connected: ${accountAddress}`);
    return { walletName, accountAddress };
  }

  async disconnect(): Promise<void> {
    // 真实代码: await disconnect(this.frostConfig);
    this.walletAddress = null;
    // eslint-disable-next-line no-console
    console.log('[RialoSDK] Disconnected');
  }

  async getBalance(address?: string): Promise<bigint> {
    // 真实代码: return await this.client.getBalance(PublicKey.fromString(address || this.walletAddress));
    await sleep(300);
    return BigInt(10000) * KELVIN_PER_ETH;
  }

  async getAccountInfo(_address: string): Promise<null> {
    await sleep(200);
    return null;
  }

  async purchasePolicy(params: PurchaseParams): Promise<{
    signature: string;
    policyAddress: string;
    premium: bigint;
    payout: bigint;
  }> {
    const { owner, flightIata, flightIcao, date, scheduledDeparture, depAirport, arrAirport, payoutAmount, premiumAmount } = params;
    const premiumKelvin = BigInt(premiumAmount) * KELVIN_PER_ETH;
    const payoutKelvin = BigInt(payoutAmount) * KELVIN_PER_ETH;
    const [policyAddress, policyBump] = getPolicyAddress(owner, flightIata, date);
    void getConfigAddress();
    void getTreasuryAddress();

    // eslint-disable-next-line no-console
    console.log(`[RialoSDK] PurchasePolicy:`, { policyAddress, premium: premiumAmount, payout: payoutAmount, flightIcao, scheduledDeparture, depAirport, arrAirport, bump: policyBump });

    await sleep(1200);
    const signature = randomSig();
    // eslint-disable-next-line no-console
    console.log(`[RialoSDK] TX Signature: ${signature}`);

    return { signature, policyAddress, premium: premiumKelvin, payout: payoutKelvin };
  }

  async settlePolicy(params: SettleParams): Promise<{ signature: string; claimAddress: string }> {
    const { owner, policyAddress, flightIata, date } = params;
    const [claimAddress] = getClaimAddress(policyAddress);
    void getConfigAddress();
    void getTreasuryAddress();
    // eslint-disable-next-line no-console
    console.log(`[RialoSDK] SettlePolicy:`, { policyAddress, claimAddress, owner, flightIata, date });

    await sleep(1500);
    const signature = randomSig();
    // eslint-disable-next-line no-console
    console.log(`[RialoSDK] Settle TX: ${signature}`);
    return { signature, claimAddress };
  }

  async getPoliciesByOwner(_owner: string): Promise<unknown[]> {
    // 真实环境: 从链上查询保单；演示模式返回空数组，实际数据在前端状态管理
    return [];
  }

  /** Borsh 编码（简化版） */
  encodePurchaseInstruction(params: unknown): Uint8Array {
    return new Uint8Array([1, ...new TextEncoder().encode(JSON.stringify(params))]);
  }

  encodeManualSettleInstruction(): Uint8Array {
    return new Uint8Array([3]);
  }

  destroy(): void {
    // eslint-disable-next-line no-console
    console.log('[RialoSDK] Destroyed');
  }
}

/** 全局 SDK 实例 */
export const rialoSDK = new RialoSDK('devnet');

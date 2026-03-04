/**
 * ChainSure SDK - Rialo Blockchain Integration
 * 
 * This SDK provides a wrapper around @rialo/ts-cdk and @rialo/frost-core
 * for seamless interaction with the ChainSure smart contracts.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface NetworkConfig {
  network: 'devnet' | 'testnet' | 'mainnet';
  rpcUrl: string;
  programId: string;
}

export interface WalletInfo {
  address: string;
  balance: bigint;
  connected: boolean;
}

export interface Policy {
  address: string;
  owner: string;
  flightIata: string;
  flightIcao: string;
  date: string;
  scheduledDeparture: string;
  depAirport: string;
  arrAirport: string;
  payoutAmount: bigint;
  premiumPaid: bigint;
  status: PolicyStatus;
  createdAt: number;
  settledAt: number | null;
  actualDelayMinutes: number | null;
  txSignature: string;
}

export interface Claim {
  address: string;
  policy: string;
  owner: string;
  amount: bigint;
  delayMinutes: number;
  timestamp: number;
  transferSignature: string;
}

export interface PurchaseParams {
  flightIata: string;
  flightIcao: string;
  date: string;
  scheduledDeparture: string;
  depAirport: string;
  arrAirport: string;
  payoutAmount: number;
  premiumAmount: number;
}

export interface PurchaseResult {
  signature: string;
  policyAddress: string;
  premium: bigint;
  payout: bigint;
}

export interface SettleResult {
  signature: string;
  claimAddress: string;
}

export enum PolicyStatus {
  Active = 0,
  Claimed = 1,
  Expired = 2,
  Cancelled = 3,
}

// ============================================================================
// Constants
// ============================================================================

export const KELVIN_PER_RLO = 1_000_000_000n;
export const DELAY_THRESHOLD = 120; // minutes
export const MAX_POLICIES_PER_DAY = 5;

export const TIERS = [
  { premium: 50, payout: 200, nameKey: 'plan_basic', rate: 25 },
  { premium: 100, payout: 500, nameKey: 'plan_standard', rate: 20 },
  { premium: 200, payout: 1000, nameKey: 'plan_premium', rate: 20 },
  { premium: 500, payout: 2000, nameKey: 'plan_vip', rate: 25 },
] as const;

export const PRODUCTS = [
  { id: 'flight', name: 'Flight', labelKey: 'product_flight', icon: '✈️', active: true },
  { id: 'health', name: 'Health', labelKey: 'product_health', icon: '🏥', active: false },
  { id: 'auto', name: 'Auto', labelKey: 'product_auto', icon: '🚗', active: false },
  { id: 'life', name: 'Life', labelKey: 'product_life', icon: '❤️', active: false },
] as const;

// PDA Seeds
const SEEDS = {
  CONFIG: 'config',
  POLICY: 'policy',
  CLAIM: 'claim',
  TREASURY: 'treasury',
} as const;

// ============================================================================
// Network Configuration
// ============================================================================

const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
  devnet: {
    network: 'devnet',
    rpcUrl: 'https://devnet.rialo.network',
    programId: 'ChainSure1111111111111111111111111111111111',
  },
  testnet: {
    network: 'testnet',
    rpcUrl: 'https://testnet.rialo.network',
    programId: 'ChainSure1111111111111111111111111111111111',
  },
  mainnet: {
    network: 'mainnet',
    rpcUrl: 'https://mainnet.rialo.network',
    programId: 'ChainSure1111111111111111111111111111111111',
  },
};

// ============================================================================
// PDA Derivation Functions
// ============================================================================

export function getPolicyAddress(
  owner: string,
  flightIata: string,
  date: string,
  programId: string
): [string, number] {
  // Real implementation:
  // return PublicKey.findProgramAddress(
  //   [
  //     Buffer.from(SEEDS.POLICY),
  //     PublicKey.fromString(owner).toBytes(),
  //     Buffer.from(flightIata),
  //     Buffer.from(date),
  //   ],
  //   PublicKey.fromString(programId)
  // );

  // Demo: Generate deterministic address
  const hash = btoa(`${owner.slice(0, 16)}_${flightIata}_${date}`)
    .replace(/[+/=]/g, 'x')
    .slice(0, 32);
  return [`policy_${hash}`, 255];
}

export function getClaimAddress(
  policyAddress: string,
  programId: string
): [string, number] {
  // Real implementation:
  // return PublicKey.findProgramAddress(
  //   [Buffer.from(SEEDS.CLAIM), PublicKey.fromString(policyAddress).toBytes()],
  //   PublicKey.fromString(programId)
  // );

  return [`claim_${policyAddress.slice(0, 24)}`, 255];
}

export function getConfigAddress(programId: string): [string, number] {
  return [`config_${programId.slice(0, 16)}`, 255];
}

export function getTreasuryAddress(programId: string): [string, number] {
  return [`treasury_${programId.slice(0, 16)}`, 255];
}

// ============================================================================
// ChainSure SDK Class
// ============================================================================

export class ChainSureSDK {
  private config: NetworkConfig;
  private client: any = null;
  private frostConfig: any = null;
  private registry: any = null;
  private bridge: any = null;
  private initialized = false;

  public walletAddress: string | null = null;

  constructor(network: 'devnet' | 'testnet' | 'mainnet' = 'devnet') {
    this.config = NETWORK_CONFIGS[network];
  }

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Real implementation:
    // const clientConfig = getDefaultRialoClientConfig(this.config.network);
    // this.client = createRialoClient(clientConfig);
    // this.frostConfig = createConfig({ clientConfig, autoConnect: true });
    // this.registry = new WalletRegistry(this.frostConfig);
    // this.bridge = new WalletEventBridge(this.frostConfig);
    // initializeConfig(this.frostConfig, this.registry, this.bridge);
    // await this.registry.ready;

    console.log(`[ChainSureSDK] Initialized on ${this.config.network}`);
    this.initialized = true;
  }

  // --------------------------------------------------------------------------
  // Wallet Operations
  // --------------------------------------------------------------------------

  async connect(walletName = 'Rialo'): Promise<string> {
    await this.initialize();

    // Real implementation:
    // const { accountAddress } = await connect(this.frostConfig, { walletName });
    // this.walletAddress = accountAddress;
    // return accountAddress;

    // Demo mode
    await this.sleep(800);
    const address =
      '7xKXtg' +
      [...Array(38)]
        .map(() =>
          'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789'[
            Math.floor(Math.random() * 58)
          ]
        )
        .join('');

    this.walletAddress = address;
    console.log(`[ChainSureSDK] Connected: ${address}`);
    return address;
  }

  async disconnect(): Promise<void> {
    // Real implementation:
    // await disconnect(this.frostConfig);

    this.walletAddress = null;
    console.log('[ChainSureSDK] Disconnected');
  }

  async getBalance(address?: string): Promise<bigint> {
    // Real implementation:
    // const publicKey = PublicKey.fromString(address || this.walletAddress);
    // return await this.client.getBalance(publicKey);

    await this.sleep(300);
    return BigInt(10000) * KELVIN_PER_RLO;
  }

  // --------------------------------------------------------------------------
  // Policy Operations
  // --------------------------------------------------------------------------

  async purchasePolicy(params: PurchaseParams): Promise<PurchaseResult> {
    if (!this.walletAddress) {
      throw new Error('Wallet not connected');
    }

    const premiumKelvin = BigInt(params.premiumAmount) * KELVIN_PER_RLO;
    const payoutKelvin = BigInt(params.payoutAmount) * KELVIN_PER_RLO;

    const [policyAddress, policyBump] = getPolicyAddress(
      this.walletAddress,
      params.flightIata,
      params.date,
      this.config.programId
    );

    console.log(`[ChainSureSDK] PurchasePolicy:`, {
      policyAddress,
      premium: params.premiumAmount,
      payout: params.payoutAmount,
    });

    // Real implementation:
    // const instructionData = this.encodePurchaseInstruction({
    //   ...params,
    //   payoutAmount: payoutKelvin,
    //   premiumAmount: premiumKelvin,
    //   bump: policyBump,
    // });
    // const tx = TransactionBuilder.create()
    //   .setPayer(PublicKey.fromString(this.walletAddress))
    //   .setValidFrom(BigInt(Date.now()))
    //   .addInstruction({...})
    //   .build();
    // const { signature } = await signAndSendTransaction(this.frostConfig, { transaction: tx });

    // Demo mode
    await this.sleep(1200);
    const signature = this.generateSignature();

    console.log(`[ChainSureSDK] TX Signature: ${signature}`);

    return {
      signature,
      policyAddress,
      premium: premiumKelvin,
      payout: payoutKelvin,
    };
  }

  async settlePolicy(policyAddress: string): Promise<SettleResult> {
    if (!this.walletAddress) {
      throw new Error('Wallet not connected');
    }

    const [claimAddress] = getClaimAddress(policyAddress, this.config.programId);

    console.log(`[ChainSureSDK] SettlePolicy:`, { policyAddress, claimAddress });

    // Real implementation:
    // const instructionData = this.encodeSettleInstruction();
    // const tx = TransactionBuilder.create()...
    // const { signature } = await signAndSendTransaction(...);

    // Demo mode
    await this.sleep(1500);
    const signature = this.generateSignature();

    console.log(`[ChainSureSDK] Settle TX: ${signature}`);

    return { signature, claimAddress };
  }

  async getPoliciesByOwner(owner: string): Promise<Policy[]> {
    // Real implementation:
    // const accounts = await this.client.getProgramAccounts(
    //   PublicKey.fromString(this.config.programId),
    //   { filters: [{ memcmp: { offset: 1, bytes: owner } }] }
    // );
    // return accounts.map(a => this.deserializePolicy(a.pubkey, a.account.data));

    return [];
  }

  // --------------------------------------------------------------------------
  // Helper Methods
  // --------------------------------------------------------------------------

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateSignature(): string {
    return [...Array(64)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
  }

  private encodePurchaseInstruction(params: any): Uint8Array {
    // Instruction discriminator: 1 = PurchasePolicy
    // TODO: Implement full Borsh serialization
    return new Uint8Array([1]);
  }

  private encodeSettleInstruction(): Uint8Array {
    // Instruction discriminator: 3 = ManualSettle
    return new Uint8Array([3]);
  }

  // --------------------------------------------------------------------------
  // Cleanup
  // --------------------------------------------------------------------------

  destroy(): void {
    // Real implementation:
    // this.frostConfig?.destroy();
    console.log('[ChainSureSDK] Destroyed');
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const chainsureSDK = new ChainSureSDK(
  (import.meta.env?.VITE_RIALO_NETWORK as 'devnet' | 'testnet' | 'mainnet') || 'devnet'
);

export default ChainSureSDK;

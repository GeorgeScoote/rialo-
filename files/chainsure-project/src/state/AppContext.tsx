import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  DELAY_THRESHOLD,
  ethToKelvin,
  FLIGHTS,
  KELVIN_PER_ETH,
  MAX_POLICIES_PER_DAY,
  PolicyStatus,
  type Flight,
} from '@/lib/constants';
import { n, shortAddr, sleep } from '@/lib/format';
import { isAppPage, parseHashPage, syncHashPage, type AppPage } from '@/lib/routes';
import { getClaimAddress, getPolicyAddress, rialoSDK } from '@sdk/rialo';

/* eslint-disable @typescript-eslint/no-explicit-any */

type Tx = {
  type: string;
  time: number;
  amount?: number;
  flightIata?: string;
  delayMin?: number;
  signature?: string;
  desc?: string;
  address?: string;
};

interface AppContextValue {
  wallet: string | null;
  balance: bigint;
  policies: any[];
  claims: any[];
  txHistory: Tx[];
  page: AppPage;
  loading: boolean;
  setPage: (p: AppPage | string) => void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  purchasePolicy: (flight: Flight, date: string, payoutAmount: number, premiumAmount: number) => Promise<any>;
  settlePolicy: (
    policy: any,
    onStep?: (step: number, msg: string) => void,
    $t?: (k: string, p?: Record<string, string | number>) => string
  ) => Promise<{ signature: string; hit: boolean; delayed: number }>;
  refreshData: () => Promise<void>;
  addTx: (tx: Tx) => void;
  getTodayPolicyCount: () => number;
  canPurchaseMore: () => boolean;
  addDemoPolicy: () => any | null;
  purchaseWCPolicy: (params: any) => Promise<any>;
  settleWCPolicy: (policy: any, onLog?: (msg: string) => void) => Promise<{ won: boolean; score: string; sig: string }>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint>(0n);
  const [policies, setPolicies] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [txHistory, setTxHistory] = useState<Tx[]>([]);
  const [page, setPageState] = useState<AppPage>(() => parseHashPage());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    rialoSDK.initialize();
    return () => rialoSDK.destroy();
  }, []);

  // hash 路由：支持 #/home 分享链接，浏览器前进/后退
  useEffect(() => {
    const current = parseHashPage();
    setPageState(current);
    const expected = `#/${current}`;
    if (window.location.hash !== expected) {
      syncHashPage(current, true);
    }

    const onHashChange = () => {
      setPageState(parseHashPage());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const setPage = useCallback((p: AppPage | string) => {
    const next: AppPage = isAppPage(p) ? p : 'home';
    setPageState(next);
    syncHashPage(next);
  }, []);

  const addTx = useCallback((tx: Tx) => setTxHistory((prev) => [tx, ...prev]), []);

  const refreshData = useCallback(async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const bal = await rialoSDK.getBalance(wallet);
      setBalance(bal);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[App] Refresh failed:', e);
    }
    setLoading(false);
  }, [wallet]);

  const connect = useCallback(async () => {
    setLoading(true);
    try {
      const { accountAddress } = await rialoSDK.connect('Rialo');
      setWallet(accountAddress);
      const bal = await rialoSDK.getBalance(accountAddress);
      setBalance(bal);
      addTx({ type: 'connect', time: Date.now(), address: shortAddr(accountAddress) });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[App] Connect failed:', e);
    }
    setLoading(false);
  }, [addTx]);

  const disconnect = useCallback(async () => {
    await rialoSDK.disconnect();
    setWallet(null);
    setBalance(0n);
    setPolicies([]);
    setClaims([]);
    addTx({ type: 'disconnect', time: Date.now() });
  }, [addTx]);

  const getTodayPolicyCount = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayStart = new Date(today).getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000;
    return policies.filter((p) => p.createdAt >= todayStart && p.createdAt < todayEnd).length;
  }, [policies]);

  const canPurchaseMore = useCallback(() => getTodayPolicyCount() < MAX_POLICIES_PER_DAY, [getTodayPolicyCount]);

  const purchasePolicy = useCallback(
    async (flight: Flight, date: string, payoutAmount: number, premiumAmount: number) => {
      if (!wallet) throw new Error('Wallet not connected');
      if (!canPurchaseMore()) throw new Error(`DAILY_LIMIT:${MAX_POLICIES_PER_DAY}`);

      const result = await rialoSDK.purchasePolicy({
        owner: wallet,
        flightIata: flight.iata,
        flightIcao: flight.icao,
        date,
        scheduledDeparture: flight.dep.scheduled,
        depAirport: flight.dep.iata,
        arrAirport: flight.arr.iata,
        payoutAmount,
        premiumAmount,
      });

      const policy = {
        address: result.policyAddress,
        owner: wallet,
        flightIata: flight.iata,
        flightIcao: flight.icao,
        flight,
        date,
        scheduledDeparture: flight.dep.scheduled,
        depAirport: flight.dep.iata,
        arrAirport: flight.arr.iata,
        payoutAmount: result.payout,
        premiumPaid: result.premium,
        status: PolicyStatus.Active,
        createdAt: Date.now(),
        settledAt: null,
        actualDelayMinutes: null,
        txSignature: result.signature,
      };

      setPolicies((prev) => [policy, ...prev]);
      setBalance((prev) => prev - result.premium);
      addTx({
        type: 'purchase',
        time: Date.now(),
        amount: -Number(result.premium / KELVIN_PER_ETH),
        flightIata: flight.iata,
        signature: result.signature,
      });

      return { signature: result.signature, policy };
    },
    [wallet, canPurchaseMore, addTx]
  );

  const settlePolicy = useCallback(
    async (
      policy: any,
      onStep?: (step: number, msg: string) => void,
      $t?: (k: string, p?: Record<string, string | number>) => string
    ) => {
      if (!wallet) throw new Error('Wallet not connected');

      // 高级专业流程（更慢、更详细，像真实链上理赔） - 所有消息均使用 $t（已翻译）或英文后备，避免多语言下出现中文
      if (onStep) onStep(1, $t ? $t('settle_step1') : 'Connecting to oracle network...');
      await sleep(1800);

      if (onStep) onStep(2, $t ? $t('settle_step2', { flight: policy.flightIata }) : `Fetching multi-source data for ${policy.flightIata} (weather/delays)...`);
      await sleep(2400);

      const delayed: number = policy.flight.dep_delayed;
      if (onStep) onStep(3, $t ? $t('settle_step3', { min: delayed }) : `Cross-verifying historical distribution with live delay ${delayed}min...`);
      await sleep(2100);

      if (onStep) onStep(4, $t ? $t('settle_step4_proof') || 'Verifying on-chain conditions & Merkle proof...' : 'Verifying on-chain conditions & generating proof...');
      await sleep(1900);

      const hit = delayed >= DELAY_THRESHOLD;
      if (onStep)
        onStep(5, $t ? (hit ? $t('settle_step4_hit') : $t('settle_step4_miss')) : hit ? 'Conditions met, preparing transaction...' : 'Below threshold, preparing record...');

      const result = await rialoSDK.settlePolicy({
        owner: wallet,
        policyAddress: policy.address,
        flightIata: policy.flightIata,
        date: policy.date,
      });

      await sleep(1600); // 模拟等待区块确认

      const amountETH = n(Number(policy.payoutAmount / KELVIN_PER_ETH));
      if (onStep)
        onStep(6, $t ? (hit ? $t('settle_step5_hit', { amount: amountETH }) : $t('settle_step5_miss')) : hit ? `On-chain confirmed +${amountETH} ETH` : 'Safely recorded as expired');

      setPolicies((prev) =>
        prev.map((p) =>
          p.address === policy.address
            ? { ...p, status: hit ? PolicyStatus.Claimed : PolicyStatus.Expired, settledAt: Date.now(), actualDelayMinutes: delayed, settleTxSignature: result.signature }
            : p
        )
      );

      if (hit) {
        const claim = {
          address: result.claimAddress,
          policy: policy.address,
          owner: wallet,
          amount: policy.payoutAmount,
          delayMinutes: delayed,
          timestamp: Date.now(),
          transferSignature: result.signature,
        };
        setClaims((prev) => [claim, ...prev]);
        setBalance((prev) => prev + policy.payoutAmount);
        addTx({ type: 'claim', time: Date.now(), amount: Number(policy.payoutAmount / KELVIN_PER_ETH), flightIata: policy.flightIata, delayMin: delayed, signature: result.signature });
      } else {
        addTx({ type: 'expire', time: Date.now(), amount: 0, flightIata: policy.flightIata, delayMin: delayed, signature: result.signature });
      }

      return { signature: result.signature, hit, delayed };
    },
    [wallet, addTx]
  );

  const addDemoPolicy = useCallback(() => {
    if (!wallet) return null;
    const demoFlight = FLIGHTS.find((f) => f.dep_delayed >= DELAY_THRESHOLD) || FLIGHTS[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const demoDate = yesterday.toISOString().split('T')[0];
    const [policyAddress] = getPolicyAddress(wallet, demoFlight.iata, demoDate);

    const demoPolicy = {
      address: policyAddress,
      owner: wallet,
      flightIata: demoFlight.iata,
      flightIcao: demoFlight.icao,
      flight: demoFlight,
      date: demoDate,
      scheduledDeparture: demoFlight.dep.scheduled,
      depAirport: demoFlight.dep.iata,
      arrAirport: demoFlight.arr.iata,
      payoutAmount: ethToKelvin(5),
      premiumPaid: ethToKelvin(1),
      status: PolicyStatus.Active,
      createdAt: Date.now() - 86400000,
      settledAt: null,
      actualDelayMinutes: null,
      txSignature: 'demo_' + Math.random().toString(36).slice(2, 10),
    };

    setPolicies((prev) => [demoPolicy, ...prev]);
    addTx({ type: 'demo_purchase', time: Date.now() - 86400000, amount: -1, flightIata: demoFlight.iata, signature: demoPolicy.txSignature });
    return demoPolicy;
  }, [wallet, addTx]);

  const purchaseWCPolicy = useCallback(
    async ({ match, team, betType, premium, payout, odds }: any) => {
      await sleep(1200);
      const sig = [...Array(64)].map(() => ((Math.random() * 16) | 0).toString(16)).join('');
      const addr = 'wc_policy_' + Date.now().toString(36);
      const policy = {
        address: addr,
        owner: wallet,
        type: 'worldcup',
        wcMatch: match,
        wcTeam: team,
        wcBetType: betType,
        wcOdds: odds,
        payoutAmount: BigInt(payout) * KELVIN_PER_ETH,
        premiumPaid: BigInt(premium) * KELVIN_PER_ETH,
        status: PolicyStatus.Active,
        createdAt: Date.now(),
        settledAt: null,
        txSignature: sig,
      };
      setPolicies((prev) => [policy, ...prev]);
      setBalance((prev) => prev - BigInt(premium) * KELVIN_PER_ETH);
      addTx({ type: 'wc_purchase', time: Date.now(), amount: -premium, signature: sig, desc: team.flag + ' ' + team.name + ' World Cup policy' });
      return policy;
    },
    [wallet, addTx]
  );

  const settleWCPolicy = useCallback(
    async (policy: any, onLog?: (msg: string) => void) => {
      const log = (msg: string) => onLog && onLog(msg);
      log('⏳ Initiating on-chain settlement...');
      await sleep(700);
      log('🔍 Querying result for ' + policy.wcMatch.date + ' ' + policy.wcTeam.flag + ' ' + policy.wcTeam.name + '...');
      await sleep(1000);
      // 基于真实赔率计算更合理的胜率（模拟）
      const odds = Number(policy.wcOdds) || 2.2;
      const implied = Math.max(0.22, Math.min(0.72, 1 / odds));
      let winProb = policy.wcBetType === 'win' ? implied : 0.28; // draw 赔率通常较高
      const won = Math.random() < winProb;
      let score: string;
      if (policy.wcBetType === 'win') {
        score = won ? '2 - 1 (主队胜)' : (Math.random() < 0.5 ? '0 - 2 (客队胜)' : '1 - 3 (客队胜)');
      } else {
        score = won ? '1 - 1 (平局)' : (Math.random() < 0.5 ? '2 - 0 (主队胜)' : '0 - 3 (客队胜)');
      }
      log('📊 Match result: ' + score);
      await sleep(800);
      const sig = [...Array(64)].map(() => ((Math.random() * 16) | 0).toString(16)).join('');
      if (won) {
        log('✅ Condition met, triggering smart contract transfer...');
        await sleep(900);
        const payoutETH = Number(policy.payoutAmount / KELVIN_PER_ETH);
        log('💰 Payout +' + payoutETH + ' ETH received!');
        const claim = {
          address: 'wc_claim_' + Date.now().toString(36),
          policy: policy.address,
          owner: wallet,
          type: 'worldcup',
          amount: policy.payoutAmount,
          wcTeam: policy.wcTeam,
          wcMatch: policy.wcMatch,
          wcResultScore: score,
          timestamp: Date.now(),
          transferSignature: sig,
        };
        setClaims((prev) => [claim, ...prev]);
        setBalance((prev) => prev + policy.payoutAmount);
        addTx({ type: 'wc_claim', time: Date.now(), amount: Number(policy.payoutAmount / KELVIN_PER_ETH), signature: sig, desc: policy.wcTeam.flag + ' ' + policy.wcTeam.name + ' World Cup claim' });
      } else {
        log('❌ Condition not met, policy settled');
        await sleep(600);
        log('📋 Policy marked as expired');
        addTx({ type: 'wc_expire', time: Date.now(), amount: 0, signature: sig, desc: policy.wcTeam.flag + ' ' + policy.wcTeam.name + ' World Cup policy expired' });
      }
      setPolicies((prev) =>
        prev.map((p) =>
          p.address === policy.address
            ? { ...p, status: won ? PolicyStatus.Claimed : PolicyStatus.Expired, settledAt: Date.now(), wcResultScore: score, settleTxSignature: sig }
            : p
        )
      );
      return { won, score, sig };
    },
    [wallet, addTx]
  );

  return (
    <AppContext.Provider
      value={{
        wallet,
        balance,
        policies,
        claims,
        txHistory,
        page,
        loading,
        setPage,
        connect,
        disconnect,
        purchasePolicy,
        settlePolicy,
        refreshData,
        addTx,
        getTodayPolicyCount,
        canPurchaseMore,
        addDemoPolicy,
        purchaseWCPolicy,
        settleWCPolicy,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

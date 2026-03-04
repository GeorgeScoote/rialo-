# ChainSure Architecture

## Overview

ChainSure is a decentralized insurance protocol built on the Rialo blockchain. It leverages Rialo's native Timer and HTTP capabilities for fully automated, trustless insurance products.

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              Frontend                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │   React    │  │   i18n     │  │   Zustand  │  │    SDK     │         │
│  │ Components │  │ (4 langs)  │  │   Store    │  │  Wrapper   │         │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘         │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           SDK Layer                                       │
│  ┌────────────────────────┐  ┌────────────────────────────────┐         │
│  │   @rialo/frost-core    │  │      @rialo/ts-cdk             │         │
│  │   (Wallet Connect)     │  │   (Transaction Builder)        │         │
│  └────────────────────────┘  └────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        Rialo Blockchain                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │   Config   │  │   Policy   │  │   Claim    │  │  Treasury  │         │
│  │    PDA     │  │    PDA     │  │    PDA     │  │    PDA     │         │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘         │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │              Native Capabilities                            │         │
│  │  ┌──────────────────┐  ┌──────────────────┐                │         │
│  │  │   Timer Program  │  │   HTTP Program   │                │         │
│  │  │ (Auto-trigger)   │  │  (Oracle calls)  │                │         │
│  │  └──────────────────┘  └──────────────────┘                │         │
│  └────────────────────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         External Services                                 │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │                   AirLabs Flight API                        │         │
│  │    https://airlabs.co/api/v9/flight?flight_iata=CA1234     │         │
│  └────────────────────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────────────────┘
```

## Account Structure

### Config Account (Singleton)

```rust
PDA: ["config"]

struct Config {
    is_initialized: bool,
    authority: PublicKey,      // Admin
    treasury: PublicKey,       // Fund pool
    delay_threshold: u32,      // 120 minutes
    oracle_url: String,        // AirLabs API
    total_premiums: u64,
    total_claims: u64,
    total_policies: u64,
}
```

### Policy Account (Per User/Flight/Date)

```rust
PDA: ["policy", owner, flight_iata, date]

struct Policy {
    is_initialized: bool,
    owner: PublicKey,
    flight_iata: String,       // "CA1234"
    flight_icao: String,       // "CCA1234"
    date: String,              // "2024-03-15"
    scheduled_departure: String, // "14:30"
    dep_airport: String,       // "PEK"
    arr_airport: String,       // "SHA"
    payout_amount: u64,        // in Kelvin
    premium_paid: u64,         // in Kelvin
    status: PolicyStatus,
    created_at: i64,
    settled_at: Option<i64>,
    actual_delay_minutes: Option<u32>,
    timer_subscription: Option<u64>,
    bump: u8,
}
```

### Claim Account (Per Policy)

```rust
PDA: ["claim", policy_address]

struct Claim {
    is_initialized: bool,
    policy: PublicKey,
    owner: PublicKey,
    amount: u64,
    delay_minutes: u32,
    timestamp: i64,
    transfer_signature: String,
    bump: u8,
}
```

## Instruction Flow

### 1. Purchase Policy

```
User                    Contract                Timer
  │                        │                      │
  │  PurchasePolicy        │                      │
  │───────────────────────>│                      │
  │                        │                      │
  │  (Validate date,       │                      │
  │   check daily limit,   │                      │
  │   transfer premium)    │                      │
  │                        │                      │
  │                        │  Register Timer      │
  │                        │─────────────────────>│
  │                        │                      │
  │  Policy Created        │                      │
  │<───────────────────────│                      │
```

### 2. Auto Settlement (Timer Triggered)

```
Timer                   Contract               HTTP Oracle
  │                        │                      │
  │  Trigger SettlePolicy  │                      │
  │───────────────────────>│                      │
  │                        │                      │
  │                        │  GET flight data     │
  │                        │─────────────────────>│
  │                        │                      │
  │                        │  dep_delayed: 165    │
  │                        │<─────────────────────│
  │                        │                      │
  │  (delay >= 120 min)    │                      │
  │  Create Claim +        │                      │
  │  Transfer Payout       │                      │
  │                        │                      │
```

### 3. Manual Settlement

```
User                    Contract               HTTP Oracle
  │                        │                      │
  │  ManualSettle          │                      │
  │───────────────────────>│                      │
  │                        │                      │
  │  (Verify flight has    │                      │
  │   departed)            │                      │
  │                        │                      │
  │                        │  GET flight data     │
  │                        │─────────────────────>│
  │                        │                      │
  │                        │  dep_delayed: 45     │
  │                        │<─────────────────────│
  │                        │                      │
  │  (delay < 120 min)     │                      │
  │  Policy Expired        │                      │
  │<───────────────────────│                      │
```

## Fund Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Treasury PDA                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Purchase:  User ──────(premium)──────> Treasury            │
│                                                              │
│   Claim:     Treasury ──(payout)──────> User                 │
│              (only if delay >= 120 min)                      │
│                                                              │
│   Expire:    No transfer (premium stays in Treasury)         │
│                                                              │
│   Cancel:    Treasury ──(refund)──────> User                 │
│              (admin action, e.g., flight cancelled)          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Security Model

### Access Control

| Action | Who Can Call | Validation |
|--------|--------------|------------|
| Initialize | Deployer (once) | Not initialized |
| PurchasePolicy | Anyone | Future date, valid tier, daily limit |
| SettlePolicy | Timer/Owner | After flight time |
| CancelPolicy | Authority | Policy exists, active |
| UpdateConfig | Authority | Authorized |

### Anti-Fraud Measures

1. **Daily Limit**: Max 5 policies per user per day
2. **Future Dates Only**: Cannot insure past flights
3. **PDA Uniqueness**: One policy per (owner, flight, date)
4. **Timer-based Settlement**: Automatic, tamper-proof
5. **On-chain Oracle**: HTTP requests are verifiable

### Fund Safety

- Treasury is a PDA, only contract can access
- Premium/payout amounts are fixed (no manipulation)
- All transfers are atomic (success or revert)

## Insurance Tiers

| Tier | Premium | Payout | Rate | Return |
|------|---------|--------|------|--------|
| Basic | 50 RLO | 200 RLO | 25% | 4x |
| Standard | 100 RLO | 500 RLO | 20% | 5x |
| Premium | 200 RLO | 1,000 RLO | 20% | 5x |
| VIP | 500 RLO | 2,000 RLO | 25% | 4x |

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Zustand (state)
- i18next (internationalization)

### Blockchain
- Rialo Network
- Rust + Borsh
- Native Timer
- Native HTTP

### APIs
- AirLabs (flight data)

## Deployment

### Devnet

```bash
# Build contract
cd contracts
cargo build-sbf

# Deploy
rialo program deploy target/deploy/chainsure.so --network devnet

# Initialize
rialo program invoke <PROGRAM_ID> initialize --network devnet
```

### Mainnet (future)

1. Audit contract
2. Deploy to testnet for final testing
3. Seed treasury with initial liquidity
4. Deploy to mainnet
5. Initialize with production config

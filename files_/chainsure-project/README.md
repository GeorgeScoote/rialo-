# ChainSure Protocol

<div align="center">
  <img src="docs/assets/logo.png" alt="ChainSure Logo" width="120" />
  
  **Decentralized Insurance Protocol on Rialo Blockchain**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
  [![Rialo](https://img.shields.io/badge/Rialo-Devnet-gold.svg)](https://rialo.network/)
  
  [Documentation](./docs/) · [Demo](https://chainsure.app) · [Report Bug](https://github.com/chainsure/protocol/issues)
</div>

---

## Overview

ChainSure is a decentralized insurance protocol built on the Rialo blockchain, leveraging native Timer and HTTP capabilities for fully automated, trustless insurance products.

### Products

| Product | Status | Description |
|---------|--------|-------------|
| **Flight** | ✅ Live | Flight delay insurance with automatic claims |
| **Health** | 🔜 Soon | Medical expense coverage |
| **Auto** | 🔜 Soon | Vehicle insurance |
| **Life** | 🔜 Soon | Life insurance |

## Features

- 🔗 **On-Chain Claims** — Automated claim processing via smart contracts
- ⏱️ **Native Timer** — Rialo's native timer triggers settlement automatically
- 🌐 **HTTP Oracle** — Real-time flight data from AirLabs API
- 🌍 **Multi-Language** — Chinese, English, Japanese, Korean
- 💰 **Instant Payouts** — Claims paid directly to your wallet
- 🛡️ **Anti-Fraud** — Daily purchase limits (5 policies/day)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Rialo Wallet Extension

### Installation

```bash
# Clone the repository
git clone https://github.com/chainsure/protocol.git
cd chainsure-project

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_RIALO_NETWORK=devnet
VITE_PROGRAM_ID=ChainSure1111111111111111111111111111111111
VITE_AIRLABS_API_KEY=your_api_key_here
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  React + TypeScript + Vite                                  │
├─────────────────────────────────────────────────────────────┤
│                      SDK Layer                               │
│  @rialo/ts-cdk + @rialo/frost-core                          │
├─────────────────────────────────────────────────────────────┤
│                   Smart Contracts                            │
│  Rust + Borsh Serialization                                 │
├─────────────────────────────────────────────────────────────┤
│                   Rialo Blockchain                           │
│  Native Timer · Native HTTP · PDA Accounts                  │
└─────────────────────────────────────────────────────────────┘
```

### Contract Architecture

```
Config (PDA: ["config"])
├── authority: PublicKey
├── treasury: PublicKey
├── delay_threshold: u32 (120 minutes)
└── oracle_url: String

Policy (PDA: ["policy", owner, flight_iata, date])
├── owner: PublicKey
├── flight_iata: String
├── payout_amount: u64
├── premium_paid: u64
├── status: PolicyStatus
└── timer_subscription: u64

Claim (PDA: ["claim", policy_address])
├── policy: PublicKey
├── amount: u64
├── delay_minutes: u32
└── transfer_signature: String
```

## Project Structure

```
chainsure-project/
├── src/
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── sdk/             # Rialo SDK wrapper
│   ├── i18n/            # Internationalization
│   ├── styles/          # CSS/styling
│   └── App.tsx          # Main application
├── contracts/           # Rust smart contracts
├── docs/               # Documentation
├── public/             # Static assets
└── tests/              # Test suites
```

## Development

### Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Production build
npm run preview       # Preview production build

# Testing
npm run test          # Run tests
npm run test:coverage # Test with coverage

# Linting
npm run lint          # ESLint
npm run format        # Prettier
```

### Contract Deployment

```bash
# Build contracts
cd contracts
cargo build-sbf

# Deploy to devnet
rialo program deploy target/deploy/chainsure.so --network devnet
```

## Insurance Plans

| Plan | Premium | Payout | Rate | Max Return |
|------|---------|--------|------|------------|
| Basic | 50 RLO | 200 RLO | 25% | 4x |
| Standard | 100 RLO | 500 RLO | 20% | 5x |
| Premium | 200 RLO | 1,000 RLO | 20% | 5x |
| VIP | 500 RLO | 2,000 RLO | 25% | 4x |

## Claim Conditions

- Flight delay ≥ **120 minutes** triggers automatic payout
- Claims processed on-chain via Rialo HTTP oracle
- Payouts sent directly to user wallet

## Security

- **PDA Uniqueness**: One policy per (owner, flight, date)
- **Time Validation**: Only future dates allowed
- **Daily Limits**: Maximum 5 policies per user per day
- **Treasury Security**: PDA-controlled, program-only access

## Roadmap

- [x] Flight Delay Insurance (MVP)
- [x] Multi-language Support
- [x] Anti-fraud Measures
- [ ] Health Insurance Module
- [ ] Auto Insurance Module
- [ ] Governance Token
- [ ] DAO Treasury Management
- [ ] Mobile App

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Contact

- Website: [chainsure.app](https://chainsure.app)
- Twitter: [@ChainSureDAO](https://twitter.com/ChainSureDAO)
- Discord: [ChainSure Community](https://discord.gg/chainsure)
- Email: dev@chainsure.app

---

<div align="center">
  <sub>Built with ❤️ on Rialo Blockchain</sub>
</div>

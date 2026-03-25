# Somnia Whisper 🔮

An ancient mystical oracle that reads your on-chain journey on the **Somnia Shannon Testnet**.

Somnia Whisper uses Anthropic's Claude AI to interpret your transaction patterns as cryptic fate inscriptions, which can be minted as 100% on-chain NFTs. Powered by **Somnia Reactivity**, the application features a real-time network feed that updates instantly whenever a new fortune is inscribed.

## ⚡ The Reactivity Difference
Unlike traditional dApps that poll the blockchain every few seconds, Somnia Whisper uses native on-chain reactivity. 
- **Zero Polling**: Events are pushed directly from Somnia validators to the browser.
- **Sub-Second Latency**: The Live Feed updates in <1s of block inclusion.
- **Decentralized Pub/Sub**: Native event-driven architecture directly on the L1.

## 🛠 Tech Stack
- **Blockchain**: Somnia Shannon Testnet
- **Framework**: Next.js 14 (App Router)
- **Reactivity**: Somnia Reactivity SDK
- **AI**: Anthropic Claude 3.5 Sonnet
- **NFTs**: ERC-721 (Enumerable, 100% On-Chain SVG)
- **Styling**: TailwindCSS + Framer Motion

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- STT (Somnia Testnet Token) for deployment and minting
- [Anthropic API Key](https://console.anthropic.com/)

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Copy `.env.local.example` to `.env.local` and fill in:
   - `CLAUDE_API_KEY`
   - `PRIVATE_KEY` (for deployment)

3. Deploy Smart Contracts:
   ```bash
   npm run deploy
   ```
   *This script deploys the NFT and Handler contracts, sets up the reactivity subscription, and auto-updates your .env.local.*

4. Run locally:
   ```bash
   npm run dev
   ```

## 🏗 Architecture
```text
[ Smart Contract ] --- (Event: FortuneMinted) ---> [ Somnia Validators ]
                                                          |
                                                  (Push via SDK)
                                                          |
                                                 [ useSomniaReactivity ]
                                                          |
                                                 [ Live Feed UI ]
```

## 🌐 Environment Variables
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SOMNIA_RPC` | https://dream-rpc.somnia.network |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed NFT Contract |
| `CLAUDE_API_KEY` | Anthropic API Key |
| `PRIVATE_KEY` | Wallet private key (Deploy only) |

---
Built for the Somnia Reactivity Hackathon.

# 🚀 Deployment Checklist

Follow these steps to take Somnia Whisper live.

## 1. Local Preparation
- [ ] Ensure you have STT in your wallet (Faucet: https://shannon-faucet.somnia.network/)
- [ ] Run `npm run deploy --network somniaTestnet`
- [ ] Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` is updated in `.env.local`
- [ ] Verify `REACTIVE_HANDLER_ADDRESS` is logged and stored.

## 2. Vercel Configuration
- [ ] Create a new project on Vercel.
- [ ] Add the following Environment Variables in Vercel Dashboard:
    - `NEXT_PUBLIC_SOMNIA_RPC`: `https://dream-rpc.somnia.network`
    - `NEXT_PUBLIC_SOMNIA_WS`: `wss://dream-rpc.somnia.network`
    - `NEXT_PUBLIC_CHAIN_ID`: `50312`
    - `NEXT_PUBLIC_CONTRACT_ADDRESS`: (Your deployed NFT address)
    - `CLAUDE_API_KEY`: (Your Anthropic API key)
- [ ] **IMPORTANT**: Do NOT add `PRIVATE_KEY` to Vercel env vars.

## 3. GitHub & CI/CD
- [ ] Push code to `main` branch.
- [ ] Verify GitHub Action runs successfully (Type checking & Build).
- [ ] Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` to GitHub Secrets for automated deployment.

## 4. Final Validation
- [ ] Open the Vercel deployment URL.
- [ ] Connect wallet and generate a fortune.
- [ ] Observe the **Live Feed** — it should update the moment your transaction is confirmed.
- [ ] Visit the **Gallery** to see your inscribed destiny.

---
**Note**: Ensure your wallet has enough STT (at least 32 STT Recommended) for setting up the initial guaranteed reactivity subscription during deployment.

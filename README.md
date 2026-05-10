# Certino App

Hackathon demo: renewable energy certificates as ERC-1155 NFTs on Polygon Amoy.
Producers mint certificates representing kWh of generation. Anyone holding a certificate
can permanently retire (cancel) it on-chain to claim consumption of that energy.

This README is for a developer who wants to clone, configure, and run the app
locally. The contract is already deployed; you only need to bring your own wallet.

## What you need before starting

- **Node.js 20.9+** (Next.js 16 minimum)
- **MetaMask** (or any browser wallet that exposes `window.ethereum`)
- **A wallet you control** to act as the *issuer* — this is the wallet whose private
  key will sign mint transactions on the server. It needs:
  - **Test POL on Polygon Amoy** (~0.1 POL is plenty) — get it from
    <https://faucet.polygon.technology>
  - **The `ISSUER_ROLE` on the deployed contract** (see "Issuer role" below)

You do NOT need to redeploy the contract. The existing one on Polygon Amoy works
fine for any number of installations of this app.

## Quick start

```bash
git clone <repo>
cd certino-app
npm install
cp .env.example .env       # then edit .env with your own values, see below
npm run dev                # http://localhost:3000
```

## Environment variables

There are five env vars. Three are public values (the contract address and RPCs)
that everyone using the same deployed contract should share. Two are secrets
that you generate yourself.

Copy `.env.example` to `.env` and edit:

```bash
# ─── Shared / public values ────────────────────────────────────────────
# These point at the existing deployed contract on Polygon Amoy.
# Don't change unless you redeploy your own contract (see "Deploy your
# own contract" below).
CONTRACT_ADDRESS=0x619AEdAaed89B85288B9e11131684321f0E7574a
NEXT_PUBLIC_CONTRACT_ADDRESS=0x619AEdAaed89B85288B9e11131684321f0E7574a
NEXT_PUBLIC_AMOY_RPC_URL=https://rpc-amoy.polygon.technology

# ─── Your own values ───────────────────────────────────────────────────
# RPC the SERVER uses to talk to the chain. Public RPC works but is
# rate-limited; an Alchemy key is more reliable. Same key as Sepolia
# works on Polygon — Alchemy lets you select the network per app.
AMOY_RPC_URL=https://rpc-amoy.polygon.technology

# Private key of YOUR issuer wallet. Never commit this. Server-only —
# the `NEXT_PUBLIC_` prefix is deliberately absent so Next.js cannot
# bundle it into client JS.
ISSUER_PRIVATE_KEY=0xyour_private_key_here
```

### Why two RPC URLs?

- **`AMOY_RPC_URL`** (no prefix) is read by the API routes on the server.
  This can include an Alchemy API key without leaking it.
- **`NEXT_PUBLIC_AMOY_RPC_URL`** is bundled into the client JavaScript and
  used by the cancel flow (browser → MetaMask → chain). Anything with the
  `NEXT_PUBLIC_` prefix becomes visible to every visitor; never put a
  secret RPC key there.

### Why two contract addresses?

Same value, two scopes. `CONTRACT_ADDRESS` is read by API routes;
`NEXT_PUBLIC_CONTRACT_ADDRESS` is read by the browser cancel flow. Next.js
keeps them strictly separate to prevent accidental secret leakage.

## Issuer role

The smart contract `GreenWattCertificate.sol` has an `onlyRole(ISSUER_ROLE)`
modifier on `issue()`. Only addresses granted that role can mint certificates.
The `DEFAULT_ADMIN_ROLE` (the deployer) can grant additional issuers.

If you want to run the app with your own issuer wallet:

1. Generate a fresh private key (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and prefix with `0x`)
2. Send it ~0.1 POL on Amoy from the faucet
3. Ask the contract admin to call:
   ```solidity
   contract.grantRole(ISSUER_ROLE, <your-address>)
   ```
   …or, if you can't get the admin to do this, deploy your own contract (next section).
4. Put the private key in `ISSUER_PRIVATE_KEY` and restart the dev server.

The server reads this key once at request time, signs the mint, and broadcasts.
The key never leaves the server process; it's never sent to the browser.

## Deploy your own contract

If you want full ownership over the contract (e.g. to be the admin who grants
issuer roles), the contract source lives in a sibling repo:
<https://github.com/...> (see `INTEGRATION.md` in that repo for full deploy
instructions).

Short version, from the contract repo:

```bash
cd ../hackathon                                    # the sibling contract repo
cp .env.example .env                               # set PRIVATE_KEY + AMOY_RPC_URL
npm install
npx hardhat run scripts/deploy.js --network amoy   # prints new contract address
```

Then in this app's `.env`, replace `CONTRACT_ADDRESS` and
`NEXT_PUBLIC_CONTRACT_ADDRESS` with the new address. The deployer
automatically holds `ISSUER_ROLE`, so set `ISSUER_PRIVATE_KEY` to the
deployer's key.

## How it works

### Two wallets, two responsibilities

| Wallet | Where the key lives | What it signs |
|---|---|---|
| **Issuer** | Server (`ISSUER_PRIVATE_KEY` env var) | Mint transactions |
| **Producer / Buyer** | User's MetaMask | Cancel transactions |

This split exists because minting requires the protocol's authorization
(issuer role) but cancelling requires the certificate owner's authorization.
The producer's wallet is used at mint time only to identify the recipient;
the producer themselves doesn't sign or pay gas to mint.

### Mint flow

1. Producer connects MetaMask in the browser.
2. Wizard collects device + energy details.
3. Producer signs an off-chain authorization message in MetaMask
   (just for UX — no contract enforcement; the server still gates issuance).
4. Browser POSTs to `/api/mint` with `{producer, kWh, productionStart, deviceLabel, energySource}`.
5. Server-side `lib/contract.server.ts` loads `ISSUER_PRIVATE_KEY`, signs the
   `issue()` transaction, broadcasts to Amoy.
6. Returns `{tokenId, txHash, explorerUrl}` to the frontend.
7. UI shows a success screen with a real PolygonScan link.

The server pays gas. Producers don't need POL.

### Cancel flow

1. Holder of a certificate clicks "Cancel" in the UI.
2. Modal collects quantity + beneficiary address.
3. Browser uses `ethers.BrowserProvider` + `window.ethereum` (MetaMask).
4. MetaMask pops up showing the actual `cancel()` transaction with gas.
5. User signs and pays gas.
6. Tx broadcasts directly to Amoy from the browser. **No server involvement.**
7. UI re-reads `/api/certificates/[id]` to refresh `remaining`.

The contract enforces `msg.sender == ownerOf(tokenId)`. Only the certificate's
current owner can cancel.

### Deregister (UI-only)

The contract has no per-device record — `deviceId` is just `bytes32` metadata
on each bundle. So "deregister" is a frontend hide, not an on-chain action.
Persisted in `localStorage` keyed by wallet address. Past certificates remain
valid and stay in the wallet; the producer simply stops appearing in the
producer's own registry view. Re-registering with the same device label later
works fine — the contract has no de-dupe.

## Project layout

```
abi/GreenWattCertificate.json     ← contract ABI
app/api/health/route.ts            ← GET /api/health
app/api/mint/route.ts              ← POST /api/mint (server-signs + broadcasts)
app/api/certificates/[id]/route.ts ← GET /api/certificates/[id]
app/page.tsx                       ← entry point
components/certino-demo.jsx        ← single-file React UI (~4400 lines)
lib/contract.server.ts             ← server-only ethers factories
lib/cancel.client.ts               ← browser-only cancel helper
.env.example                       ← env var template
```

## Verification

After setting up, verify the basics work:

```bash
# Server health
curl http://localhost:3000/api/health
# {"ok":true,"ts":"..."}

# Read a certificate from the chain
curl http://localhost:3000/api/certificates/1
# {"tokenId":"1","owner":"0x...","bundle":{...},"status":0,...}

# Mint a test certificate (replace the producer with your own MetaMask address)
curl -X POST http://localhost:3000/api/mint \
  -H 'Content-Type: application/json' \
  -d '{"producer":"0xYourMetaMaskAddress","kWh":1,"productionStart":"2026-05-09T15:00:00Z","deviceLabel":"test-device"}'
# {"ok":true,"txHash":"0x...","tokenId":"...","explorerUrl":"https://amoy.polygonscan.com/tx/0x..."}
```

If `/api/mint` returns:
- **`Missing required server env var: AMOY_RPC_URL`** → check `.env` exists and the var is set
- **`Missing required server env var: ISSUER_PRIVATE_KEY`** → same
- **`AccessControlUnauthorizedAccount`** → your issuer wallet doesn't have `ISSUER_ROLE`. See "Issuer role" above.
- **`insufficient funds for gas`** → fund the issuer wallet from the Amoy faucet

## MetaMask setup

Add Polygon Amoy to MetaMask:

- Network name: `Polygon Amoy`
- RPC URL: `https://rpc-amoy.polygon.technology`
- Chain ID: `80002`
- Currency: `POL`
- Explorer: `https://amoy.polygonscan.com`

Or use <https://chainlist.org/?search=amoy> for a one-click add.

For the cancel flow, the user's wallet needs ~0.01 POL for gas. The faucet
gives plenty.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript 5 (`target: ES2020` for BigInt literals)
- Tailwind 4
- ethers ^6.16.0
- Polygon Amoy testnet (chainId 80002)

## Out of scope

This is a hackathon demo. The following are intentionally not implemented:

- Real IPFS metadata pinning (`tokenURI` is a placeholder)
- A buyer-side marketplace (the buyer view is mocked)
- Multi-issuer / multisig governance
- Event indexer for transaction history
- Authentication / database / multi-tenancy

---

# Treetino Protocol Architecture

A decentralized, end-to-end ESG certificate protocol that seamlessly tokenizes real-world solar energy assets. Treetino acts as the bridge between physical energy production and on-chain crypto marketplaces, enabling energy providers to automatically mint verifiable ESG NFTs.

## 🏗️ High-Level Architecture

The protocol is divided into three distinct steps:

1. **Energy Data Aggregation (Backend)**
   - Connects to various proprietary solar inverter APIs (Victron, SMA, Fronius, Huawei, SolarEdge, Enphase).
   - Standardizes the hardware data into a unified, EnergyTag-compliant schema (GPS coordinates, time, kWh, FuelType).
   
2. **Chainlink Oracle & Keepers (On-Chain Bridge)**
   - **Keepers (Automation)**: A smart contract (`TreetinoKeeper`) triggered on an hourly interval. It pings the Oracle to pull the latest hour's production.
   - **Oracle Consumer**: A smart contract (`TreetinoOracleConsumer`) utilizing Chainlink Functions. It executes JavaScript off-chain to pull the standardized data from the Aggregation Backend.
   
3. **NFT Minting & Marketplace (Downstream Ecosystem)**
   - Once the Chainlink DON (Decentralized Oracle Network) verifies and returns the data, the Oracle contract automatically triggers the `mintNFT` function on the downstream ERC-721 contract.
   - The verified ESG certificates are then listed on third-party marketplaces.

## 🚀 The End-to-End Flow

Here is the exact lifecycle of a single hour of energy production:

1. The solar panel produces `4.2 kWh` of energy.
2. The `TreetinoKeeper` contract realizes 1 hour has passed and triggers `performUpkeep`.
3. The `TreetinoOracleConsumer` asks the Chainlink DON to execute `ChainlinkRequest.js`.
4. Chainlink nodes reach out to your Aggregator Backend.
5. The Aggregator authenticates with the solar inverter (e.g., Victron), formats the `4.2 kWh` response into an integer (e.g., `420`), and returns it to Chainlink.
6. The Chainlink DON forms a consensus and sends the verified `420` value back to the `TreetinoOracleConsumer` on the blockchain.
7. The Oracle Consumer contract records the timestamp and immediately calls `mintNFT(420, timestamp)` on the NFT contract.
8. The NFT is minted and immediately appears in the frontend app and the marketplace.

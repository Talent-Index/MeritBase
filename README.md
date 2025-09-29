# MeritBase 🚀
**Decentralized Professional Identity & Gig Marketplace**

MeritBase is a **Web3-powered platform** for freelancers and employers to connect in a **trustless, transparent, and fraud-resistant** way.  
It combines **Polygon smart contracts, IPFS storage, AI-powered gig matching, and wallet-based authentication** to create a verifiable **CVWallet** that grows with every gig completed.

---

## ✨ Features
- **Verifiable CVWallet** → Freelancers store biodata, CVs, and government IDs on IPFS, hashed & anchored on Polygon.
- **Employer Verification** → Companies upload business licenses that are pinned to IPFS and validated before posting jobs.
- **AI-Powered Matching** → HuggingFace embeddings auto-match jobs with best-fit freelancers.
- **Immutable Reviews** → Employers issue on-chain reviews, badges, and ratings after gigs are completed.
- **Fraud Prevention** → Wallet-based login, KYC checks, and on-chain reputation to keep scammers out.
- **Cross-Platform CV** → Connect external platforms (Fiverr, Upwork, LinkedIn) to auto-generate a clean, professional CV.

---

## 🏗 Architecture

### 🔹 Backend
- **Next.js API routes** → Handle uploads, encryption, and IPFS pinning.  
- **MeritBase API service** → Routes for onboarding, jobs, applications, and reviews.  
- **Optional Database (Postgres/Supabase)** → Indexing metadata for fast querying & filtering.  

### 🔹 Smart Contracts
- `FreelancerRegistry.sol` → Registers freelancers (profile, CV hash, gov ID).  
- `EmployerRegistry.sol` → Registers employers (company, license hash).  
- `JobBoard.sol` → Enables job posting, applying, shortlisting, and reviews.  

### 🔹 Storage
- **On-Chain (Polygon)** → Hashes of CVs, licenses, reviews.  
- **IPFS/Filecoin** → Documents (CV, government ID, licenses, portfolios).  
- **Database (Optional)** → For quick search & AI embeddings.

---

## 🔐 Authentication
- Wallet-based authentication with **RainbowKit** & **wagmi**.  
- No passwords, just wallet signatures.  
- JWT bridge (optional) for session management.  
- Roles: **Freelancers** vs **Employers**, enforced via smart contracts.  

---

## 🖥 UI & UX
- Built with **Next.js, TailwindCSS, DaisyUI**.  
- Shared utility classes (`.page-container`, `.card`) for consistent spacing & surfaces.  
- **Freelancer Dashboard** → Manage gigs, applications, CVWallet growth.  
- **Employer Dashboard** → Post jobs, view matches, leave reviews.  
- **Onboarding Flows** → Guided setup for freelancers and employers (Profile → Wallet → Complete).  

---

## 🛠 Tech Stack
- **Frontend**: Next.js (App Router), TailwindCSS, DaisyUI.  
- **Smart Contracts**: Solidity, Hardhat, Scaffold-ETH 2.  
- **Storage**: IPFS, Filecoin, Polygon.  
- **AI Matching**: HuggingFace models for embeddings.  
- **Wallets**: RainbowKit, MetaMask, WalletConnect.  

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Talent-Index/MeritBase.git
cd MeritBase
```

### 2️⃣ Install Dependencies & Run
To run the full MeritBase application on your local machine, you will need three separate terminal windows.

#### 1. Start the Local Blockchain
In your first terminal, start the local Hardhat blockchain node. This will simulate a local Ethereum environment.
```bash
yarn chain
```
or
```bash
npm run chain
```

#### 2. Deploy Smart Contracts
Once the blockchain is running, open a second terminal to deploy the smart contracts to your local node.
```bash
yarn deploy
```
or
```bash
npm run deploy
```

#### 3. Run the Frontend Application
Finally, in a third terminal, start the Next.js development server to run the web application.
```bash
yarn dev
```
or
```bash
npm run dev
```
Your application will be available at `http://localhost:9002`.

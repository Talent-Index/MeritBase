# MeritBase - Decentralized Identity Wallet for On-Chain CV

MeritBase is a Scaffold-ETH 2 dApp prototype that enables users to build verifiable professional profiles and receive attestation stamps (NFT badges) for completed work. It provides a portable reputation layer with QR code sharing and a mobile-friendly interface.

## Features

### 🏗️ Smart Contract Features
- **User Profile Management**: Create and update professional profiles with name, pseudonym, skills, and work categories
- **Job Stamp System**: Clients can issue verifiable NFT badges for completed work
- **Rating System**: 1-5 star rating system for job quality assessment
- **Verification**: Admin-verified stamps for enhanced credibility
- **Statistics**: Track total stamps, average ratings, and profile metrics

### 🎨 Frontend Features
- **Mobile-Friendly UI**: Responsive design optimized for mobile devices
- **Profile Management**: Easy profile creation and editing
- **QR Code Sharing**: Generate QR codes for portable reputation sharing
- **Job Stamp Display**: Beautiful cards showing verified work history
- **Public Profiles**: Shareable profile pages for external verification
- **Real-time Updates**: Live data from blockchain contracts

## Smart Contract Architecture

### MeritBase Contract
The main contract (`MeritBase.sol`) inherits from OpenZeppelin's ERC721, ERC721URIStorage, and Ownable contracts.

**Key Structs:**
```solidity
struct UserProfile {
    string name;
    string pseudonym;
    string[] skills;
    string[] workCategories;
    bool isActive;
    uint256 createdAt;
    uint256 lastUpdated;
}

struct JobStamp {
    uint256 tokenId;
    address client;
    string jobTitle;
    string summary;
    uint8 rating; // 1-5 stars
    uint256 completedDate;
    string clientSignature;
    bool isVerified;
}
```

**Main Functions:**
- `createProfile()` - Register a new user profile
- `updateProfile()` - Update existing profile information
- `giveStamp()` - Issue a job stamp to a worker
- `getUserProfile()` - Retrieve user profile data
- `getUserStamps()` - Get all stamps for a user
- `getJobStamp()` - Get specific stamp details
- `getUserAverageRating()` - Calculate average rating
- `verifyStamp()` - Admin verification of stamps

## Frontend Components

### Pages
- **`/`** - Main MeritBase dApp interface for profile management and stamp viewing (home page)
- **`/profile/[address]`** - Public profile page for sharing and verification

### Components
- **`ProfileCard`** - Displays user profile with QR code and statistics
- **`JobStampCard`** - Shows individual job stamps with ratings and verification
- **`useJobStamp`** - Custom hook for fetching individual stamp data

## Getting Started

### Prerequisites
- Node.js and Yarn
- Git

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

### Development
1. Start the local blockchain:
   ```bash
   yarn chain
   ```

2. Deploy the contracts:
   ```bash
   yarn deploy
   ```

3. Start the frontend:
   ```bash
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

#### Creating a Profile
1. Connect your wallet
2. Visit the home page (MeritBase loads automatically)
3. Click "Create Profile"
4. Fill in your name, pseudonym, skills, and work categories
5. Submit the transaction

#### Giving a Job Stamp
1. Click "Give Stamp" button
2. Enter the worker's wallet address
3. Fill in job details (title, summary, rating)
4. Add your client signature
5. Submit the transaction

#### Viewing Public Profiles
1. Navigate to `/profile/[wallet-address]`
2. View the worker's profile and verified stamps
3. Scan the QR code to share the profile

## Mobile Optimization

The dApp is fully optimized for mobile devices with:
- Responsive grid layouts
- Touch-friendly buttons and inputs
- Compact card designs for small screens
- Optimized typography and spacing
- Mobile-specific QR code sizing

## QR Code Integration

Each profile generates a unique QR code that links to the public profile page:
- Format: `https://meritbase.app/profile/[wallet-address]`
- Enables easy sharing of professional reputation
- Works with any QR code scanner
- Portable across different platforms

## Technology Stack

- **Smart Contracts**: Solidity, OpenZeppelin
- **Frontend**: Next.js, React, TypeScript
- **Blockchain**: Hardhat, Ethers.js
- **UI**: Tailwind CSS, Heroicons
- **QR Codes**: qrcode.react
- **Wallet**: RainbowKit, Wagmi

## Contract Address

The MeritBase contract is deployed at: `0x5FbDB2315678afecb367f032d93F642f64180aa3` (localhost)

## Future Enhancements

- IPFS integration for metadata storage
- Multi-signature verification for stamps
- Reputation scoring algorithms
- Integration with other DeFi protocols
- Mobile app development
- Advanced analytics and insights

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**MeritBase** - Building the future of decentralized professional identity 🚀

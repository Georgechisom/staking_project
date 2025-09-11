# Staking Frontend

A modern, responsive Web3 staking application built with React, TypeScript, and Vite. This frontend provides a user-friendly interface for interacting with a blockchain-based staking smart contract, allowing users to stake tokens, view their staking statistics, claim rewards, and manage their positions.

## Features

### Core Functionality

- **Wallet Integration**: Seamless connection with multiple Web3 wallets using RainbowKit
- **Token Staking**: Stake ERC-20 tokens in the staking contract
- **Real-time Dashboard**: View comprehensive staking statistics and user information
- **Reward Management**: Claim accumulated staking rewards
- **Emergency Withdrawal**: Emergency withdrawal with penalty for urgent situations
- **Responsive Design**: Mobile-first design that works across all devices

### User Experience

- **Intuitive UI**: Clean, modern interface with smooth animations
- **Real-time Updates**: Live data updates using Web3 hooks
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Proper loading indicators for all async operations
- **Toast Notifications**: Success and error notifications using Sonner

## Tech Stack

### Frontend Framework

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### Web3 Integration

- **Wagmi** - React hooks for Ethereum
- **RainbowKit** - Wallet connection modal
- **Viem** - TypeScript interface for Ethereum

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons

### Development Tools

- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **React Router** - Client-side routing

## Project Structure

```
frontend/staking_frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   ├── Layout/               # Main layout component
│   │   ├── StatsCards.tsx        # Statistics display cards
│   │   ├── StakingForm.tsx       # Staking input form
│   │   ├── RewardsClaim.tsx      # Rewards claiming component
│   │   ├── WithdrawalInterface.tsx # Withdrawal interface
│   │   └── EmergencyWithdrawal.tsx # Emergency withdrawal
│   ├── hooks/
│   │   ├── useStake.ts           # Staking functionality hook
│   │   ├── useGetUserDetails.ts  # User details fetching hook
│   │   ├── useTotalStakes.ts     # Total staked amount hook
│   │   ├── useClaimRewards.ts    # Rewards claiming hook
│   │   └── useWithdraw.ts        # Withdrawal functionality hook
│   ├── pages/
│   │   ├── Dashboard.tsx         # Main dashboard page
│   │   ├── Stake.tsx             # Staking page
│   │   ├── Withdraw.tsx          # Withdrawal page
│   │   └── Rewards.tsx           # Rewards page
│   ├── config/
│   │   └── Abi.ts                # Smart contract ABIs
│   ├── lib/
│   │   └── utils.ts              # Utility functions
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Web3 wallet (MetaMask, Rainbow, etc.)

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd staking_project/frontend/staking_frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   VITE_Staking_Contract_Address=0xYourStakingContractAddress
   VITE_RPC_URL=https://your-rpc-endpoint
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Usage

### Connecting a Wallet

1. Click the "Connect Wallet" button
2. Select your preferred Web3 wallet
3. Approve the connection in your wallet

### Staking Tokens

1. Navigate to the Stake page
2. Enter the amount of tokens to stake
3. Click "Stake" and confirm the transaction

### Viewing Dashboard

- The Dashboard displays your staked amount, pending rewards, and time until unlock
- Real-time statistics are shown in the stats cards
- All data updates automatically when transactions are confirmed

### Claiming Rewards

1. Go to the Rewards page
2. Click "Claim Rewards" to collect your accumulated rewards

### Withdrawing Stakes

1. Navigate to the Withdraw page
2. Enter the amount to withdraw
3. Click "Withdraw" and confirm the transaction

## Smart Contract Integration

The frontend interacts with a staking smart contract that provides:

- **Staking Functionality**: Lock tokens for rewards
- **Reward Calculation**: Automatic reward accrual
- **Time Locks**: Minimum staking periods
- **Emergency Withdrawal**: Penalty-based early withdrawal
- **Admin Functions**: Contract management features

### Contract Functions Used

- `getUserDetails()` - Fetch user staking information
- `stake()` - Stake tokens
- `withdraw()` - Withdraw staked tokens
- `claimRewards()` - Claim accumulated rewards
- `emergencyWithdraw()` - Emergency withdrawal with penalty

## UI Components

### Key Components

- **StatsCards**: Display global staking statistics
- **StakingForm**: Input form for staking amounts
- **RewardsClaim**: Interface for claiming rewards
- **WithdrawalInterface**: Withdrawal amount input
- **EmergencyWithdrawal**: Emergency withdrawal with penalty info

### Design System

- **Colors**: Purple-themed color scheme
- **Typography**: Clean, readable fonts
- **Animations**: Smooth transitions using Framer Motion
- **Responsive**: Mobile-first responsive design

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Quality

- TypeScript for type safety
- ESLint for code consistency
- Prettier for code formatting (if configured)

### Environment Variables

- `VITE_Staking_Contract_Address`: Deployed staking contract address
- `VITE_RPC_URL`: Ethereum RPC endpoint URL

## Testing

### Manual Testing Checklist

- [x] Wallet connection works with multiple providers
- [x ] Staking transactions complete successfully
- [ ] Dashboard displays correct user data
- [x] Error states are handled gracefully
- [x] Mobile responsiveness across devices
- [x] Loading states display properly

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent code style
- Add proper error handling
- Test on multiple browsers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Ensure your wallet is connected and funded
3. Verify the contract address is correct
4. Check network connectivity

## Future Enhancements

- [ ] Multi-chain support
- [ ] Advanced analytics dashboard
- [ ] Notification system for rewards
- [ ] Governance features
- [ ] Mobile app version
- [ ] Advanced charting for staking history

---

Built with using React, TypeScript, and Web3 technologies.

# Frontend Staking Application

## Overview

This frontend application provides a user interface for interacting with a staking smart contract. Users can connect their wallet, view their token balance, approve tokens for staking, stake tokens, mint tokens, and claim rewards. The app also displays user staking statistics and supports dark/light mode toggling.

## Features

- Wallet connection and user authentication
- Display of user token balance with real time updates
- Token minting functionality
- Token approval for staking
- Staking tokens with input validation
- Claiming staking rewards
- Display of staking statistics and user lists
- Live countdown for lock period until unlock
- Responsive design with a 3-column grid layout on larger screens
- Dark and light mode toggle for user preference

## Installation

1. Clone the repository.
2. Navigate to the `frontend/staking_frontend` directory.
3. Install dependencies:
   ```
   npm install
   ```

## Running the Application

Start the development server with:

```
npm run dev
```

This will launch the app locally, typically accessible at `http://localhost:3000`.

## Usage

### Connecting Wallet

- Upon loading the app, connect your wallet using the wallet connection component.
- The app supports wallet connection via the `wagmi` library.

### Viewing Balance

- Your token balance is displayed and updates
- The balance is formatted to 4 decimal places for readability.

### Minting Tokens

- Use the "Mint Token" button to mint tokens.
- Minting requires a valid amount and wallet connection.

### Approving Tokens

- Before staking, approve the amount of tokens you want to stake.
- Enter the amount and click "Approve".
- Approval status is indicated with loading and success messages.

### Staking Tokens

- After approval, enter the amount to stake and click "Stake".
- Staking status is indicated with loading and success messages.

### Claiming Rewards

- Navigate to the rewards page to claim your staking rewards.
- Rewards can be claimed using the "Claim Rewards" button.

### Dashboard

- The dashboard displays staking statistics, including total staked tokens and a list of stakers.
- A live countdown shows the time remaining until tokens can be unlocked.

### Theme Toggle

- Use the theme toggle button in the navigation bar to switch between dark and light modes.

## Code Structure

- `components/`: React components for UI elements such as forms, cards, and layout.
- `hooks/`: Custom React hooks for interacting with the blockchain and managing state.
- `pages/`: Page components for routing and main views like Dashboard, Rewards, Stake, and Withdraw.
- `config/`: Configuration files including contract ABIs.
- `assets/`: Static assets like images and icons.

## Testing

- Manual testing is recommended by interacting with all UI elements.
- Verify wallet connection, token minting, approval, staking, and rewards claiming flows.
- Check responsiveness and theme toggling.
- Ensure error messages display correctly for invalid inputs.

## Dependencies

- React and React DOM
- wagmi for wallet and blockchain interaction
- viem for Ethereum utilities like formatting and parsing
- framer-motion for animations
- sonner for toast notifications
- react-router-dom for client-side routing

## Notes

- Ensure your wallet is connected to the correct network matching the deployed contracts.
- The app assumes the presence of staking and token contracts deployed at the configured addresses.
- Token amounts are handled in wei units internally; user inputs are converted accordingly.

## Support

For issues or questions, please refer to the project repository or contact the development team.

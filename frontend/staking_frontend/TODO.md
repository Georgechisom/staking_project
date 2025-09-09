# TODO List for Staking dApp Frontend Enhancement

## 1. Install Dependencies

- [x] Install framer-motion
- [x] Install react-router-dom
- [x] Install shadcn/ui components: button, input, card, dialog, table, etc.

## 2. Convert and Enhance Layout

- [x] Convert Layout/index.jsx to index.tsx
- [x] Make navbar responsive with hamburger menu on mobile
- [x] Position ConnectButton as FAB on mobile
- [x] Add animations to layout elements

## 3. Set Up Routing

- [x] Update App.tsx to include BrowserRouter and Routes
- [x] Define routes for dashboard, stake, withdraw, etc.

## 4. Create Staking Components

- [x] StakingForm.tsx: Input field, validation, max button, submit with animations
- [x] WithdrawalInterface.tsx: Amount input, confirmations, animations
- [x] RewardsClaim.tsx: Display pending rewards, claim button with spinner and success animation
- [x] EmergencyWithdrawal.tsx: Modal with warnings and confirmations
- [ ] StakePositionsDashboard.tsx: Table/grid for all stake positions
- [ ] UserStakePositions.tsx: Expandable cards for user's stakes
- [x] StatsCards.tsx: Cards for protocol statistics (total staked, APR, users)

## 5. Integrate Mock Data

- [ ] Create hooks or constants for mock staking data, rewards, positions

## 6. Styling and Animations

- [ ] Apply dark mode theme with crypto-inspired colors (blues, purples)
- [ ] Add gradients, subtle shadows
- [ ] Use framer-motion for smooth animations on forms, buttons, transitions

## 7. Accessibility and UX

- [ ] Add ARIA labels
- [ ] Implement loading states, error handling, tooltips

## 8. Testing and Optimization

- [ ] Test responsiveness across devices
- [ ] Optimize performance
- [ ] Verify wallet integration

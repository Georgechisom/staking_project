# TODO: Fix useGetUserDetails Hook for Dashboard

## Tasks

- [x] Fix useGetUserDetails interface to match contract ABI (stakedAmount, pendingRewards, timeUntilUnlock)
- [x] Update Dashboard.tsx to use useGetUserDetails instead of useStake for user info display
- [x] Handle loading and error states in Dashboard
- [x] Add conditional contract call only when wallet is connected
- [x] Add wallet connection check in Dashboard
- [x] Improve error messages and debugging logs
- [x] Add useWatchContractEvent to useGetUserDetails for real-time updates on Staked, Withdrawn, EmergencyWithdrawn, RewardsClaimed events
- [x] Test Dashboard to ensure user information displays correctly

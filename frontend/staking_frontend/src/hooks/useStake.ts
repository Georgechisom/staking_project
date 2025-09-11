import { useReadContract, useAccount, useWatchContractEvent } from "wagmi";
import { Staking_Contract_Abi } from "../config/Abi";

interface UserDetails {
  stakedAmount: bigint;
  lastStakeTimestamp: bigint;
  pendingRewards: bigint;
  timeUntilUnlock: bigint;
  canWithdraw: boolean;
}

interface UseStakeReturn {
  isLoading: boolean;
  error: string | null;
  userStakedAmount: bigint;
  userPendingRewards: bigint;
  timeUntilUnlock: bigint;
  totalStaked: bigint;
  isPaused: boolean;
  canWithdraw: boolean;
}

export const useStake = (): UseStakeReturn => {
  const { address } = useAccount();

  // Contract address
  const contractAddress = import.meta.env
    .VITE_Staking_Contract_Address as `0x${string}`;

  // Read contract data
  const { data: userDetails, refetch: refetchUserDetails } = useReadContract({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    functionName: "getUserDetails",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: totalStaked, refetch: refetchTotalStaked } = useReadContract({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    functionName: "totalStaked",
  });

  const { data: isPaused, refetch: refetchIsPaused } = useReadContract({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    functionName: "paused",
  });

  // Watch for contract events
  useWatchContractEvent({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    eventName: "Staked",
    onLogs: (logs) => {
      if (logs.length > 0) {
        refetchUserDetails();
        refetchTotalStaked();
        refetchIsPaused();
      }
    },
  });

  // Event watchers are handled in individual hooks (useWithdraw, useClaimRewards)

  const isLoading = false; // Set to true if you have loading state
  const error = null; // Set to error message if any

  return {
    isLoading,
    error,
    userStakedAmount: (userDetails as UserDetails)?.stakedAmount || 0n,
    userPendingRewards: (userDetails as UserDetails)?.pendingRewards || 0n,
    timeUntilUnlock: (userDetails as UserDetails)?.timeUntilUnlock || 0n,
    totalStaked: (totalStaked as bigint) || 0n,
    isPaused: (isPaused as boolean) || false,
    canWithdraw: (userDetails as UserDetails)?.canWithdraw || false,
  };
};

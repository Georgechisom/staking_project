import { toast } from "sonner";
import { useCallback, useState } from "react";
import {
  usePublicClient,
  useWriteContract,
  useReadContract,
  useAccount,
  useWatchContractEvent,
} from "wagmi";
import { Staking_Contract_Abi } from "../config/Abi";

interface UserDetails {
  stakedAmount: bigint;
  lastStakeTimestamp: bigint;
  pendingRewards: bigint;
  timeUntilUnlock: bigint;
  canWithdraw: boolean;
}

interface StakeResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

interface UseStakeReturn {
  stake: (amount: bigint) => Promise<StakeResult>;
  isLoading: boolean;
  error: string | null;
  userStakedAmount: bigint;
  userPendingRewards: bigint;
  timeUntilUnlock: bigint;
  totalStaked: bigint;
  isPaused: boolean;
}

export const useStake = (): UseStakeReturn => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Watch for Staked events
  useWatchContractEvent({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    eventName: "Staked",
    onLogs: (logs) => {
      // Refetch data when any Staked event occurs
      if (logs.length > 0) {
        refetchUserDetails();
        refetchTotalStaked();
        refetchIsPaused();
      }
    },
  });

  const stake = useCallback(
    async (amount: bigint): Promise<StakeResult> => {
      if (!publicClient || !writeContractAsync || !address) {
        const errorMsg = "Wallet not connected";
        toast.error(errorMsg, {
          description: "Please connect your wallet to continue",
        });
        return { success: false, error: errorMsg };
      }

      if (amount <= 0n) {
        const errorMsg = "Invalid amount";
        toast.error(errorMsg, {
          description: "Amount must be greater than 0",
        });
        return { success: false, error: errorMsg };
      }

      if (isPaused) {
        const errorMsg = "Staking is currently paused";
        toast.error(errorMsg, {
          description: "Please try again later",
        });
        return { success: false, error: errorMsg };
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("Staking amount:", amount);

        const txHash = await writeContractAsync({
          address: contractAddress,
          abi: Staking_Contract_Abi,
          functionName: "stake",
          args: [amount],
        });

        console.log("Transaction hash:", txHash);

        // Wait for transaction confirmation
        const txReceipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });

        if (txReceipt.status === "success") {
          toast.success("Staking successful!", {
            description: `Successfully staked ${amount.toString()} tokens`,
          });
          // Refetch data after successful stake
          refetchUserDetails();
          refetchTotalStaked();
          refetchIsPaused();
          return { success: true, txHash };
        } else {
          const errorMsg = "Transaction failed";
          toast.error(errorMsg, {
            description: "The transaction was reverted. Please try again.",
          });
          return { success: false, error: errorMsg };
        }
      } catch (err: unknown) {
        console.error("Staking error:", err);
        const errorMsg =
          err instanceof Error
            ? err.message
            : "An error occurred while staking";
        setError(errorMsg);
        toast.error("Staking failed", {
          description: errorMsg,
        });
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [
      publicClient,
      writeContractAsync,
      address,
      isPaused,
      contractAddress,
      refetchUserDetails,
      refetchTotalStaked,
      refetchIsPaused,
    ]
  );

  return {
    stake,
    isLoading,
    error,
    userStakedAmount: (userDetails as UserDetails)?.stakedAmount || 0n,
    userPendingRewards: (userDetails as UserDetails)?.pendingRewards || 0n,
    timeUntilUnlock: (userDetails as UserDetails)?.timeUntilUnlock || 0n,
    totalStaked: (totalStaked as bigint) || 0n,
    isPaused: (isPaused as boolean) || false,
  };
};

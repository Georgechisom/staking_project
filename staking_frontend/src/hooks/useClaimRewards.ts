import { toast } from "sonner";
import { useCallback, useState } from "react";
import {
  usePublicClient,
  useWriteContract,
  useAccount,
  useReadContract,
  useWatchContractEvent,
} from "wagmi";
import { Staking_Contract_Abi } from "../config/Abi";

interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

interface UserDetails {
  pendingRewards: bigint;
}

export const useClaimRewards = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = import.meta.env
    .VITE_Staking_Contract_Address as `0x${string}`;

  // Read user details to check pendingRewards
  const { data: userDetails, refetch: refetchUserDetails } = useReadContract({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    functionName: "getUserDetails",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Watch RewardsClaimed event to refetch user details
  useWatchContractEvent({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    eventName: "RewardsClaimed",
    onLogs: (logs) => {
      if (logs.length > 0) {
        refetchUserDetails();
      }
    },
  });

  const claimRewards = useCallback(async (): Promise<TransactionResult> => {
    if (!publicClient || !writeContractAsync || !address) {
      const errorMsg = "Wallet not connected";
      toast.error(errorMsg, {
        description: "Please connect your wallet to continue",
      });
      
      setError(errorMsg);

      return { success: false, error: errorMsg };
    }

    const userDetailsData = userDetails as UserDetails;
    if (
      !userDetailsData?.pendingRewards ||
      userDetailsData.pendingRewards <= 0n
    ) {
      const errorMsg = "No rewards to claim";
      toast.error(errorMsg, {
        description: "You don't have any pending rewards",
      });
      
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi: Staking_Contract_Abi,
        functionName: "claimRewards",
        args: [],
      });

      const txReceipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (txReceipt.status === "success") {
        toast.success("Rewards claimed!", {
          description: `Successfully claimed ${userDetailsData.pendingRewards.toString()} tokens`,
        });
        refetchUserDetails();
        return { success: true, txHash };
      } else {
        const errorMsg = "Transaction failed";
        toast.error(errorMsg, {
          description: "The transaction was reverted. Please try again.",
        });
        return { success: false, error: errorMsg };
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "An error occurred while claiming rewards";
      setError(errorMsg);
      toast.error("Claim failed", { description: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [
    publicClient,
    writeContractAsync,
    address,
    userDetails,
    contractAddress,
    refetchUserDetails,
  ]);

  return {
    claimRewards,
    isLoading,
    error,
  };
};

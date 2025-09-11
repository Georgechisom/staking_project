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

interface UserWithdraw {
  stakedAmount: bigint;
  canWithdraw: boolean;
  withdraw: (amount: bigint) => Promise<TransactionResult>;
  isLoading: boolean;
  error: string | null;
}

export const useWithdraw = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = import.meta.env
    .VITE_Staking_Contract_Address as `0x${string}`;

  // Read user details to check canWithdraw and stakedAmount
  const { data: userDetails, refetch: refetchUserDetails } = useReadContract({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    functionName: "withdraw",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Watch Withdrawn and EmergencyWithdrawn events to refetch user details
  useWatchContractEvent({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    eventName: "Withdrawn",
    onLogs: (logs) => {
      if (logs.length > 0) {
        refetchUserDetails();
      }
    },
  });

  const withdraw = useCallback(
    async (amount: bigint): Promise<TransactionResult> => {
      if (!publicClient || !writeContractAsync || !address) {
        const errorMsg = "Wallet not connected";
        const errorWalletMsg = "Wallet not connected";
        setError(errorWalletMsg);
        return { success: false, error: errorMsg };
      } else {
        const SuccessMsg = "Wallet Connected";
        setError(SuccessMsg);
        // return { success: true, error: SuccessMsg };
      }

      setIsLoading(true);

      if (amount <= 0n) {
        const errorMsg = "Invalid amount";
        toast.error(errorMsg, { description: "Amount must be greater than 0" });
        const errorWalletMsg = "Invalid amount";
        setError(errorWalletMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }

      const userDetailsData = userDetails as UserWithdraw;
      if (!userDetailsData?.canWithdraw) {
        const errorMsg = "Cannot withdraw yet";
        const errorWalletMsg = "Can't Withdraw yet, Lock period not expired";
        setError(errorWalletMsg);
        setIsLoading(false);
        toast.error(errorMsg, { description: "Lock period not expired" });
        return { success: false, error: errorMsg };
      }

      if (amount > userDetailsData?.stakedAmount) {
        const errorMsg = "Insufficient staked amount";
        toast.error(errorMsg, {
          description: "Cannot withdraw more than staked amount",
        });
        const errorWalletMsg = "Insufficient staked amount";
        setError(errorWalletMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }

      setIsLoading(true);
      setError(null);

      try {
        const txHash = await writeContractAsync({
          address: contractAddress,
          abi: Staking_Contract_Abi,
          functionName: "withdraw",
          args: [amount],
        });

        const txReceipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });

        if (txReceipt.status === "success") {
          toast.success("Withdrawal successful!", {
            description: `Successfully withdrew ${amount.toString()} tokens`,
          });
          refetchUserDetails();
          return { success: true, txHash };
        } else {
          const errorMsg = "Transaction failed";
          toast.error(errorMsg, {
            description: "The transaction was reverted. Please try again.",
          });
          const errorWalletMsg = "Transaction failed";
          setError(errorWalletMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "An error occurred while withdrawing";
        setError(errorMsg);
        toast.error("Withdrawal failed", { description: errorMsg });
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [
      publicClient,
      writeContractAsync,
      address,
      userDetails,
      contractAddress,
      refetchUserDetails,
    ]
  );

  setTimeout(() => {
    setError(null);
    setTimeout(() => setError(null), 9000);
  }, 9000);

  return {
    withdraw,
    isLoading,
    error,
  };
};

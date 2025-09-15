import { toast } from "sonner";
import { useCallback, useState } from "react";
import {
  usePublicClient,
  useWriteContract,
  useAccount,
  useWatchContractEvent,
} from "wagmi";
import { Staking_Contract_Abi } from "../config/Abi";

interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export const useEmergencyWithdraw = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = import.meta.env
    .VITE_Staking_Contract_Address as `0x${string}`;

  useWatchContractEvent({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    eventName: "EmergencyWithdrawn",
    onLogs: (logs) => {
      if (logs.length > 0) {
        // Refetch or update state if needed
      }
    },
  });

  const emergencyWithdraw =
    useCallback(async (): Promise<TransactionResult> => {
      if (!publicClient || !writeContractAsync || !address) {
        const errorMsg = "Wallet not connected";
        toast.error(errorMsg, {
          description: "Please connect your wallet to continue",
        });
        const errorWalletMsg = "Wallet not connected";
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
          functionName: "emergencyWithdraw",
          args: [],
        });

        const txReceipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });

        if (txReceipt.status === "success") {
          toast.success("Emergency withdrawal successful!", {
            description: "Successfully performed emergency withdrawal",
          });
          return { success: true, txHash };
        } else {
          const errorMsg = "Transaction failed";
          toast.error(errorMsg, {
            description: "The transaction was reverted. Please try again.",
          });
          const errorWalletMsg = "Transaction Failed";
          setError(errorWalletMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "An error occurred during emergency withdrawal";
        setError(errorMsg);
        toast.error("Emergency withdrawal failed", { description: errorMsg });
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    }, [publicClient, writeContractAsync, address, contractAddress]);

  setTimeout(() => {
    setError(null);
    setTimeout(() => setError(null), 9000);
  }, 9000);

  return {
    emergencyWithdraw,
    isLoading,
    error,
  };
};

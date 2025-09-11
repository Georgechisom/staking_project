import { Staking_Contract_Abi, Staking_Token_Contract_Abi } from "@/config/Abi";
import { useCallback, useState } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";

interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

// interface UseStakeReturn {
//   approve: (amount: bigint) => Promise<TransactionResult>;
//   stake: (amount: bigint) => Promise<TransactionResult>;
//   mint: (amount: bigint) => Promise<TransactionResult>;
//   isLoading: boolean;
//   isMinting: boolean;
//   isApproving: boolean;
//   error: string | null;
//   userStakedAmount: bigint;
//   userPendingRewards: bigint;
//   timeUntilUnlock: bigint;
//   totalStaked: bigint;
//   isPaused: boolean;
//   canWithdraw: boolean;
// }

export const useUserState = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = import.meta.env
    .VITE_Staking_Contract_Address as `0x${string}`;
  const tokenAddress = import.meta.env
    .VITE_Staking_Token_Contract_Address as `0x${string}`;

  const approve = useCallback(
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

      setError(null);

      if (amount <= 0n) {
        const errorAmountMsg = "Invalid Amount";
        setError(errorAmountMsg);
        return { success: false, error: errorAmountMsg };
      } else if (!amount) {
        const errorNoAmountMsg = "No Inserted Amount";
        setError(errorNoAmountMsg);
        return { success: false, error: errorNoAmountMsg };
      }

      setIsApproving(true);
      setError(null);

      try {
        // Check user token balance
        const userBalanceRaw = await publicClient.readContract({
          address: tokenAddress,
          abi: Staking_Token_Contract_Abi,
          functionName: "balanceOf",
          args: [address],
        });

        const userBalance = BigInt(userBalanceRaw as string | number | bigint);

        if (userBalance < amount) {
          const errorMsg = "Insufficient token balance";
          console.log("insufficient token balance", userBalance);
          console.error(
            "insufficient token balance",
            userBalance,
            "Kindly mint Token"
          );

          return { success: false, error: errorMsg };
        }

        // After approval, wait and recheck allowance
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const newAllowance = await publicClient.readContract({
          address: tokenAddress,
          abi: Staking_Token_Contract_Abi,
          functionName: "allowance",
          args: [address, contractAddress],
        });

        // Convert allowance to bigint for comparison
        const currentAllowance = BigInt(
          newAllowance as string | number | bigint
        );

        if (currentAllowance < amount) {
          const approvalTxHash = await writeContractAsync({
            address: tokenAddress,
            abi: Staking_Token_Contract_Abi,
            functionName: "approve",
            args: [contractAddress, amount],
          });

          console.log("approval tx hash:", approvalTxHash);

          // Wait for approval transaction confirmation
          const approvalReceipt = await publicClient.waitForTransactionReceipt({
            hash: approvalTxHash,
          });

          if (approvalReceipt.status !== "success") {
            const errorMsg = "Approval transaction failed";

            return { success: false, error: errorMsg };
          } else {
            return { success: true, txHash: approvalTxHash };
          }
        } else {
          console.log("Sufficient allowance, skipping approve");
        }

        console.log("Approve amount:", amount);

        // If sufficient allowance and no errors, return success
        return { success: true };
      } catch (err: unknown) {
        console.error("Approve error:", err);
        const errorMsg = "An error occurred while approving";
        setError(errorMsg);

        return { success: false, error: errorMsg };
      } finally {
        setIsApproving(false);
      }
    },
    [publicClient, tokenAddress, writeContractAsync, address, contractAddress]
  );

  const stake = useCallback(
    async (amount: bigint): Promise<TransactionResult> => {
      if (!publicClient || !writeContractAsync || !address) {
        const errorMsg = "Wallet not connected";
        return { success: false, error: errorMsg };
      }

      // setError(null);

      if (amount <= 0n) {
        const errorAmountMsg = "Invalid Amount";
        setError(errorAmountMsg);
        return { success: false, error: errorAmountMsg };
      } else if (!amount) {
        const errorNoAmountMsg = "No Inserted Amount";
        setError(errorNoAmountMsg);
        return { success: false, error: errorNoAmountMsg };
      }

      setIsLoading(true);
      setError(null);

      try {
        // Check user token balance
        const userBalanceRaw = await publicClient.readContract({
          address: tokenAddress,
          abi: Staking_Token_Contract_Abi,
          functionName: "balanceOf",
          args: [address],
        });

        const userBalance = BigInt(userBalanceRaw as string | number | bigint);

        if (userBalance < amount) {
          const errorMsg = "Insufficient token balance";
          console.log("insufficient token balance", userBalance);
          console.error(
            "insufficient token balance",
            userBalance,
            "Kindly mint Token"
          );

          return { success: false, error: errorMsg };
        }

        // After approval, wait and recheck allowance
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const newAllowance = await publicClient.readContract({
          address: tokenAddress,
          abi: Staking_Token_Contract_Abi,
          functionName: "allowance",
          args: [address, contractAddress],
        });

        // Convert allowance to bigint for comparison
        const currentAllowance = BigInt(
          newAllowance as string | number | bigint
        );

        if (currentAllowance < amount) {
          const approvalTxHash = await writeContractAsync({
            address: tokenAddress,
            abi: Staking_Token_Contract_Abi,
            functionName: "approve",
            args: [contractAddress, amount],
          });

          console.log("approval tx hash:", approvalTxHash);

          // Wait for approval transaction confirmation
          const approvalReceipt = await publicClient.waitForTransactionReceipt({
            hash: approvalTxHash,
          });

          if (approvalReceipt.status !== "success") {
            const errorMsg = "Approval transaction failed";

            return { success: false, error: errorMsg };
          }
        } else {
          console.log("Sufficient allowance, skipping approve");
        }

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
          // Refetch data after successful stake
          return { success: true, txHash };
        } else {
          const errorMsg = "Transaction failed";

          return { success: false, error: errorMsg };
        }
      } catch (err: unknown) {
        console.error("Staking error:", err);
        const errorMsg =
          err instanceof Error
            ? err.message
            : "An error occurred while staking";
        setError(errorMsg);

        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [publicClient, tokenAddress, writeContractAsync, address, contractAddress]
  );

  const mint = useCallback(
    async (amount: bigint): Promise<TransactionResult> => {
      if (!publicClient || !writeContractAsync || !address) {
        const errorMsg = "Wallet not connected";
        const errorWalletMsg = "Wallet not connected";
        setError(errorWalletMsg);
        return { success: false, error: errorMsg };
      }

      if (amount <= 0n) {
        const errorMsg = "Invalid amount";
        const errorAmountMsg = "Invalid Amount";
        setError(errorAmountMsg);
        return { success: false, error: errorMsg };
      }

      setIsMinting(true);
      setError(null);

      try {
        const userBalanceRaw = await publicClient.readContract({
          address: tokenAddress,
          abi: Staking_Token_Contract_Abi,
          functionName: "balanceOf",
          args: [address],
        });

        const userBalance = BigInt(userBalanceRaw as string | number | bigint);

        if (userBalance < amount) {
          const mintToken = await writeContractAsync({
            address: tokenAddress,
            abi: Staking_Token_Contract_Abi,
            functionName: "mint",
            args: [address, amount],
          });

          console.log("mint token", mintToken);

          return { success: true, txHash: mintToken };
        } else {
          const errorMsg = "You have enough token, kindly proceed to stake";
          console.log(
            "You have enough token, kindly proceed to stake",
            userBalance
          );
          console.error(
            "You have enough token, kindly proceed to stake",
            userBalance,
            "Kindly mint Token"
          );

          const errorMintMsg = "You have enough token, kindly proceed to stake";
          setError(errorMintMsg);

          return { success: false, error: errorMsg };
        }
      } catch (err: unknown) {
        console.error("Staking error:", err);
        const errorMsg =
          err instanceof Error
            ? err.message
            : "An error occurred while staking";
        setError(errorMsg);

        return { success: false, error: errorMsg };
      } finally {
        setIsMinting(false);
      }
    },
    [publicClient, tokenAddress, writeContractAsync, address]
  );

  const balance = useCallback(async (): Promise<bigint> => {
    if (!publicClient || !address) {
      const errorWalletMsg = "Wallet not connected";
      setError(errorWalletMsg);
      return { success: false, error: errorWalletMsg };
    }

    try {
      const userBalanceRaw = await publicClient.readContract({
        address: tokenAddress,
        abi: Staking_Token_Contract_Abi,
        functionName: "balanceOf",
        args: [address],
      });

      return BigInt(userBalanceRaw as string | number | bigint);
    } catch (err: unknown) {
      console.error("Error fetching balance:", err);
      throw err;
    }
  }, [publicClient, tokenAddress, address]);

  setTimeout(() => {
    setError(null);
    setTimeout(() => setError(null), 6000);
  }, 6000);

  return {
    approve,
    stake,
    isLoading,
    isMinting,
    isApproving,
    error,
    mint,
    balance,
  };
};

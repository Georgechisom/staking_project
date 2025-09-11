import { useReadContract, useWatchContractEvent } from "wagmi";
import { useState, useEffect } from "react";
import { Staking_Contract_Abi } from "../config/Abi";

interface UseTotalStakesReturn {
  RewardRate: bigint;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useRewardRate = (): UseTotalStakesReturn => {
  const contractAddress = import.meta.env
    .VITE_Staking_Contract_Address as `0x${string}`;

  const {
    data: RewardRateFromContract,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    functionName: "currentRewardRate",
    query: {
      enabled: !!contractAddress,
    },
  });

  const [RewardRate, setRewardRate] = useState<bigint>(0n);
  console.log({ RewardRateFromContract, RewardRate });

  // Initialize totalStaked state from contract data
  useEffect(() => {
    if (RewardRateFromContract !== undefined) {
      setRewardRate(RewardRateFromContract as bigint);
    }
  }, [RewardRateFromContract]);

  // Watch for Staked events and update totalStaked
  useWatchContractEvent({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    eventName: "Staked",
    onLogs: (logs) => {
      console.log("Stake event detected:", logs);

      // Extract amount from event and add to totalStaked
      const log = logs[0] as { args?: { amount?: bigint } };
      const amount = log.args?.amount ?? 0n;
      setRewardRate((prev) => prev + amount);
    },
  });

  return {
    RewardRate: (RewardRate as bigint) || 0n,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
};

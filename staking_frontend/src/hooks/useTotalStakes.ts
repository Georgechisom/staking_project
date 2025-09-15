import { useReadContract, useWatchContractEvent } from "wagmi";
import { useState, useEffect } from "react";
import { Staking_Contract_Abi } from "../config/Abi";

interface UseTotalStakesReturn {
  totalStaked: bigint;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTotalStakes = (): UseTotalStakesReturn => {
  const contractAddress = import.meta.env
    .VITE_Staking_Contract_Address as `0x${string}`;

  const {
    data: totalStakedFromContract,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    functionName: "totalStaked",
    query: {
      enabled: !!contractAddress,
    },
  });

  const [totalStaked, setTotalStaked] = useState<bigint>(0n);
  // console.log(totalStaked);

  // Initialize totalStaked state from contract data
  useEffect(() => {
    if (totalStakedFromContract !== undefined) {
      setTotalStaked(totalStakedFromContract as bigint);
    }
  }, [totalStakedFromContract]);

  // Watch for Staked events and update totalStaked
  useWatchContractEvent({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    eventName: "Staked",
    onLogs: (logs) => {
      console.log("Staked event detected:", logs);

      // Extract amount from event and add to totalStaked
      const log = logs[0] as { args?: { amount?: bigint } };
      const amount = log.args?.amount ?? 0n;
      setTotalStaked((prev) => prev + amount);
    },
  });

  return {
    totalStaked: (totalStaked as bigint) || 0n,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
};

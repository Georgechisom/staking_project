import { useReadContract, useWatchContractEvent } from "wagmi";
import { useState, useEffect } from "react";
import { Staking_Contract_Abi } from "../config/Abi";

interface UseTotalStakesReturn {
  Apr: bigint;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useApr = (): UseTotalStakesReturn => {
  const contractAddress = import.meta.env
    .VITE_Staking_Contract_Address as `0x${string}`;

  const {
    data: AprFromContract,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    functionName: "initialApr",
    query: {
      enabled: !!contractAddress,
    },
  });

  const [Apr, setApr] = useState<bigint>(0n);
  // console.log({ AprFromContract, Apr });

  // Initialize totalStaked state from contract data
  useEffect(() => {
    if (AprFromContract !== undefined) {
      setApr(AprFromContract as bigint);
    }
  }, [AprFromContract]);

  // Watch for Staked events and update totalStaked
  useWatchContractEvent({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    eventName: "initialApr",
    onLogs: (logs) => {
      console.log("Apr event detected:", logs);

      // Extract amount from event and add to totalStaked
      const log = logs[0] as { args?: { amount?: bigint } };
      const amount = log.args?.amount ?? 0n;
      setApr((prev) => prev + amount);
    },
  });

  return {
    Apr: (Apr as bigint) || 0n,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
};

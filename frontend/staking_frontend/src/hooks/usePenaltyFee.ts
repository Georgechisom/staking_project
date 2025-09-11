import { useReadContract, useWatchContractEvent } from "wagmi";
import { useState, useEffect } from "react";
import { Staking_Contract_Abi } from "../config/Abi";

interface UsePenaltyFeeReturn {
  penaltyFee: bigint;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePenaltyFee = (): UsePenaltyFeeReturn => {
  const contractAddress = import.meta.env
    .VITE_Staking_Contract_Address as `0x${string}`;

  const {
    data: penaltyFeeFromContract,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    functionName: "emergencyWithdrawPenalty",
    query: {
      enabled: !!contractAddress,
    },
  });

  const [penaltyFee, setPenaltyFee] = useState<bigint>(0n);
  // console.log({ penaltyFeeFromContract, penaltyFee });

  // Initialize totalStaked state from contract data
  useEffect(() => {
    if (penaltyFeeFromContract !== undefined) {
      setPenaltyFee(penaltyFeeFromContract as bigint);
    }
  }, [penaltyFeeFromContract]);

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
      setPenaltyFee((prev) => prev + amount);
    },
  });

  return {
    penaltyFee: (penaltyFee as bigint) || 0n,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
};

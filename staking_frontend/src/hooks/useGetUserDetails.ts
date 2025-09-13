import { useAccount, usePublicClient, useWatchContractEvent } from "wagmi";
import { Staking_Contract_Abi } from "../config/Abi";
import { useState, useEffect, useCallback } from "react";

interface UserDetails {
  stakedAmount: bigint;
  lastStakeTimestamp: bigint;
  pendingRewards: bigint;
  timeUntilUnlock: bigint;
  canWithdraw: boolean;
}

interface UseGetUserDetailsReturn {
  userDetails: UserDetails | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  userStakeUsers: () => void;
  totalUsers: bigint;
  stakers: string[];
}

export const useGetUserDetails = (): UseGetUserDetailsReturn => {
  const contractAddress = import.meta.env
    .VITE_Staking_Contract_Address as `0x${string}`;
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<bigint>(0n);
  const [stakers, setStakers] = useState<string[]>([]);

  const fetchUserDetails = useCallback(async () => {
    if (!address || !publicClient) {
      setUserDetails(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await publicClient.readContract({
        address: contractAddress,
        abi: Staking_Contract_Abi,
        functionName: "getUserDetails",
        args: [address],
      });
      console.log({ data });

      setUserDetails(data as UserDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setUserDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [address, contractAddress, publicClient]);

  const fetchTotalUsers = useCallback(async () => {
    if (!publicClient) return;

    try {
      const logs = await publicClient.getContractEvents({
        address: contractAddress,
        abi: Staking_Contract_Abi,
        eventName: "Staked",
        fromBlock: 0n,
      });
      const users = new Set<string>();
      logs.forEach((log) => {
        const user = (log as any).args?.user;
        if (user) users.add(user);
      });
      setStakers(Array.from(users));
      setTotalUsers(BigInt(users.size));
    } catch (err) {
      console.error("Error fetching total users:", err);
    }
  }, [publicClient, contractAddress]);

  const userStakeUsers = useCallback(async () => {
    if (!address || !publicClient) {
      setUserDetails(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await publicClient.readContract({
        address: contractAddress,
        abi: Staking_Contract_Abi,
        functionName: "getUserDetails",
        args: [address],
      });
      console.log({ data });

      setUserDetails(data as UserDetails);
      // If data is an array, set total users to its length
      if (Array.isArray(data)) {
        setTotalUsers(BigInt(data.length));
      }

      console.log("data", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setUserDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [address, contractAddress, publicClient]);

  useEffect(() => {
    fetchUserDetails();
    fetchTotalUsers();
  }, [fetchUserDetails, fetchTotalUsers]);

  // Watch for events that affect user details
  useWatchContractEvent({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    eventName: "Staked",
    onLogs: (logs) => {
      if (logs.length > 0) {
        fetchUserDetails();
        fetchTotalUsers();
      }
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    eventName: "Withdrawn",
    onLogs: (logs) => {
      if (logs.length > 0) {
        fetchUserDetails();
      }
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    eventName: "EmergencyWithdrawn",
    onLogs: (logs) => {
      if (logs.length > 0) {
        fetchUserDetails();
      }
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: Staking_Contract_Abi,
    eventName: "RewardsClaimed",
    onLogs: (logs) => {
      if (logs.length > 0) {
        fetchUserDetails();
      }
    },
  });

  return {
    totalUsers,
    userDetails,
    isLoading,
    error,
    userStakeUsers,
    refetch: fetchUserDetails,
    stakers,
  };
};

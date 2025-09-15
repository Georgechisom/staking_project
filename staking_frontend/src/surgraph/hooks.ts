import { useState, useEffect } from "react";
import { client } from "./client";
import {
  GET_CONTRACT_DETAILS,
  GET_TOTAL_TRANSACTIONS,
  GET_ACTIVE_USERS,
  GET_USER_STAKES,
  GET_USER_WITHDRAWALS,
  GET_USER_CLAIMS,
  GET_USER_TOTAL_STAKED,
} from "./queries";

export function useContractDetails() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
      .request(GET_CONTRACT_DETAILS)
      .then((res: any) => {
        setData(res.contractDetails);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || "Error fetching contract details");
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useTotalTransactions() {
  const [totalTransactions, setTotalTransactions] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
      .request(GET_TOTAL_TRANSACTIONS)
      .then((res: any) => {
        if (res.transactions && res.transactions.length > 0) {
          setTotalTransactions(res.transactions[0].totalTransactions);
        } else {
          setTotalTransactions(0);
        }
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || "Error fetching total transactions");
        setLoading(false);
      });
  }, []);

  return { totalTransactions, loading, error };
}

export function useActiveUsers() {
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
      .request(GET_ACTIVE_USERS)
      .then((res: any) => {
        if (res.stakeds) {
          // Count unique users
          const uniqueUsers = new Set(res.stakeds.map((s: any) => s.user));
          setActiveUsers(uniqueUsers.size);
        } else {
          setActiveUsers(0);
        }
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || "Error fetching active users");
        setLoading(false);
      });
  }, []);

  return { activeUsers, loading, error };
}

export function useUserStakes(userAddress: string | undefined) {
  const [stakes, setStakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userAddress) {
      setStakes([]);
      setLoading(false);
      return;
    }
    client
      .request(GET_USER_STAKES, { user: userAddress.toLowerCase() })
      .then((res: any) => {
        setStakes(res.stakeds || []);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || "Error fetching user stakes");
        setLoading(false);
      });
  }, [userAddress]);

  return { stakes, loading, error };
}

export function useUserWithdrawals(userAddress: string | undefined) {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [emergencyWithdrawals, setEmergencyWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userAddress) {
      setWithdrawals([]);
      setEmergencyWithdrawals([]);
      setLoading(false);
      return;
    }
    client
      .request(GET_USER_WITHDRAWALS, { user: userAddress.toLowerCase() })
      .then((res: any) => {
        setWithdrawals(res.withdraws || []);
        setEmergencyWithdrawals(res.emergencyWithdrawns || []);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || "Error fetching user withdrawals");
        setLoading(false);
      });
  }, [userAddress]);

  return { withdrawals, emergencyWithdrawals, loading, error };
}

export function useUserClaims(userAddress: string | undefined) {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userAddress) {
      setClaims([]);
      setLoading(false);
      return;
    }
    client
      .request(GET_USER_CLAIMS, { user: userAddress.toLowerCase() })
      .then((res: any) => {
        setClaims(res.rewardsClaimeds || []);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || "Error fetching user claims");
        setLoading(false);
      });
  }, [userAddress]);

  return { claims, loading, error };
}

export function useUserTotalStaked(userAddress: string | undefined) {
  const [totalStaked, setTotalStaked] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userAddress) {
      setTotalStaked(null);
      setLoading(false);
      return;
    }
    client
      .request(GET_USER_TOTAL_STAKED, { user: userAddress.toLowerCase() })
      .then((res: any) => {
        if (res.stakeds && res.stakeds.length > 0) {
          setTotalStaked(res.stakeds[0].newTotalStaked);
        } else {
          setTotalStaked(null);
        }
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || "Error fetching user total staked");
        setLoading(false);
      });
  }, [userAddress]);

  return { totalStaked, loading, error };
}

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTotalStakes } from "@/hooks/useTotalStakes";
import { useApr } from "@/hooks/useApr";
import { useRewardRate } from "@/hooks/useRewardRate";
import { usePenaltyFee } from "@/hooks/usePenaltyFee";
import {
  useContractDetails,
  useTotalTransactions,
  useActiveUsers,
} from "@/surgraph/hooks";

const StatsCards: React.FC = () => {
  const { totalStaked, isLoading, error } = useTotalStakes();
  const { Apr } = useApr();
  const { RewardRate } = useRewardRate();
  const { penaltyFee } = usePenaltyFee();
  const {
    data: contractDetails,
    loading: contractLoading,
    error: contractError,
  } = useContractDetails();
  const {
    totalTransactions,
    loading: txLoading,
    error: txError,
  } = useTotalTransactions();
  const {
    activeUsers,
    loading: usersLoading,
    error: usersError,
  } = useActiveUsers();

  const parseToBigInt = (amount: string, decimals = 18): bigint => {
    const [whole, frac = ""] = amount.split(".");

    const fracPadded = (frac + "0".repeat(Number(decimals))).slice(0, decimals);

    return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fracPadded);
  };

  // console.log(apr);

  const getApr = () => {
    if (isLoading) return "Loading...";
    if (error) return "0";
    if (typeof Apr === "string") {
      return parseToBigInt(Apr).toString();
    }
    // console.log(Apr);
    return Apr.toString();
  };

  const getTotalStakedDisplay = () => {
    if (isLoading) return "Loading...";
    if (error) return "0";
    const num =
      typeof totalStaked === "string"
        ? Number(totalStaked)
        : Number(totalStaked);
    return (num / 1e18).toFixed(2);
  };

  const getPenaltyFee = () => {
    if (isLoading) return "Loading...";
    if (error) return "0";
    // console.log("PenaltyFee", penaltyFee);
    return penaltyFee.toString();
  };

  const getRewardRate = () => {
    if (isLoading) return "Loading...";
    if (error) return "0";
    if (typeof RewardRate === "string") {
      return parseToBigInt(RewardRate).toString();
    }
    // console.log("RewardRate", RewardRate);
    return RewardRate.toString();
  };

  const getTotalTransactions = () => {
    if (txLoading) return "Loading...";
    if (txError) return "0";
    return totalTransactions?.toString() || "0";
  };

  const getTotalRewardClaims = () => {
    if (contractLoading) return "Loading...";
    if (contractError) return "0";
    if (contractDetails?.totalRewardsGiven) {
      return (Number(contractDetails.totalRewardsGiven) / 1e18).toFixed(2);
    }
    return "0";
  };

  const getTotalMinted = () => {
    if (contractLoading) return "Loading...";
    if (contractError) return "0";
    if (contractDetails?.totalMinted) {
      return (Number(contractDetails.totalMinted) / 1e18).toFixed(2);
    }
    return "0";
  };

  const getTotalWithdrawals = () => {
    if (contractLoading) return "Loading...";
    if (contractError) return "0";
    if (contractDetails?.totalWithdrawn) {
      return (Number(contractDetails.totalWithdrawn) / 1e18).toFixed(2);
    }
    return "0";
  };

  const getActiveUsers = () => {
    if (usersLoading) return "Loading...";
    if (usersError) return "0";
    return activeUsers.toString();
  };

  const getAverageStake = () => {
    if (contractLoading || usersLoading) return "Loading...";
    if (contractError || usersError) return "0";
    if (contractDetails?.totalStakes && activeUsers > 0) {
      const avg = Number(contractDetails.totalStakes) / activeUsers / 1e18;
      return avg.toFixed(5);
    }
    return "0";
  };

  const stats = [
    { title: "Total Staked", value: getTotalStakedDisplay(), unit: "" },
    { title: "Current APR", value: getApr(), unit: "%" },
    { title: "Emergency Withdraw Penalty", value: getPenaltyFee(), unit: "" },
    { title: "Reward Rate", value: getRewardRate(), unit: "%" },
    { title: "Total Transactions", value: getTotalTransactions(), unit: "" },
    { title: "Total Reward Claims", value: getTotalRewardClaims(), unit: "" },
    { title: "Total Minted", value: getTotalMinted(), unit: "" },
    { title: "Total Withdrawals", value: getTotalWithdrawals(), unit: "" },
    { title: "Active Users", value: getActiveUsers(), unit: "" },
    { title: "Average Stake", value: getAverageStake(), unit: "" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-gray-800 border-purple-500/20 h-40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                <span className="mx-2">{stat.value}</span>
                <span className="text-purple-400">{stat.unit}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;

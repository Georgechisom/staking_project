import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTotalStakes } from "@/hooks/useTotalStakes";
import { useGetUserDetails } from "@/hooks/useGetUserDetails";
import { useApr } from "@/hooks/useApr";
import { useRewardRate } from "@/hooks/useRewardRate";

const StatsCards: React.FC = () => {
  const { totalStaked, isLoading, error } = useTotalStakes();
  const { totalUsers } = useGetUserDetails();
  const { Apr } = useApr();
  const { RewardRate } = useRewardRate();

  const parseToBigInt = (amount: string, decimals = 18n): bigint => {
    const [whole, frac = ""] = amount.split(".");

    const fracPadded = (frac + "0".repeat(Number(decimals))).slice(
      0,
      Number(decimals)
    );

    return BigInt(whole) * 10n ** decimals + BigInt(fracPadded);
  };

  // console.log(apr);

  const getApr = () => {
    if (isLoading) return "Loading...";
    if (error) return "0";
    if (typeof Apr === "string") {
      return parseToBigInt(Apr);
    }
    console.log(Apr);
    return Apr;
  };

  const getTotalStakedDisplay = () => {
    if (isLoading) return "Loading...";
    if (error) return "0";
    const num =
      typeof totalStaked === "string"
        ? Number(totalStaked)
        : Number(totalStaked);
    return (num / 1e18).toFixed(5);
  };

  const getTotalUsers = () => {
    if (isLoading) return "Loading...";
    if (error) return "0";
    console.log("totalUsers", totalUsers);
    return totalUsers.toString();
  };

  const getRewardRate = () => {
    if (isLoading) return "Loading...";
    if (error) return "0";
    if (typeof RewardRate === "string") {
      return parseToBigInt(RewardRate);
    }
    console.log("RewardRate", RewardRate);
    return RewardRate;
  };

  const stats = [
    { title: "Total Staked", value: getTotalStakedDisplay(), unit: "" },
    { title: "Current APR", value: getApr(), unit: "%" },
    { title: "Total Users", value: getTotalUsers(), unit: "" },
    { title: "Reward Rate", value: getRewardRate(), unit: "%" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

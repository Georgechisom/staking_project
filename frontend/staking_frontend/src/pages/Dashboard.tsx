import React from "react";
import { motion } from "framer-motion";
import StatsCards from "../components/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStake } from "@/hooks/useStake";

const Dashboard: React.FC = () => {
  const { userStakedAmount, userPendingRewards, timeUntilUnlock, totalStaked } =
    useStake();

  const formatBigInt = (value: bigint) => {
    const decimals = 18n;
    const divisor = 10n ** decimals;
    const whole = value / divisor;
    const fraction = value % divisor;
    return `${whole.toString()}.${fraction
      .toString()
      .padStart(Number(decimals), "0")}`;
  };

  const formatTime = (secondsBigInt: bigint) => {
    const seconds = Number(secondsBigInt);
    if (seconds <= 0) return "Unlocked";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };
  // const { stake } = useStake();
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center mb-8">Staking Dashboard</h1>
      <StatsCards />
      {/* {stake } */}

      <Card className="bg-gray-800 border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="text-center text-purple-400">Stake</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-6 space-y-2">
            <p>
              <strong>Your Staked Amount:</strong>{" "}
              {formatBigInt(userStakedAmount)}
            </p>
            <p>
              <strong>Your Pending Rewards:</strong>{" "}
              {formatBigInt(userPendingRewards)}
            </p>
            <p>
              <strong>Time Until Unlock:</strong> {formatTime(timeUntilUnlock)}
            </p>
            <p>
              <strong>Total Staked:</strong> {formatBigInt(totalStaked)}
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-gray-400 mt-8">
        More components coming soon.
      </p>
    </motion.div>
  );
};

export default Dashboard;

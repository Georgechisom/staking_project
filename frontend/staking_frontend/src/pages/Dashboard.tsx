import React from "react";
import { motion } from "framer-motion";
import StatsCards from "../components/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserDetails } from "@/hooks/useGetUserDetails";
import { useAccount } from "wagmi";

const Dashboard: React.FC = () => {
  const { address } = useAccount();
  const { userDetails, isLoading, error } = useGetUserDetails();

  const parseToBigInt = (amount: string, decimals = 18n): bigint => {
    const [whole, frac = ""] = amount.split(".");

    const fracPadded = (frac + "0".repeat(Number(decimals))).slice(
      0,
      Number(decimals)
    );

    return BigInt(whole) * 10n ** decimals + BigInt(fracPadded);
  };

  const formatTime = (secondsBigInt: bigint) => {
    const seconds = Number(secondsBigInt);
    if (seconds <= 0) return "Unlocked";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center mb-8">Staking Dashboard</h1>
      <StatsCards />

      <Card className="bg-gray-800 border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="text-center text-purple-400">Stake</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-6 space-y-2">
            {!address && (
              <p>Please connect your wallet to view your staking details.</p>
            )}
            {address && isLoading && <p>Loading user details...</p>}
            {address && error && <p className="text-red-500">Error: {error}</p>}
            {address && !isLoading && !error && userDetails && (
              <>
                <p>
                  <strong>Your Staked Amount:</strong>{" "}
                  {(userDetails.stakedAmount / 10n ** 1n).toString()}
                </p>
                <p>
                  <strong>Your Pending Rewards:</strong>{" "}
                  {parseToBigInt(
                    userDetails.pendingRewards.toString()
                  ).toString()}
                </p>
                <p>
                  <strong>Time Until Unlock:</strong>{" "}
                  {formatTime(userDetails.timeUntilUnlock)}
                </p>
              </>
            )}
            {address && !isLoading && !error && !userDetails && (
              <p>Working on it.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Dashboard;

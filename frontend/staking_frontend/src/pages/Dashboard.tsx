import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatsCards from "../components/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserDetails } from "@/hooks/useGetUserDetails";
import { usePenaltyFee } from "@/hooks/usePenaltyFee";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { address } = useAccount();
  const { userDetails, isLoading, error, stakers } = useGetUserDetails();
  const { penaltyFee } = usePenaltyFee();
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    if (userDetails?.timeUntilUnlock) {
      setRemainingTime(Number(userDetails.timeUntilUnlock));
    }
  }, [userDetails]);

  useEffect(() => {
    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [remainingTime]);

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
      <h1 className="text-3xl font-bold text-center my-8 animate-pulse">
        Staking Dashboard
      </h1>
      <StatsCards />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-gradient-to-br from-purple-900 to-slate-900 border-purple-500/20 text-white">
          <CardHeader>
            <CardTitle className="text-center text-purple-400">Stake</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-6 space-y-2">
              {!address && (
                <p>Please connect your wallet to view your staking details.</p>
              )}
              {address && isLoading && <p>Loading user details...</p>}
              {address && error && (
                <p className="text-red-500">Error: {error}</p>
              )}
              {address && !isLoading && !error && userDetails && (
                <>
                  <p>
                    <strong>Lock Period:</strong> 7 days
                  </p>
                  <p>
                    <strong>Your Staked Amount:</strong>{" "}
                    {(Number(userDetails.stakedAmount) / 1e18).toFixed(5)}
                  </p>
                  <p>
                    <strong>Your Pending Rewards:</strong>{" "}
                    {(Number(userDetails.pendingRewards) / 1e18).toFixed(5)}
                  </p>
                  <p>
                    <strong>Time Until Unlock:</strong>{" "}
                    {formatTime(BigInt(remainingTime))}
                  </p>
                  <p>
                    <strong>Penalty Fee:</strong> {penaltyFee.toString()}
                  </p>
                </>
              )}
              {address && !isLoading && !error && !userDetails && (
                <p>Working on it.</p>
              )}
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-52 my-6"
              onClick={() => navigate("/stake")}
            >
              <Button className=" bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                Stake Now
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900 to-slate-900 border-purple-500/20 text-white">
          <CardHeader>
            <CardTitle className="text-center text-purple-400">
              Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-6 space-y-2">
              {!address && (
                <p>Please connect your wallet to view your rewards.</p>
              )}
              {address && isLoading && <p>Loading rewards...</p>}
              {address && error && (
                <p className="text-red-500">Error: {error}</p>
              )}
              {address && !isLoading && !error && userDetails && (
                <>
                  <p>
                    <strong>Your Pending Rewards:</strong>{" "}
                    {parseToBigInt(
                      userDetails.pendingRewards.toString()
                    ).toString()}
                  </p>
                </>
              )}
              {address && !isLoading && !error && !userDetails && (
                <p>No rewards available.</p>
              )}
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-52 my-6"
              onClick={() => navigate("/rewards")}
            >
              <Button className=" bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                Claim Rewards
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900 to-slate-900 border-purple-500/20 text-white">
          <CardHeader>
            <CardTitle className="text-center text-purple-400">
              Stakers List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-6 space-y-2">
              {!address && <p>Please connect your wallet to view stakers.</p>}
              {address && isLoading && <p>Loading stakers...</p>}
              {address && error && (
                <p className="text-red-500">Error: {error}</p>
              )}
              {address && !isLoading && !error && stakers && (
                <>
                  <p>
                    <strong>Total Stakers:</strong> {stakers.length}
                  </p>
                  <div className="max-h-40 overflow-y-auto">
                    <ul className="list-disc list-inside">
                      {stakers.slice(0, 10).map((staker, index) => (
                        <li key={index} className="text-sm">
                          {staker.slice(0, 6)}...{staker.slice(-4)}
                        </li>
                      ))}
                      {stakers.length > 10 && (
                        <li className="text-sm text-gray-400">
                          ... and {stakers.length - 10} more
                        </li>
                      )}
                    </ul>
                  </div>
                </>
              )}
              {address &&
                !isLoading &&
                !error &&
                (!stakers || stakers.length === 0) && <p>No stakers found.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Dashboard;

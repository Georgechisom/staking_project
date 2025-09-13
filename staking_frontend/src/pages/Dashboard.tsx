import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatsCards from "../components/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useGetUserDetails } from "@/hooks/useGetUserDetails";
import { usePenaltyFee } from "@/hooks/usePenaltyFee";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  useUserStakes,
  useUserWithdrawals,
  useUserClaims,
  useUserTotalStaked,
} from "@/surgraph/hooks";
import { formatUnits } from "viem";

const Dashboard: React.FC = () => {
  const { address } = useAccount();
  const { userDetails, isLoading, error, stakers } = useGetUserDetails();
  const { penaltyFee } = usePenaltyFee();
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // Surgraph hooks
  const { stakes, loading: stakesLoading } = useUserStakes(address);
  const {
    withdrawals,
    emergencyWithdrawals,
    loading: withdrawalsLoading,
  } = useUserWithdrawals(address);
  const { claims, loading: claimsLoading } = useUserClaims(address);
  const { totalStaked: surgraphTotalStaked, loading: totalStakedLoading } =
    useUserTotalStaked(address);

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

  // const parseToBigInt = (amount: string, decimals = 18n): bigint => {
  //   const [whole, frac = ""] = amount.split(".");

  //   const fracPadded = (frac + "0".repeat(Number(decimals))).slice(
  //     0,
  //     Number(decimals)
  //   );

  //   return BigInt(whole) * 10n ** decimals + BigInt(fracPadded);
  // };

  const formatTime = (secondsBigInt: bigint) => {
    const seconds = Number(secondsBigInt);
    if (seconds <= 0) return "Unlocked";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const getUserTotalStakes = () => {
    if (stakesLoading) return "Loading...";
    if (stakes && stakes.length > 0) {
      const total = stakes.reduce(
        (sum, stake) => sum + Number(stake.amount),
        0
      );
      return (total / 1e18).toFixed(2);
    }
    return "0";
  };

  const getUserTotalWithdrawals = () => {
    if (withdrawalsLoading) return "Loading...";
    let total = 0;
    if (withdrawals) {
      total += withdrawals.reduce((sum, w) => sum + Number(w.amount), 0);
    }
    if (emergencyWithdrawals) {
      total += emergencyWithdrawals.reduce(
        (sum, ew) => sum + Number(ew.amount),
        0
      );
    }
    return (total / 1e18).toFixed(2);
  };

  const getUserTotalClaims = () => {
    if (claimsLoading) return "Loading...";
    if (claims && claims.length > 0) {
      const total = claims.reduce(
        (sum, claim) => sum + Number(claim.amount),
        0
      );
      return (total / 1e18).toFixed(5);
    }
    return "0";
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    {(Number(userDetails.stakedAmount) / 1e18).toFixed(3)}
                  </p>
                  <p>
                    <strong>Your Pending Rewards:</strong>{" "}
                    {(Number(userDetails.pendingRewards) / 1e18).toFixed(3)}
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
                    <strong className="">Your Pending Rewards: </strong>
                    {"   "}
                    {Number(
                      formatUnits(userDetails.pendingRewards, 18)
                    ).toFixed(5)}
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
              <Button className=" bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-600 hover:to-pink-600">
                Claim Rewards
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* User Details Section */}
      <Card className="bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="text-center text-purple-400">
            Your Activity Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!address ? (
            <div className="text-center block justify-center">
              <p className="mb-4">Connect your wallet to see your details.</p>
              <div className="flex justify-center my-3">
                <ConnectButton />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-400">Total Stakes</p>
                <p className="text-2xl font-bold">{getUserTotalStakes()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Total Withdrawals</p>
                <p className="text-2xl font-bold">
                  {Number(getUserTotalWithdrawals()).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Total Claims</p>
                <p className="text-2xl font-bold">{getUserTotalClaims()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Current Balance</p>
                <p className="text-2xl font-bold">
                  {totalStakedLoading
                    ? "Loading..."
                    : surgraphTotalStaked
                    ? (Number(surgraphTotalStaked) / 1e18).toFixed(2)
                    : "0"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Dashboard;

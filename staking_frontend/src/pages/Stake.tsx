import React from "react";
import { motion } from "framer-motion";
import StakingForm from "../components/StakingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount } from "wagmi";
import { useUserStakes, useUserTotalStaked } from "@/surgraph/hooks";

const Stake: React.FC = () => {
  const { address } = useAccount();
  const { stakes, loading: stakesLoading } = useUserStakes(address);
  const { totalStaked, loading: totalStakedLoading } =
    useUserTotalStaked(address);

  const getTotalStakes = () => {
    if (stakesLoading) return "Loading...";
    if (stakes && stakes.length > 0) {
      const total = stakes.reduce(
        (sum, stake) => sum + Number(stake.amount),
        0
      );
      return (total / 1e18).toFixed(5);
    }
    return "0";
  };

  const getCurrentBalance = () => {
    if (totalStakedLoading) return "Loading...";
    if (totalStaked) {
      return (Number(totalStaked) / 1e18).toFixed(5);
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
      <h1 className="text-3xl font-bold text-center mb-8">Stake Tokens</h1>
      <div className="max-w-md mx-auto">
        <StakingForm />
      </div>

      {address && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-purple-900 to-slate-900 border-purple-500/20 text-white">
            <CardHeader>
              <CardTitle className="text-center text-purple-400">
                Your Staking Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Total Stakes</p>
                  <p className="text-2xl font-bold">{getTotalStakes()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Current Balance</p>
                  <p className="text-2xl font-bold">{getCurrentBalance()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/20 text-white">
            <CardHeader>
              <CardTitle className="text-center text-purple-400">
                Recent Stakes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stakesLoading ? (
                <p>Loading...</p>
              ) : stakes && stakes.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {stakes.slice(0, 5).map((stake, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {new Date(
                          Number(stake.timestamp) * 1000
                        ).toLocaleDateString()}
                      </span>
                      <span>{(Number(stake.amount) / 1e18).toFixed(5)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No stakes found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
};

export default Stake;

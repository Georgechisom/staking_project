import React from "react";
import { motion } from "framer-motion";
import WithdrawalInterface from "../components/WithdrawalInterface";
import EmergencyWithdrawal from "../components/EmergencyWithdrawal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount } from "wagmi";
import { useUserWithdrawals } from "@/surgraph/hooks";

const Withdraw: React.FC = () => {
  const { address } = useAccount();
  const {
    withdrawals,
    emergencyWithdrawals,
    loading: withdrawalsLoading,
  } = useUserWithdrawals(address);

  const getTotalWithdrawals = () => {
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
    return (total / 1e18).toFixed(5);
  };

  const getTotalRewardsAccrued = () => {
    if (withdrawalsLoading) return "Loading...";
    if (withdrawals && withdrawals.length > 0) {
      const total = withdrawals.reduce(
        (sum, w) => sum + Number(w.rewardsAccrued),
        0
      );
      return (total / 1e18).toFixed(5);
    }
    return "0";
  };

  const getTotalPenalties = () => {
    if (withdrawalsLoading) return "Loading...";
    if (emergencyWithdrawals && emergencyWithdrawals.length > 0) {
      const total = emergencyWithdrawals.reduce(
        (sum, ew) => sum + Number(ew.penalty),
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
      <h1 className="text-3xl font-bold text-center mb-8">Withdraw Tokens</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <WithdrawalInterface />
          <EmergencyWithdrawal />
        </div>

        {address && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-900 to-slate-900 border-purple-500/20 text-white">
              <CardHeader>
                <CardTitle className="text-center text-purple-400">
                  Your Withdrawal Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Total Withdrawn</p>
                    <p className="text-2xl font-bold">
                      {getTotalWithdrawals()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Total Rewards Accrued
                    </p>
                    <p className="text-2xl font-bold">
                      {getTotalRewardsAccrued()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Total Penalties Paid
                    </p>
                    <p className="text-2xl font-bold">{getTotalPenalties()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/20 text-white">
              <CardHeader>
                <CardTitle className="text-center text-purple-400">
                  Recent Withdrawals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {withdrawalsLoading ? (
                  <p>Loading...</p>
                ) : (withdrawals && withdrawals.length > 0) ||
                  (emergencyWithdrawals && emergencyWithdrawals.length > 0) ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {withdrawals?.slice(0, 3).map((withdrawal, index) => (
                      <div
                        key={`w-${index}`}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {new Date(
                            Number(withdrawal.timestamp) * 1000
                          ).toLocaleDateString()}
                        </span>
                        <span>
                          {(Number(withdrawal.amount) / 1e18).toFixed(5)}{" "}
                          (Normal)
                        </span>
                      </div>
                    ))}
                    {emergencyWithdrawals?.slice(0, 3).map((ew, index) => (
                      <div
                        key={`ew-${index}`}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {new Date(
                            Number(ew.timestamp) * 1000
                          ).toLocaleDateString()}
                        </span>
                        <span>
                          {(Number(ew.amount) / 1e18).toFixed(5)} (Emergency)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No withdrawals found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Withdraw;

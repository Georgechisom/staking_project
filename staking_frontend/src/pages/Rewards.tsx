import React from "react";
import { motion } from "framer-motion";
import RewardsClaim from "../components/RewardsClaim";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount } from "wagmi";
import { useUserClaims } from "@/surgraph/hooks";

const Rewards: React.FC = () => {
  const { address } = useAccount();
  const { claims, loading: claimsLoading } = useUserClaims(address);

  const getTotalClaims = () => {
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
      <h1 className="text-3xl font-bold text-center mb-8">Claim Rewards</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <RewardsClaim />
        </div>

        {address && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-900 to-slate-900 border-purple-500/20 text-white">
              <CardHeader>
                <CardTitle className="text-center text-purple-400">
                  Your Rewards Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Total Rewards Claimed
                    </p>
                    <p className="text-2xl font-bold">{getTotalClaims()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Total Claims</p>
                    <p className="text-2xl font-bold">{claims?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/20 text-white">
              <CardHeader>
                <CardTitle className="text-center text-purple-400">
                  Recent Claims
                </CardTitle>
              </CardHeader>
              <CardContent>
                {claimsLoading ? (
                  <p>Loading...</p>
                ) : claims && claims.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {claims.slice(0, 5).map((claim, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {new Date(
                            Number(claim.timestamp) * 1000
                          ).toLocaleDateString()}
                        </span>
                        <span>{(Number(claim.amount) / 1e18).toFixed(5)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No claims found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Rewards;

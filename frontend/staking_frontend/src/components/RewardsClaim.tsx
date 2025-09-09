import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const RewardsClaim: React.FC = () => {
  const [pendingRewards] = useState(150.5); // Mock pending rewards
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async () => {
    setIsClaiming(true);
    // Simulate claim
    setTimeout(() => {
      setIsClaiming(false);
      setClaimed(true);
      setTimeout(() => setClaimed(false), 3000);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-800 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-center text-purple-400">
            Claim Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {pendingRewards} Tokens
            </p>
            <p className="text-gray-400">Pending Rewards</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleClaim}
              disabled={isClaiming || pendingRewards === 0}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {isClaiming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                "Claim Rewards"
              )}
            </Button>
          </motion.div>
          {claimed && (
            <motion.div
              className="text-center p-3 bg-green-500/20 border border-green-500 rounded text-green-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              Rewards claimed successfully!
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RewardsClaim;

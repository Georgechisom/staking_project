import React from "react";
import { motion } from "framer-motion";
import RewardsClaim from "../components/RewardsClaim";

const Rewards: React.FC = () => {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center mb-8">Claim Rewards</h1>
      <div className="max-w-md mx-auto">
        <RewardsClaim />
      </div>
    </motion.div>
  );
};

export default Rewards;

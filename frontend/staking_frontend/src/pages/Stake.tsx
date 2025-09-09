import React from "react";
import { motion } from "framer-motion";
import StakingForm from "../components/StakingForm";

const Stake: React.FC = () => {
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
    </motion.div>
  );
};

export default Stake;

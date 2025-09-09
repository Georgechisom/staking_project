import React from "react";
import { motion } from "framer-motion";
import WithdrawalInterface from "../components/WithdrawalInterface";
import EmergencyWithdrawal from "../components/EmergencyWithdrawal";

const Withdraw: React.FC = () => {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center mb-8">Withdraw Tokens</h1>
      <div className="max-w-md mx-auto space-y-6">
        <WithdrawalInterface />
        <div className="flex justify-center">
          <EmergencyWithdrawal />
        </div>
      </div>
    </motion.div>
  );
};

export default Withdraw;

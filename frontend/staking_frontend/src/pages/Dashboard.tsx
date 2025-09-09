import React from "react";
import { motion } from "framer-motion";
import StatsCards from "../components/StatsCards";

const Dashboard: React.FC = () => {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center mb-8">Staking Dashboard</h1>
      <StatsCards />
      <p className="text-center text-gray-400 mt-8">
        More components coming soon.
      </p>
    </motion.div>
  );
};

export default Dashboard;

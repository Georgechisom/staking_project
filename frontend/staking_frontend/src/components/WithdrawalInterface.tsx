import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WithdrawalInterface: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  const mockStaked = 500; // Mock staked amount

  const handleMax = () => {
    setAmount(mockStaked.toString());
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > mockStaked) {
      alert("Invalid amount");
      return;
    }
    setIsWithdrawing(true);
    // Simulate withdrawal
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawn(true);
      setAmount("");
      setTimeout(() => setWithdrawn(false), 3000);
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
            Withdraw Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount to Withdraw
              </label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1"
                />
                <Button type="button" onClick={handleMax} variant="outline">
                  Max
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Staked: {mockStaked} tokens
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                disabled={isWithdrawing}
              >
                {isWithdrawing ? "Withdrawing..." : "Withdraw"}
              </Button>
            </motion.div>
          </form>
          {withdrawn && (
            <motion.div
              className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              Withdrawal successful!
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WithdrawalInterface;

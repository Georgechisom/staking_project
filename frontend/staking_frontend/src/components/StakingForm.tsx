import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStake } from "@/hooks/useStake";
import { parseEther } from "viem";
import { toast } from "sonner";

const StakingForm: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const { stake, isLoading, error, isPaused } = useStake();

  const [amount, setAmount] = useState<number>();

  const mockBalance = 1000; // Mock wallet balance

  const handleMax = () => {
    setAmount(mockBalance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !amount ||
      parseEther(amount.toString()) <= 0
      // parseEther(amount.toString()) > mockBalance
    ) {
      toast("Ibvalid Inputs");
      console.log("error");
      return;
    }

    if (amount) {
      stake(parseEther(amount.toString()));
      // Reset form
      setAmount(amount);
    }
    const amountBigInt = BigInt(amount.toString());
    const result = await stake(amountBigInt);
    if (result.success) {
      setAmount(amount);
      setSuccess(true);
    }

    setIsLoadingButton(true);
    setTimeout(() => {
      setIsLoadingButton(false);
      setAmount(amount);
      setTimeout(() => setSuccess(false), 3000);
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
            Stake Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-md my-3 font-medium mb-2 text-white">
                Amount to Stake
              </label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                  className="flex-1 text-white"
                />
                <Button type="button" onClick={handleMax} variant="outline">
                  Max
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Balance: {mockBalance} tokens
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                disabled={isLoadingButton || isPaused}
                onClick={handleSubmit}
                className={`w-full py-2 rounded text-white font-semibold ${
                  isLoadingButton || isPaused
                    ? "bg-gray-400 cursor-not-allowed"
                    : "w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 cursor-pointer"
                }`}
              >
                {isLoading ? "Staking..." : "Stake"}
              </Button>
            </motion.div>
          </form>
          {isPaused && (
            <p className="text-red-600 mt-2 font-semibold">
              Staking is currently paused.
            </p>
          )}
          {error && (
            <p className="text-red-600 mt-2 font-semibold overflow-hidden">
              Error: {error}
            </p>
          )}
          {success && (
            <motion.div
              className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              Staking successful!
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StakingForm;

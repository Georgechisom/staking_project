import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAccount } from "wagmi";
import { useEmergencyWithdraw } from "@/hooks/useEmergencyWithdraw";

const EmergencyWithdrawal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const { emergencyWithdraw, error, isLoading } = useEmergencyWithdraw();
  const { address } = useAccount();

  const handleEmergencyWithdraw = async () => {
    // setIsWithdrawing(true);

    console.log("Emergency amount");

    const result = await emergencyWithdraw();

    if (result.success) {
      setWithdrawn(true);
      console.log("withdraw", result);

      setTimeout(() => {
        // setIsWithdrawing(false);
        setWithdrawn(true);
        setTimeout(() => setWithdrawn(false), 3000);
      }, 2000);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="destructive"
              disabled={isLoading || !address}
              className="bg-yellow-600 hover:bg-red-700 text-white"
            >
              Emergency Withdrawal
            </Button>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 border-red-500/20">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center">
              Emergency Withdrawal
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              Emergency withdrawal will unStake all your tokens immediately
              without rewards and 10% penalty. This action cannot be undone.
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={handleEmergencyWithdraw}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? "Withdrawing..." : "Confirm Emergency Withdrawal"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
            {withdrawn && (
              <motion.div
                className="fixed top-4 right-4 p-4 bg-green-500/20 border border-green-500 rounded text-green-400"
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
              >
                Emergency withdrawal completed!
              </motion.div>
            )}

            {error && (
              <motion.div className="text-red-600 my-2 mt-2 font-semibold overflow-hidden">
                Warning: {error}
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {withdrawn && (
        <motion.div
          className="fixed top-4 right-4 p-4 bg-red-500/20 border border-red-500 rounded text-red-400"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
        >
          Emergency withdrawal completed!
        </motion.div>
      )}

      {error && (
        <motion.div className="text-red-600 my-2 mt-2 font-semibold overflow-hidden">
          Warning: {error}
        </motion.div>
      )}
    </>
  );
};

export default EmergencyWithdrawal;

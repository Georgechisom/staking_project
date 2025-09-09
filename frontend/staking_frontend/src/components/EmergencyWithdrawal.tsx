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
import { AlertTriangle } from "lucide-react";

const EmergencyWithdrawal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  const handleEmergencyWithdraw = async () => {
    setIsWithdrawing(true);
    // Simulate emergency withdrawal
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawn(true);
      setIsOpen(false);
      setTimeout(() => setWithdrawn(false), 3000);
    }, 2000);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergency Withdrawal
            </Button>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 border-red-500/20">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Emergency Withdrawal
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              Emergency withdrawal will unstake all your tokens immediately
              without rewards. This action cannot be undone.
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={handleEmergencyWithdraw}
                disabled={isWithdrawing}
                className="bg-red-600 hover:bg-red-700"
              >
                {isWithdrawing
                  ? "Withdrawing..."
                  : "Confirm Emergency Withdrawal"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isWithdrawing}
              >
                Cancel
              </Button>
            </div>
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
    </>
  );
};

export default EmergencyWithdrawal;

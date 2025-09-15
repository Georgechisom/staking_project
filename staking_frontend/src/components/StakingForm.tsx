import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEther, parseEther, parseUnits } from "viem";
import { toast } from "sonner";
import { useUserState } from "@/hooks/useUserState";
import { useAccount } from "wagmi";

const StakingForm: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [approveSuccess, setApproveSuccess] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isMintLoadingButton, setIsMintLoadingButton] = useState(false);
  const [isApproveLoadingButton, setIsApproveLoadingButton] = useState(false);
  const [approval, setApproval] = useState<number>();
  const { address } = useAccount();
  const {
    stake,
    isLoading,
    error,
    mint,
    isMinting,
    approve,
    isApproving,
    balance,
  } = useUserState();
  const [isApproval, setIsApproval] = useState(true);
  const [isStaking, setIsStaking] = useState(false);

  const [amount, setAmount] = useState<string>("");
  const [mintAmount, setMintAmount] = useState<number>();
  const [userBalance, setUserBalance] = useState<string>("0");

  const mockBalance = 1000; // Mock wallet balance
  const mintTokenAMOUNT = 10000;

  const handleMax = () => {
    setAmount(mockBalance.toString());
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !mintTokenAMOUNT ||
      parseEther(mintTokenAMOUNT.toString()) <= 0
      // parseEther(amount.toString()) < mockBalance
    ) {
      toast("Invalid Inputs");
      console.log("No Amount");
      return;
    }

    const amountTokenBigInt = BigInt(mintTokenAMOUNT.toString());
    const tokenResult = await mint(parseEther(amountTokenBigInt.toString()));
    console.log("mintAmount", amountTokenBigInt);

    if (tokenResult.success) {
      setMintAmount(mintTokenAMOUNT);
      setMintSuccess(true);
      console.log(mintAmount);
    }

    setTimeout(() => {
      setIsMintLoadingButton(false);
      setMintAmount(mintTokenAMOUNT);
      setTimeout(() => setSuccess(false), 2000);
    }, 2000);
  };

  const handleApprovals = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountBigInt = parseUnits(amount.toString(), 18);
    const result = await approve(amountBigInt);

    if (result.success) {
      setAmount(amount);
      setApproval(Number(amount));
      setApproveSuccess(true);
      isApproveButtonChange();
    }

    setIsApproveLoadingButton(true);

    setTimeout(() => {
      setIsApproveLoadingButton(false);
      setAmount(amount);
      setTimeout(() => setApproveSuccess(false), 2000);
    }, 2000);
  };

  const handleStakes = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount) {
      toast("Invalid Inputs");
      console.log("No Amount");
      return;
    } else if (parseEther(amount.toString()) <= 0) {
      toast("Invalid Inputs");
      console.log("Amount Less Than 0");
      return;
    }
    const amountBigInt = parseUnits(amount.toString(), 18);
    const result = await stake(amountBigInt);

    if (result.success) {
      setAmount(amount);
      setApproval(Number(amount));
      setSuccess(true);
      isStakingButtonChange();
    }

    if (approval) {
      isStakingButtonChange();
    }

    setIsLoadingButton(true);
    setTimeout(() => {
      setIsLoadingButton(false);
      setAmount("");
      setTimeout(() => setSuccess(false), 2000);
    }, 2000);
  };

  function isApproveButtonChange() {
    setIsApproval(false);
    setIsStaking(true);
  }
  function isStakingButtonChange() {
    setIsApproval(true);
    setIsStaking(false);
  }

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        const balanceValue = await balance();
        setUserBalance(Number(formatEther(balanceValue)).toFixed(4));
      }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [address, balance]);

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
          <div className="text-white">Your Balance {userBalance}</div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <form onSubmit={handleMint} className="space-y-4">
              <div>
                <Button
                  type="submit"
                  disabled={isMintLoadingButton}
                  onClick={() => handleMint}
                  className={`w-full py-2 rounded text-white font-semibold my-2 ${
                    isMintLoadingButton
                      ? "bg-gray-400 cursor-not-allowed"
                      : "w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-purple-600 cursor-pointer"
                  }`}
                >
                  {isMinting ? "Mint..." : "Mint Token"}
                </Button>
              </div>
            </form>
          </motion.div>
          <form
            onSubmit={handleApprovals}
            className={isApproval ? "block space-y-4" : "hidden"}
          >
            <div>
              <label className="block text-md my-3 font-medium mb-2 text-white">
                Give Approval
              </label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
                disabled={isLoadingButton || !amount}
                onClick={() => handleApprovals}
                className={`w-full py-2 rounded text-white font-semibold ${
                  isApproveLoadingButton
                    ? "bg-gray-400 cursor-not-allowed"
                    : "w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 cursor-pointer"
                }`}
              >
                {isApproving && amount ? "Approving..." : "Approve"}
              </Button>
            </motion.div>
          </form>
          <form
            onSubmit={handleStakes}
            className={isStaking ? "block space-y-4" : "hidden"}
          >
            <div>
              <label className="block text-md my-3 font-medium mb-2 text-white">
                Amount to Stake {amount}
              </label>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <div>
                <Button
                  type="submit"
                  disabled={isLoadingButton || !amount}
                  onClick={() => handleStakes}
                  className={`w-full py-2 rounded text-white font-semibold ${
                    isLoadingButton
                      ? "bg-gray-400 cursor-not-allowed"
                      : "w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 cursor-pointer"
                  }`}
                >
                  {isLoading ? "Staking..." : "Stake"}
                </Button>
              </div>
            </motion.div>
          </form>
          {error && (
            <motion.div className="text-red-600 mt-2 font-semibold overflow-hidden">
              Warning: {error}
            </motion.div>
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
          {mintSuccess && (
            <motion.div
              className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              Token Mint successful!
            </motion.div>
          )}
          {approveSuccess && (
            <motion.div
              className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              Approval successful!
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StakingForm;

import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import { Transactions, ContractDetails, token } from "../generated/schema";
import { stake_contract } from "../generated/stake_contract/stake_contract";

export function loadContractDetails(contractAddress: string): ContractDetails {
  let id = Bytes.fromHexString(contractAddress);
  let contractDetails = ContractDetails.load(id);

  if (!contractDetails) {
    contractDetails = new ContractDetails(id);
    contractDetails.totalMinted = BigInt.fromI32(0);
    contractDetails.totalStakes = BigInt.fromI32(0);
    contractDetails.totalRewardsGiven = BigInt.fromI32(0);
    contractDetails.totalWithdrawn = BigInt.fromI32(0);
    contractDetails.totalEmergencyWithdrawn = BigInt.fromI32(0);
  }

  let contract = stake_contract.bind(Address.fromString(contractAddress));
  contractDetails.totalStakes = contract.totalStaked();

  let result = contract.try_getTotalRewards();
  if (!result.reverted) {
    contractDetails.totalRewardsGiven = result.value;
  } else {
    contractDetails.totalRewardsGiven = BigInt.zero();
  }

  contractDetails.save();
  return contractDetails;
}

export function loadTransactionDetails(userAddress: string): Transactions {
  let id = Bytes.fromHexString(userAddress);
  let transactions = Transactions.load(id);

  if (!transactions) {
    transactions = new Transactions(id);
    transactions.value = BigInt.fromI32(0);
    transactions.totalTransactions = BigInt.fromI32(0);
    transactions.totalUserTransactions = BigInt.fromI32(0);
    transactions.totalUserRewards = BigInt.fromI32(0);
    transactions.totalUserStake = BigInt.fromI32(0);
    transactions.totalUserEmergencyWithdrawn = BigInt.fromI32(0);
    transactions.totalUserWithdrawn = BigInt.fromI32(0);
    transactions.blockNumber = BigInt.fromI32(0);
    transactions.blockTimestamp = BigInt.fromI32(0);
  }

  transactions.save();
  return transactions;
  //return the transactions
}

export function loadTokenDetails(contractAddress: string): token {
  let id = Bytes.fromHexString(contractAddress);
  let tokenDetails = token.load(id);

  if (!tokenDetails) {
    tokenDetails = new token(id);
    tokenDetails.value = BigInt.zero();
    tokenDetails.totalTokenAvailable = BigInt.zero();
    tokenDetails.timestamp = BigInt.zero();
  }

  tokenDetails.save();
  return tokenDetails;
}

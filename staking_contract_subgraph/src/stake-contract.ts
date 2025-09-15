import { BigInt } from "@graphprotocol/graph-ts";
import {
  EmergencyWithdrawn as EmergencyWithdrawnEvent,
  RewardsClaimed as RewardsClaimedEvent,
  Staked as StakedEvent,
  Withdrawn as WithdrawnEvent,
  token as tokenEvent,
} from "../generated/stake_contract/stake_contract";
import {
  token,
  Transactions,
  EmergencyWithdrawnEvent as EmergencyWithdrawnEntity,
  RewardsClaimedEvent as RewardsClaimedEntity,
  StakedEvent as StakedEntity,
  WithdrawnEvent as WithdrawnEntity,
  TokenEvent,
} from "../generated/schema";
import { loadContractDetails, loadTransactionDetails } from "./utils";

export function handleEmergencyWithdrawn(event: EmergencyWithdrawnEvent): void {
  let contractDetails = loadContractDetails(event.address.toHexString());
  contractDetails.save();

  if (event.params.amount) {
    contractDetails.totalEmergencyWithdrawn =
      contractDetails.totalEmergencyWithdrawn.plus(event.params.amount);
  }

  let transactions = loadTransactionDetails(event.params.user.toHexString());
  transactions.totalUserTransactions = transactions.totalUserTransactions.plus(
    BigInt.fromI32(1)
  );
  if (event.params.amount) {
    transactions.totalUserEmergencyWithdrawn =
      transactions.totalUserEmergencyWithdrawn.plus(event.params.amount);
  }
  transactions.save();

  let entityId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new EmergencyWithdrawnEntity(entityId);
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.save();
}

export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
  let contractDetails = loadContractDetails(event.address.toHexString());
  contractDetails.totalMinted = contractDetails.totalMinted.plus(
    event.params.amount
  );
  contractDetails.save();

  let transactions = loadTransactionDetails(event.params.user.toHexString());
  transactions.totalUserTransactions = transactions.totalUserTransactions.plus(
    BigInt.fromI32(1)
  );
  transactions.totalUserRewards = transactions.totalUserRewards.plus(
    event.params.amount
  );
  transactions.save();

  let entityId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new RewardsClaimedEntity(entityId);
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.save();
}

export function handleStaked(event: StakedEvent): void {
  let contractDetails = loadContractDetails(event.address.toHexString());
  contractDetails.totalStakes = event.params.newTotalStaked;
  contractDetails.save();

  let transactions = loadTransactionDetails(event.params.user.toHexString());
  transactions.totalUserTransactions = transactions.totalUserTransactions.plus(
    BigInt.fromI32(1)
  );
  if (event.params.amount) {
    transactions.totalUserStake = transactions.totalUserStake.plus(
      event.params.amount
    );
  }
  transactions.save();

  let entityId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new StakedEntity(entityId);
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.newTotalStaked = event.params.newTotalStaked;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.save();
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let contractDetails = loadContractDetails(event.address.toHexString());

  if (event.params.amount) {
    contractDetails.totalWithdrawn = contractDetails.totalWithdrawn.plus(
      event.params.amount
    );
  }
  contractDetails.save();

  let transactions = loadTransactionDetails(event.params.user.toHexString());
  transactions.totalUserTransactions = transactions.totalUserTransactions.plus(
    BigInt.fromI32(1)
  );
  if (event.params.amount) {
    transactions.totalUserWithdrawn = transactions.totalUserWithdrawn.plus(
      event.params.amount
    );
  }
  transactions.save();

  let entityId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new WithdrawnEntity(entityId);
  entity.user = event.params.user;
  entity.amount = event.params.amount;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.save();
}

export function handleToken(event: tokenEvent): void {
  let contractDetails = loadContractDetails(event.address.toHexString());

  if (event.params.value) {
    contractDetails.totalMinted = contractDetails.totalMinted.plus(
      event.params.value
    );
  }
  contractDetails.save();

  let transactions = loadTransactionDetails(event.address.toHexString());
  transactions.totalUserTransactions = transactions.totalUserTransactions.plus(
    BigInt.fromI32(1)
  );
  if (event.params.value) {
    transactions.totalUserWithdrawn = transactions.totalUserWithdrawn.plus(
      event.params.value
    );
  }
  transactions.save();

  let entityId = event.transaction.hash.concatI32(event.logIndex.toI32());
  let entity = new TokenEvent(entityId);
  entity.value = event.params.value;
  entity.user = event.params.user;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.save();
}

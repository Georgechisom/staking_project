import { BigInt } from "@graphprotocol/graph-ts";
import {
  Approval as ApprovalEvent,
  Transfer as TransferEvent,
} from "../generated/staking_token_contract/staking_token_contract";
import { Approval, Transfer } from "../generated/schema";
import { loadTransactionDetails } from "./utils";

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.spender = event.params.spender;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Update Transactions
  let transactions = loadTransactionDetails(event.address.toHexString());
  transactions.totalTransactions = transactions.totalTransactions.plus(
    BigInt.fromI32(1)
  );
  transactions.totalUserTransactions = transactions.totalUserTransactions.plus(
    BigInt.fromI32(1)
  );
  transactions.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Update Transactions
  let transactions = loadTransactionDetails(event.address.toHexString());
  transactions.totalTransactions = transactions.totalTransactions.plus(
    BigInt.fromI32(1)
  );
  transactions.totalUserTransactions = transactions.totalUserTransactions.plus(
    BigInt.fromI32(1)
  );
  transactions.save();
}

import { BigInt } from "@graphprotocol/graph-ts";
import {
  Approval as ApprovalEvent,
  Transfer as TransferEvent,
} from "../generated/staking_token_contract/staking_token_contract";
import { loadTransactionDetails } from "./utils";

export function handleApproval(event: ApprovalEvent): void {
  // Update Transactions
  let transactions = loadTransactionDetails(event.address.toHexString());
  transactions.totalTransactions = transactions.totalTransactions.plus(
    BigInt.fromI32(1)
  );

  if (event.params.value) {
    transactions.totalUserTransactions =
      transactions.totalUserTransactions.plus(BigInt.fromI32(1));
  }
  transactions.save();
}

export function handleTransfer(event: TransferEvent): void {
  // Update Transactions
  let transactions = loadTransactionDetails(event.address.toHexString());
  transactions.totalTransactions = transactions.totalTransactions.plus(
    BigInt.fromI32(1)
  );
  if (event.params.value) {
    transactions.totalUserTransactions =
      transactions.totalUserTransactions.plus(BigInt.fromI32(1));
  }
  transactions.save();
}

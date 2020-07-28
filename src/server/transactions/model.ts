import { Transaction } from "../../entities";

export interface CreateTransaction {
  accountId: number;
  value: number;
  transactor: string;
}

export class TransactionModel {
  public id: number;
  public accountId: number;
  public value: number;
  public transactor: string;
  public created: Date;

  constructor(transaction: Transaction) {
    this.id = transaction.id;
    this.accountId = transaction.accountId;
    this.value = transaction.value;
    this.transactor = transaction.transactor;
    this.created = transaction.created;
  }
}

import { Account, Transaction, Customer } from "../../entities";

export interface CreateAccount {
  customerId: number;
  initialCredit: number;
}
export interface AccountQuery {
  id: number;
  limit: number;
  offset: number;
}
export class AccountModel {
  public id: number;
  public customerId: number;
  public balance: number;
  public created: Date;
  public updated: Date;

  constructor(account: Account) {
    this.id = account.id;
    this.customerId = account.customerId;
    this.balance = account.balance;
    this.created = account.created;
    this.updated = account.updated;
  }
}

export class DisplayAccount {
  public firstName: string;
  public lastName: string;
  public balance: number;
  public transactions: Transaction[];
  public created: Date;
  public updated: Date;

  constructor(
    account: Account,
    transactions: Transaction[],
    customer: Customer
  ) {
    this.firstName = customer.firstName;
    this.lastName = customer.lastName;
    this.balance = account.balance;
    this.transactions = transactions;
    this.created = account.created;
    this.updated = account.updated;
  }
}

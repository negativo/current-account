import { Context } from "koa";
import { Account } from "../../entities";
import {
  AccountManager,
  TransactionManager,
  CustomerManager
} from "../../managers";
import { CreateAccount, AccountModel, DisplayAccount } from "./model";

export class AccountController {
  private manager: AccountManager;
  private customerManager: CustomerManager;
  private transactionManager: TransactionManager;

  constructor(
    manager: AccountManager,
    transactionManager: TransactionManager,
    customerManager: CustomerManager
  ) {
    this.manager = manager;
    this.transactionManager = transactionManager;
    this.customerManager = customerManager;
  }

  public async create(ctx: Context) {
    try {
      const accountDto: CreateAccount = ctx.request.body;
      const account = {
        customerId: accountDto.customerId,
        balance: 0
      };
      const newAccount = await this.manager.create(account as Account);
      if (accountDto.initialCredit && accountDto.initialCredit !== 0) {
        await this.transactionManager.create({
          transactor: "initialCredit",
          accountId: newAccount.id,
          value: accountDto.initialCredit
        });
      }

      const updatedAccount = await this.manager.findById(newAccount.id);
      ctx.body = new AccountModel(updatedAccount);
      ctx.status = 201;
      ctx.set("location", "/api/v1/accounts");
    } catch (err) {
      throw err;
    }
  }

  public async update(ctx: Context) {
    const accountDto = ctx.request.body;
    const Account = await this.manager.findById(accountDto.id);

    Account.balance = accountDto.balance;

    const updatedAccount = await this.manager.update(Account);

    ctx.body = new AccountModel(updatedAccount);
    ctx.status = 200;
  }

  public async get(ctx: Context) {
    const accountDto = ctx.params;
    const accounts = await this.manager.findByCustomerId(
      ctx.state.customer.id,
      accountDto.limit,
      accountDto.offset
    );

    const customerId = accounts[0].customerId;
    const customer = await this.customerManager.findById(customerId);

    const accountsWithTransactions = await Promise.all(
      accounts.map(async (a: Account) => {
        const transactions = await this.transactionManager.findByAccountId(
          a.id,
          0,
          0
        );
        return new DisplayAccount(a, transactions, customer);
      })
    );
    ctx.body = accountsWithTransactions;
    ctx.status = 200;
  }

  public async delete(ctx: Context) {
    await this.manager.delete(ctx.params.id);
    ctx.status = 204;
  }
}

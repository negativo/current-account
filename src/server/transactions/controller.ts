import { Context } from "koa";
import { Transaction } from "../../entities";
import { TransactionManager } from "../../managers";
import { CreateTransaction, TransactionModel } from "./model";

export class TransactionController {
  private manager: TransactionManager;

  constructor(manager: TransactionManager) {
    this.manager = manager;
  }

  public async create(ctx: Context) {
    const transactionDto: CreateTransaction = ctx.request.body;
    const newTransaction = await this.manager.create(
      transactionDto as Transaction
    );

    ctx.body = new TransactionModel(newTransaction);
    ctx.status = 201;
    ctx.set("location", "/api/v1/transactions/me");
  }

  public async get(ctx: Context) {
    const Transaction = await this.manager.findByTransactionId(
      ctx.query.transactionId
    );
    ctx.body = new TransactionModel(Transaction);
    ctx.status = 200;
  }

  public async getAll(ctx: Context) {
    const accountId = ctx.query.accountId;
    const limit = isNaN(ctx.query.limit) ? 10 : parseInt(ctx.query.limit, 10);
    const offset = isNaN(ctx.query.offset) ? 0 : parseInt(ctx.query.offset, 10);
    const transactions = await this.manager.findByAccountId(
      accountId,
      limit,
      offset
    );

    ctx.body = transactions.map((t: Transaction) => new TransactionModel(t));
    ctx.status = 200;
  }

  public async delete(ctx: Context) {
    await this.manager.delete(ctx.params.id);
    ctx.status = 204;
  }
}

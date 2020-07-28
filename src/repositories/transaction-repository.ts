import { Transaction } from "../entities";
import { NotFoundError } from "../errors";
import { MySql } from "../lib/database";

export class TransactionRepository {
  private readonly TABLE: string = "transaction";
  private db: MySql;

  constructor(db: MySql) {
    this.db = db;
  }

  public async findByAccountId(
    accountId: number,
    limit?: number,
    offset?: number
  ): Promise<Transaction[]> {
    const conn = await this.db.getConnection();
    const results = await conn
      .select()
      .table(this.TABLE)
      .where({ account_id: accountId })
      .orderBy("created", "DESC")
      .offset(offset)
      .limit(limit);

    if (!results) {
      throw new NotFoundError("Transactions does not exist");
    }

    return results.map((r: any) => this.transform(r));
  }
  public async findByTransactionId(id: number): Promise<Transaction> {
    const conn = await this.db.getConnection();
    const row = await conn
      .table(this.TABLE)
      .where({ id })
      .first();

    if (!row) {
      throw new NotFoundError("Transaction does not exist");
    }

    return this.transform(row);
  }

  public async insert(transaction: Transaction): Promise<Transaction> {
    transaction.created = new Date();

    const conn = await this.db.getConnection();

    try {
      const result = await conn.table(this.TABLE).insert({
        account_id: transaction.accountId,
        transactor: transaction.transactor,
        value: transaction.value,
        created: transaction.created
      });

      transaction.id = result[0];

      return transaction;
    } catch (err) {
      throw err;
    }
  }

  public async delete(transactionId: number): Promise<void> {
    const trx = await this.db.getTransaction();

    try {
      await trx
        .from(this.TABLE)
        .delete()
        .where({ id: transactionId });

      await trx.commit();
    } catch (error) {
      trx.rollback(error);
      throw error;
    }
  }

  private transform(row: any): Transaction {
    return {
      id: row.id,
      accountId: row.account_id,
      transactor: row.transactor,
      value: row.value,
      created: row.created
    };
  }
}

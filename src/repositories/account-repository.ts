import { Account } from "../entities";
import { NotFoundError } from "../errors";
import { MySql } from "../lib/database";

export class AccountRepository {
  private readonly TABLE: string = "account";
  private db: MySql;

  constructor(db: MySql) {
    this.db = db;
  }

  public async findById(id: number): Promise<Account> {
    const conn = await this.db.getConnection();
    const row = await conn
      .table(this.TABLE)
      .where({ id })
      .first();

    if (!row) {
      throw new NotFoundError("Account does not exist");
    }

    return this.transform(row);
  }

  public async findByCustomerId(
    customerId: number,
    offset?: number,
    limit?: number
  ): Promise<Account[]> {
    const conn = await this.db.getConnection();
    const results = await conn
      .select()
      .table(this.TABLE)
      .where({ customer_id: customerId })
      .orderBy("updated", "DESC")
      .offset(offset)
      .limit(limit);

    if (!results) {
      throw new NotFoundError("Transactions does not exist");
    }

    return results.map((r: any) => this.transform(r));
  }

  public async insert(account: Account): Promise<Account> {
    account.created = new Date();
    account.updated = new Date();

    const conn = await this.db.getConnection();

    try {
      const result = await conn.table(this.TABLE).insert({
        customer_id: account.customerId,
        balance: account.balance,
        created: account.created,
        updated: account.updated
      });

      account.id = result[0];

      return account;
    } catch (err) {
      throw err;
    }
  }

  public async update(account: Account): Promise<Account> {
    try {
      account.updated = new Date();

      const conn = await this.db.getConnection();

      await conn
        .table(this.TABLE)
        .where({ id: account.id })
        .update({
          balance: account.balance
        });

      return account;
    } catch (err) {
      throw err;
    }
  }

  public async delete(accountId: number): Promise<void> {
    const trx = await this.db.getTransaction();

    try {
      await trx
        .from("transaction")
        .delete()
        .where({ account_id: accountId });

      await trx
        .from(this.TABLE)
        .delete()
        .where({ id: accountId });

      await trx.commit();
    } catch (error) {
      trx.rollback(error);
      throw error;
    }
  }

  private transform(row: any): Account {
    return {
      id: row.id,
      customerId: row.customer_id,
      balance: row.balance,
      created: row.created,
      updated: row.updated
    };
  }
}

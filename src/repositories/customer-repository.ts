import { Customer } from "../entities";
import { NotFoundError, ValidationError } from "../errors";
import { MySql } from "../lib/database";

export class CustomerRepository {
  private readonly TABLE: string = "customer";
  private db: MySql;

  constructor(db: MySql) {
    this.db = db;
  }

  public async findById(id: number): Promise<Customer> {
    const conn = await this.db.getConnection();
    const row = await conn
      .table(this.TABLE)
      .where({ id })
      .first();

    if (!row) {
      throw new NotFoundError("Customer does not exist");
    }

    return this.transform(row);
  }

  public async findByEmail(email: string): Promise<Customer> {
    const conn = await this.db.getConnection();
    const row = await conn
      .table(this.TABLE)
      .where({ email })
      .first();

    if (!row) {
      throw new NotFoundError("Customer does not exist");
    }

    return this.transform(row);
  }

  public async insert(customer: Customer): Promise<Customer> {
    customer.created = new Date();
    customer.updated = new Date();

    const conn = await this.db.getConnection();

    try {
      const result = await conn.table(this.TABLE).insert({
        email: customer.email,
        password: customer.password,
        first_name: customer.firstName,
        last_name: customer.lastName,
        created: customer.created,
        updated: customer.updated
      });

      customer.id = result[0];

      return customer;
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        throw new ValidationError(
          `Email ${customer.email} already exists`,
          err
        );
      }

      throw err;
    }
  }

  public async update(customer: Customer): Promise<Customer> {
    customer.updated = new Date();

    const conn = await this.db.getConnection();

    await conn.table(this.TABLE).update({
      first_name: customer.firstName,
      last_name: customer.lastName,
      password: customer.password
    });

    return customer;
  }

  public async changePassword(
    email: string,
    newPassword: string
  ): Promise<void> {
    const conn = await this.db.getConnection();

    await conn
      .table(this.TABLE)
      .update({
        password: newPassword,
        updated: new Date()
      })
      .where("email", email);
  }

  public async delete(customerId: number): Promise<void> {
    const trx = await this.db.getTransaction();

    try {
      await trx
        .from(this.TABLE)
        .delete()
        .where({ id: customerId });

      await trx.commit();
    } catch (error) {
      trx.rollback(error);
      throw error;
    }
  }

  private transform(row: any): Customer {
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      firstName: row.first_name,
      lastName: row.last_name,
      created: row.created,
      updated: row.updated
    };
  }
}

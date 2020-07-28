import * as knex from "knex";

export function up(db: knex) {
  return db.schema
    .createTable("customer", table => {
      table.increments("id").primary();
      table.string("email", 64).unique();
      table.string("password", 256).notNullable();
      table.string("first_name", 64).notNullable();
      table.string("last_name", 64).notNullable();
      table.dateTime("created").notNullable();
      table.dateTime("updated").notNullable();
    })
    .then(() => {
      return db.schema.createTable("account", table => {
        table.increments("id").primary();
        table.decimal("balance", 15, 2).notNullable();
        table.dateTime("created").notNullable();
        table.dateTime("updated").notNullable();
        table
          .integer("customer_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("customer");
      });
    })
    .then(() => {
      return db.schema.createTable("transaction", table => {
        table.increments("id").primary();
        table.string("from").notNullable();
        table.string("transactor").notNullable();
        table.decimal("value", 15, 2).notNullable();
        table.dateTime("created").notNullable();
        table.dateTime("updated").notNullable();
        table
          .integer("account_id")
          .notNullable()
          .unsigned()
          .references("id")
          .inTable("account");
      });
    });
}

export function down(db: knex) {
  return db.schema
    .dropTable("transaction")
    .dropTable("account")
    .dropTable("customer");
}

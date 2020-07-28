import { expect } from "chai";
import * as supertest from "supertest";
import { truncateTables } from "../../database-utils";
import { CreateTransaction } from "../../../../src/server/transactions/model";
import {
  createCustomerTest,
  getLoginToken,
  testServer
} from "../../server-utils";
describe("POST /api/v1/transactions", () => {
  let token: string;
  let customer;
  let account;
  beforeEach(async () => {
    await truncateTables(["transaction", "account", "customer"]);
    const customerData = {
      email: "customer@gmail.com",
      firstName: "new",
      lastName: "customer",
      password: "password"
    };

    customer = await createCustomerTest(customerData);
    token = await getLoginToken("customer@gmail.com", "password");

    account = await supertest(testServer)
      .post("/api/v1/accounts")
      .set("Authorization", token)
      .send({ customerId: customer.id });
  });

  it("Should create a transactions for the set account", async () => {
    const transaction: CreateTransaction = {
      accountId: account.body.id,
      value: 200,
      transactor: "test transaction"
    };

    const transactionResponse = await supertest(testServer)
      .post("/api/v1/transactions")
      .set("Authorization", token)
      .send(transaction)
      .expect(201);

    expect(transactionResponse.body).includes({
      value: 200,
      accountId: transaction.accountId
    });
  });

  it("Should update the account after the transaction ", async () => {
    const transaction: CreateTransaction = {
      accountId: account.body.id,
      value: 200,
      transactor: "test transaction"
    };

    await supertest(testServer)
      .post("/api/v1/transactions")
      .set("Authorization", token)
      .send(transaction)
      .expect(201);

    await supertest(testServer)
      .post("/api/v1/transactions")
      .set("Authorization", token)
      .send({ ...transaction, transactor: "negative transaction", value: -100 })
      .expect(201);

    const accountResponse = await supertest(testServer)
      .get("/api/v1/accounts")
      .set("Authorization", token)
      .expect(200);

    expect(accountResponse.body[0]).includes({
      balance: Number(100).toFixed(2)
    });
  });
});

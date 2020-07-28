import { expect } from "chai";
import * as supertest from "supertest";
import { truncateTables } from "../../database-utils";
import {
  createCustomerTest,
  getLoginToken,
  testServer
} from "../../server-utils";
describe("POST /api/v1/accounts", () => {
  let token: string;
  let customer;
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
  });

  it("Should create a valid account with balance 200 and return 201", async () => {
    const accountsResponse = await supertest(testServer)
      .post("/api/v1/accounts")
      .set("Authorization", token)
      .send({ customerId: customer.id, initialCredit: 200 })
      .expect(201);

    expect(accountsResponse.body).includes({
      balance: new Number(parseFloat("200.00")).toFixed(2)
    });
  });
});

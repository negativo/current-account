import { expect } from "chai";
import * as supertest from "supertest";
import { truncateTables } from "../../database-utils";
import {
  createCustomerTest,
  getLoginToken,
  testServer
} from "../../server-utils";
describe("GET /api/v1/accounts", () => {
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
    await supertest(testServer)
      .post("/api/v1/accounts")
      .set("Authorization", token)
      .send({ customerId: customer.id, initialCredit: 200 });
  });

  it("Should get all the accounts and transactions for the authenticated customer", async () => {
    const accountsResponse = await supertest(testServer)
      .get("/api/v1/accounts")
      .set("Authorization", token)
      .expect(200);

    expect(accountsResponse.body.length).equal(1);
    expect(accountsResponse.body[0]).includes({
      balance: new Number(parseFloat("200.00")).toFixed(2)
    });
  });
});

import { expect } from "chai";
import * as supertest from "supertest";
import { database, truncateTables } from "../../database-utils";
import { createCustomerTest, testServer } from "../../server-utils";

describe("DELETE /api/v1/customers/:id", () => {
  beforeEach(async () => {
    await truncateTables(["customer"]);
  });

  it("Should delete a customer", async () => {
    await createCustomerTest({
      email: "customer@gmail.com",
      firstName: "customer",
      lastName: "todelete",
      password: "password"
    });

    const conn = await database.getConnection();

    const customers = await conn.from("customer").select();

    expect(customers.length).eql(1);
    expect(customers[0].email).eql("customer@gmail.com");
  });

  it("Should return unauthorized when token is not valid", async () => {
    const res = await supertest(testServer)
      .delete("/api/v1/customers/${customer.id}")
      .set("Authorization", "wrong token")
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it("Should return unauthorized when token is missing", async () => {
    const res = await supertest(testServer)
      .delete("/api/v1/customers/1")
      .expect(401);

    expect(res.body.code).equals(30002);
  });
});

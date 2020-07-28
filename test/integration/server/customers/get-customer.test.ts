import { expect } from "chai";
import * as supertest from "supertest";
import { truncateTables } from "../../database-utils";
import {
  createCustomerTest,
  getLoginToken,
  testServer
} from "../../server-utils";

describe("GET /api/v1/customers", () => {
  beforeEach(async () => {
    await truncateTables(["customer"]);

    const customer = {
      email: "customer@gmail.com",
      firstName: "super",
      lastName: "test",
      password: "test"
    };

    await createCustomerTest(customer);
  });

  it("Should return customer information", async () => {
    const token = await getLoginToken("customer@gmail.com", "test");
    const res = await supertest(testServer)
      .get("/api/v1/customers")
      .set("Authorization", token)
      .expect(200);

    expect(res.body).keys([
      "id",
      "email",
      "firstName",
      "lastName",
      "created",
      "updated"
    ]);
  });

  it("Should return unauthorized when token is not valid", async () => {
    const res = await supertest(testServer)
      .get("/api/v1/customers")
      .set("Authorization", "wrong token")
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it("Should return unauthorized when token is missing", async () => {
    const res = await supertest(testServer)
      .get("/api/v1/customers")
      .expect(401);

    expect(res.body.code).equals(30002);
  });
});

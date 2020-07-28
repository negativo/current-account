import { expect } from "chai";
import * as supertest from "supertest";
import { truncateTables } from "../../database-utils";
import {
  createCustomerTest,
  getLoginToken,
  testServer
} from "../../server-utils";

describe("PUT /api/v1/customers/password", () => {
  let token: string;

  beforeEach(async () => {
    await truncateTables(["transaction", "account", "customer"]);

    const customer = {
      email: "customer@gmail.com",
      firstName: "new",
      lastName: "customer",
      password: "password"
    };

    await createCustomerTest(customer);
    token = await getLoginToken("customer@gmail.com", "password");
  });

  it("Should update customer password and login successfully", async () => {
    let res = await supertest(testServer)
      .put("/api/v1/customers/password")
      .set("Authorization", token)
      .send({ newPassword: "newPassword", oldPassword: "password" })
      .expect(204);

    res = await supertest(testServer)
      .post("/api/v1/customers/login")
      .send({ email: "customer@gmail.com", password: "newPassword" })
      .expect(200);

    expect(res.body).keys(["accessToken"]);
  });

  it("Should update customer password but fail on login", async () => {
    let res = await supertest(testServer)
      .put("/api/v1/customers/password")
      .set("Authorization", token)
      .send({ newPassword: "newPassword", oldPassword: "password" })
      .expect(204);

    res = await supertest(testServer)
      .post("/api/v1/customers/login")
      .send({ email: "customer@gmail.com", password: "password" })
      .expect(400);

    expect(res.body.code).equals(30000);
  });

  it("Should return 400 when missing body data", async () => {
    const res = await supertest(testServer)
      .put("/api/v1/customers/password")
      .set("Authorization", token)
      .send({ newPassword: "newPassword" })
      .expect(400);

    expect(res.body.code).equals(30001);
    expect(res.body.fields.length).equals(1);
    expect(res.body.fields[0].message).eql('"oldPassword" is required');
  });

  it("Should return unauthorized when token is not valid", async () => {
    const res = await supertest(testServer)
      .put("/api/v1/customers/password")
      .set("Authorization", "wrong token")
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it("Should return unauthorized when token is missing", async () => {
    const res = await supertest(testServer)
      .put("/api/v1/customers/password")
      .expect(401);

    expect(res.body.code).equals(30002);
  });
});

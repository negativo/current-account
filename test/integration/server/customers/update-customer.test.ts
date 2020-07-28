import { expect } from "chai";
import * as supertest from "supertest";
import { truncateTables } from "../../database-utils";
import {
  createCustomerTest,
  getLoginToken,
  testServer
} from "../../server-utils";

describe("PUT /api/v1/customers", () => {
  let token: string;

  beforeEach(async () => {
    await truncateTables(["customer"]);

    const customer = {
      email: "newcustomer@gmail.com",
      firstName: "new",
      lastName: "customer",
      password: "password"
    };

    await createCustomerTest(customer);

    token = await getLoginToken("newcustomer@gmail.com", "password");
  });

  it("Should update first and last name", async () => {
    const res = await supertest(testServer)
      .put("/api/v1/customers")
      .set("Authorization", token)
      .send({ firstName: "newer", lastName: "user" })
      .expect(200);

    expect(res.body).include({
      firstName: "newer",
      lastName: "user"
    });
  });

  it("Should return 400 when missing lastName data", async () => {
    const res = await supertest(testServer)
      .put("/api/v1/customers")
      .set("Authorization", token)
      .send({ firstName: "newer" })
      .expect(400);

    expect(res.body.code).equals(30001);
    expect(res.body.fields.length).equals(1);
    expect(res.body.fields[0].message).eql('"lastName" is required');
  });

  it("Should return unauthorized when token is not valid", async () => {
    const res = await supertest(testServer)
      .put("/api/v1/customers")
      .set("Authorization", "wrong token")
      .expect(401);

    expect(res.body.code).equals(30002);
  });

  it("Should return unauthorized when token is missing", async () => {
    const res = await supertest(testServer)
      .put("/api/v1/customers")
      .expect(401);

    expect(res.body.code).equals(30002);
  });
});

import * as pino from "pino";
import * as supertest from "supertest";
import { createContainer } from "../../src/container";
import { createServer } from "../../src/server";
import {
  CreateCustomer,
  CustomerModel
} from "../../src/server/customers/model";
import { database } from "./database-utils";

const logger = pino({ name: "test", level: "silent" });
const container = createContainer(database, logger);
const port = 8282; // set a different port for the testing server

export const appServer = createServer(container);
export const testServer = appServer.listen(port);

export async function createCustomerTest(
  customer: CreateCustomer
): Promise<CustomerModel> {
  const res = await supertest(testServer)
    .post("/api/v1/customers")
    .send(customer)
    .expect(201);

  return res.body;
}

export function shuttingDown(): void {
  container.health.shuttingDown();
}

export async function getLoginToken(
  email: string,
  password: string
): Promise<string> {
  const res = await supertest(testServer)
    .post("/api/v1/customers/login")
    .send({ email, password })
    .expect(200);

  return res.body.accessToken;
}

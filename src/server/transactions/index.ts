import * as Joi from "joi";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import { ServiceContainer } from "../../container";
import * as middleware from "../middlewares";
import { TransactionController } from "./controller";
import * as validators from "./validators";

export function init(server: Koa, container: ServiceContainer) {
  const router = new Router({ prefix: "/api/v1/transactions" });
  const controller = new TransactionController(container.managers.transaction);

  router.get(
    "/",
    middleware.authentication(container.lib.authenticator),
    middleware.validate({
      query: validators.getTransactions
    }),
    controller.getAll.bind(controller)
  );

  router.post(
    "/",
    bodyParser(),
    middleware.authentication(container.lib.authenticator),
    controller.create.bind(controller)
  );

  router.delete(
    "/:id",
    middleware.authentication(container.lib.authenticator),
    middleware.validate({
      params: { id: Joi.number().required() }
    }),
    controller.delete.bind(controller)
  );

  server.use(router.routes());
}

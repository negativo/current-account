import * as Joi from "joi";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import { ServiceContainer } from "../../container";
import * as middleware from "../middlewares";
import { AccountController } from "./controller";
import * as validators from "./validators";

export function init(server: Koa, container: ServiceContainer) {
  const router = new Router({ prefix: "/api/v1/accounts" });
  const controller = new AccountController(
    container.managers.account,
    container.managers.transaction,
    container.managers.customer
  );

  router.get(
    "/",
    middleware.authentication(container.lib.authenticator),
    middleware.validate({ query: validators.getAccount }),
    controller.get.bind(controller)
  );

  router.post(
    "/",
    bodyParser(),
    middleware.authentication(container.lib.authenticator),
    controller.create.bind(controller)
  );

  router.put(
    "/",
    bodyParser(),
    middleware.authentication(container.lib.authenticator),
    middleware.validate({ request: { body: validators.updateAccount } }),
    controller.update.bind(controller)
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

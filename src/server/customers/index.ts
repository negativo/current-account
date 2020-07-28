import * as Joi from "joi";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import { ServiceContainer } from "../../container";
import * as middleware from "../middlewares";
import { CustomerController } from "./controller";
import * as validators from "./validators";

export function init(server: Koa, container: ServiceContainer) {
  const router = new Router({ prefix: "/api/v1/customers" });
  const controller = new CustomerController(container.managers.customer);

  router.get(
    "/",
    middleware.authentication(container.lib.authenticator),
    controller.get.bind(controller)
  );

  router.post(
    "/",
    bodyParser(),
    middleware.validate({ request: { body: validators.createCustomer } }),
    controller.create.bind(controller)
  );

  router.post(
    "/login",
    bodyParser(),
    middleware.validate({ request: { body: validators.login } }),
    controller.login.bind(controller)
  );

  router.put(
    "/",
    bodyParser(),
    middleware.authentication(container.lib.authenticator),
    middleware.validate({ request: { body: validators.updateCustomer } }),
    controller.update.bind(controller)
  );

  router.put(
    "/password",
    bodyParser(),
    middleware.authentication(container.lib.authenticator),
    middleware.validate({
      request: {
        body: validators.changePassword
      }
    }),
    controller.changePassword.bind(controller)
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

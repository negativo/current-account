import { Context } from "koa";
import { Customer } from "../../entities";
import { AuthCustomer } from "../../lib/authentication";
import { CustomerManager } from "../../managers";
import { CreateCustomer, CustomerModel } from "./model";

export class CustomerController {
  private manager: CustomerManager;

  constructor(manager: CustomerManager) {
    this.manager = manager;
  }

  public async create(ctx: Context) {
    const customerDto: CreateCustomer = ctx.request.body;
    const newCustomer = await this.manager.create(customerDto as Customer);

    ctx.body = new CustomerModel(newCustomer);
    ctx.status = 201;
    ctx.set("location", "/api/v1/customers/");
  }

  public async login(ctx: Context) {
    ctx.body = {
      accessToken: await this.manager.login(
        ctx.request.body.email,
        ctx.request.body.password
      )
    };
  }

  public async update(ctx: Context) {
    const customerDto = ctx.request.body;
    const customer = await this.manager.findByEmail(ctx.state.customer.email);

    customer.firstName = customerDto.firstName;
    customer.lastName = customerDto.lastName;

    const updatedCustomer = await this.manager.update(customer);

    ctx.body = new CustomerModel(updatedCustomer);
    ctx.status = 200;
  }

  public async changePassword(ctx: Context) {
    const newPassword = ctx.request.body.newPassword;
    const oldPassword = ctx.request.body.oldPassword;

    await this.manager.changePassword(
      ctx.state.customer.email,
      newPassword,
      oldPassword
    );

    ctx.status = 204;
  }

  public async get(ctx: Context) {
    const authCustomer: AuthCustomer = ctx.state.customer;
    const customer = await this.manager.findByEmail(authCustomer.email);

    ctx.body = new CustomerModel(customer);
    ctx.status = 200;
  }

  public async delete(ctx: Context) {
    await this.manager.delete(ctx.params.id);

    ctx.status = 204;
  }
}

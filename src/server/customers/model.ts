import { Customer } from "../../entities";

export interface CreateCustomer {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class CustomerModel {
  public id: number;
  public email: string;
  public firstName: string;
  public lastName: string;
  public created: Date;
  public updated: Date;

  constructor(customer: Customer) {
    this.id = customer.id;
    this.email = customer.email;
    this.firstName = customer.firstName;
    this.lastName = customer.lastName;
    this.created = customer.created;
    this.updated = customer.updated;
  }
}

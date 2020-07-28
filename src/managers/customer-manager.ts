import { Customer } from "../entities";
import { ValidationError } from "../errors";
import { Authenticator } from "../lib/authentication";
import { Hasher } from "../lib/hasher";
import { CustomerRepository } from "../repositories";

export class CustomerManager {
  private repo: CustomerRepository;
  private hasher: Hasher;
  private auth: Authenticator;

  constructor(repo: CustomerRepository, hasher: Hasher, auth: Authenticator) {
    this.repo = repo;
    this.hasher = hasher;
    this.auth = auth;
  }

  public async findById(id: number): Promise<Customer> {
    return this.repo.findById(id);
  }

  public async findByEmail(email: string): Promise<Customer> {
    return this.repo.findByEmail(email);
  }

  public async create(customer: Customer): Promise<Customer> {
    const hashPassword = await this.hasher.hashPassword(customer.password);

    customer.password = hashPassword;

    return this.repo.insert(customer);
  }

  public async login(email: string, password: string): Promise<string> {
    const customer = await this.repo.findByEmail(email);

    if (await this.hasher.verifyPassword(password, customer.password)) {
      return this.auth.authenticate(customer);
    }

    throw new ValidationError("Wrong credentials");
  }

  public update(customer: Customer): Promise<Customer> {
    return this.repo.update(customer);
  }

  public async changePassword(
    email: string,
    newPassword: string,
    oldPassword: string
  ): Promise<void> {
    const customer = await this.repo.findByEmail(email);
    const validPassword = await this.hasher.verifyPassword(
      oldPassword,
      customer.password
    );

    if (!validPassword) {
      throw new ValidationError("Old password is not correct");
    }

    const hashPassword = await this.hasher.hashPassword(newPassword);

    return this.repo.changePassword(email, hashPassword);
  }

  public delete(customerId: number): Promise<void> {
    return this.repo.delete(customerId);
  }
}

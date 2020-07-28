import * as jwt from "jsonwebtoken";
import { Customer } from "../../entities";
import { UnauthorizedError } from "../../errors";
import { CustomerRepository } from "../../repositories";

export interface AuthCustomer {
  id: number;
  email: string;
}

export interface Authenticator {
  validate(token: string): Promise<AuthCustomer>;
  authenticate(customer: Customer): string;
}

export class JWTAuthenticator implements Authenticator {
  private customerRepo: CustomerRepository;
  private secret: string;

  constructor(customerRepo: CustomerRepository) {
    this.customerRepo = customerRepo;
    this.secret = process.env.SECRET_KEY || "secret";
  }

  public async validate(token: string): Promise<AuthCustomer> {
    try {
      const decode: any = jwt.verify(token, this.secret);
      const customer = await this.customerRepo.findByEmail(decode.email);

      return {
        id: customer.id,
        email: customer.email
      };
    } catch (err) {
      throw new UnauthorizedError(err);
    }
  }

  public authenticate(customer: Customer): string {
    return jwt.sign({ id: customer.id, email: customer.email }, this.secret, {
      expiresIn: 60 * 60
    });
  }
}

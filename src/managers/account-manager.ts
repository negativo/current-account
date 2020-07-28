import { Account } from "../entities";
import { AccountRepository } from "../repositories";

export class AccountManager {
  private repo: AccountRepository;

  constructor(repo: AccountRepository) {
    this.repo = repo;
  }

  public async findById(id: number): Promise<Account> {
    return this.repo.findById(id);
  }

  public async findByCustomerId(
    customerId: number,
    limit?: number,
    offset?: number
  ): Promise<Account[]> {
    return this.repo.findByCustomerId(customerId, limit, offset);
  }

  public async create(account: Account): Promise<Account> {
    return this.repo.insert(account);
  }

  public update(account: Account): Promise<Account> {
    return this.repo.update(account);
  }

  public delete(accountId: number): Promise<void> {
    return this.repo.delete(accountId);
  }
}

import { Transaction } from "../entities";
import { TransactionRepository, AccountRepository } from "../repositories";

export class TransactionManager {
  private repo: TransactionRepository;
  private accountRepo: AccountRepository;

  constructor(repo: TransactionRepository, accountRepo: AccountRepository) {
    this.repo = repo;
    this.accountRepo = accountRepo;
  }

  public async findByTransactionId(id: number): Promise<Transaction> {
    return this.repo.findByTransactionId(id);
  }
  public async findByAccountId(
    accountId: number,
    limit?: number,
    offset?: number
  ): Promise<Transaction[]> {
    return this.repo.findByAccountId(accountId, limit, offset);
  }
  public async create(transaction: Transaction): Promise<Transaction> {
    const account = await this.accountRepo.findById(transaction.accountId);
    await this.accountRepo.update({
      ...account,
      balance: Number(account.balance) + Number(transaction.value)
    });

    return this.repo.insert(transaction);
  }

  public delete(transactionId: number): Promise<void> {
    return this.repo.delete(transactionId);
  }
}

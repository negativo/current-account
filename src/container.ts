import { Logger } from "pino";
import { Authenticator, JWTAuthenticator } from "./lib/authentication";
import { MySql } from "./lib/database";
import { BCryptHasher, Hasher } from "./lib/hasher";
import { HealthMonitor } from "./lib/health";
import {
  CustomerManager,
  AccountManager,
  TransactionManager
} from "./managers";
import {
  CustomerRepository,
  AccountRepository,
  TransactionRepository
} from "./repositories";

export interface ServiceContainer {
  health: HealthMonitor;
  logger: Logger;
  lib: {
    hasher: Hasher;
    authenticator: Authenticator;
  };
  repositories: {
    customer: CustomerRepository;
    account: AccountRepository;
    transaction: TransactionRepository;
  };
  managers: {
    customer: CustomerManager;
    account: AccountManager;
    transaction: TransactionManager;
  };
}

export function createContainer(db: MySql, logger: Logger): ServiceContainer {
  const accountRepo = new AccountRepository(db);
  const transactionRepo = new TransactionRepository(db);
  const customerRepo = new CustomerRepository(db);
  const hasher = new BCryptHasher();
  const authenticator = new JWTAuthenticator(customerRepo);
  const healthMonitor = new HealthMonitor();

  return {
    health: healthMonitor,
    logger,
    lib: {
      hasher,
      authenticator
    },
    repositories: {
      customer: customerRepo,
      account: accountRepo,
      transaction: transactionRepo
    },
    managers: {
      account: new AccountManager(accountRepo),
      transaction: new TransactionManager(transactionRepo, accountRepo),
      customer: new CustomerManager(customerRepo, hasher, authenticator)
    }
  };
}

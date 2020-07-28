export interface Transaction {
  id?: number;
  accountId: number;
  transactor: string;
  value: number;
  created?: Date;
}

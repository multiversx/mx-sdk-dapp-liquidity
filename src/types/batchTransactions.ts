import { ServerTransaction } from './transaction';

export interface BatchTransactions {
  batchId: string;
  transactions: ServerTransaction[];
}

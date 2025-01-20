import { ServerTransaction } from '../types/transaction';

export function serializeTransaction(transaction: ServerTransaction): string {
  return JSON.stringify(transaction, (_key, value) => {
    return typeof value === 'bigint' ? Number(value).toString() : value;
  });
}

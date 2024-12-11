import { Transaction } from 'viem/types/transaction';

export function serializeTransaction(transaction: Transaction): string {
  return JSON.stringify(transaction, (_key, value) => {
    return typeof value === 'bigint' ? Number(value).toString() : value;
  });
}

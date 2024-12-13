import {
  TransactionBase,
  Transaction as ViemTransaction
} from 'viem/types/transaction';

export type TransactionType = TransactionBase & {
  account: `0x${string}`;
};
export type Transaction = ViemTransaction;

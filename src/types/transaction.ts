import {
  // TransactionBase,
  Transaction as ViemTransaction
} from 'viem/types/transaction';
// import { UseTransactionReturnType } from 'wagmi';

export type ServerTransaction = {
  to: `0x${string}`;
  data: `0x${string}`;
  gasLimit: bigint;
  value: bigint;
  account: string;
  hash: string;
};

// export type TransactionType = TransactionBase & {
//   account: `0x${string}`;
// };

// export type TransactionType = ServerTransaction & {
export type TransactionType = Transaction & {
  account: `0x${string}`;
};

export type Transaction = ViemTransaction;

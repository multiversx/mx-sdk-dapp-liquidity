import {
  // TransactionBase,
  Transaction as ViemTransaction
} from 'viem/types/transaction';

export type ServerTransaction = {
  to: `0x${string}`;
  data: `0x${string}`;
  gasLimit: bigint;
  value: bigint;
};

// export type TransactionType = TransactionBase & {
//   account: `0x${string}`;
// };

export type TransactionType = ServerTransaction & {
  account: `0x${string}`;
};

export type Transaction = ViemTransaction;

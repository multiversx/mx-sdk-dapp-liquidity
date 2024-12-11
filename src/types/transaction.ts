import { TransactionBase } from 'viem/types/transaction';

export type TransactionType = TransactionBase & { account: `0x${string}` };

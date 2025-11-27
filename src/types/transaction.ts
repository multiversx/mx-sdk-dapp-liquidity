import { IPlainTransactionObject as MvxTransactions } from '@multiversx/sdk-core/out';
import { TransactionInstructionCtorFields } from '@solana/web3.js';
import {
  TransactionBase,
  Transaction as ViemTransaction
} from 'viem/types/transaction';

export type BaseTransaction = {
  to: `0x${string}`;
  data: `0x${string}`;
  gasLimit: bigint;
  value: bigint;
  account: string;
  txHash: string;
  signatures?: string[];
  recentBlockhash?: string;
  feePayer?: string;
  instructions?: TransactionInstructionCtorFields[];
  bitcoinParams?: {
    psbt: string;
    signInputs: {
      address: string;
      index: number;
      sighashTypes: number[];
    }[];
    broadcast: boolean;
  };
};

export type ServerTransaction = BaseTransaction & Partial<MvxTransactions>;

export type TransactionType = TransactionBase & {
  account: `0x${string}`;
};

export type Transaction = ViemTransaction;

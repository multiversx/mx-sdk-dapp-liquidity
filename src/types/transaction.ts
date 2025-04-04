import {
  TransactionBase,
  Transaction as ViemTransaction
} from 'viem/types/transaction';

export type ServerTransactionInstruction = {
  keys: [
    { pubkey: string; isSigner: boolean; isWritable: boolean },
    { pubkey: string; isSigner: boolean; isWritable: boolean }
  ];
  programId: string;
  data: ArrayBuffer;
};

export type ServerTransaction = {
  to: `0x${string}`;
  data: `0x${string}`;
  gasLimit: bigint;
  value: bigint;
  account: string;
  txHash: string;
  signatures?: string[];
  feePayer?: string;
  instructions?: ServerTransactionInstruction[];
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

export type TransactionType = TransactionBase & {
  account: `0x${string}`;
};

export type Transaction = ViemTransaction;

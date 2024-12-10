import { useCallback, useEffect, useRef } from 'react';
import { PublicClient, Transaction } from 'viem';
import { TransactionType } from 'types/transaction';
import { useSignTransactions } from './useSignTransactions';
import { getPublicClient } from '../utils/getPublicClient';

export const useSignAndSendTransactions = () => {
  const publicClientRef = useRef<PublicClient | null>(null);
  const { signTransaction, signTransactions } = useSignTransactions();

  const setPublicClient = useCallback(async () => {
    publicClientRef.current = await getPublicClient();
  }, []);

  useEffect(() => {
    setPublicClient();
  }, []);

  const getTransactionByHash = useCallback((hash: `0x${string}`) => {
    return publicClientRef.current?.getTransaction({
      hash
    });
  }, []);

  const signAndSendTransaction = useCallback(
    async (transaction: TransactionType) => {
      const hash = await signTransaction(transaction);
      const signedTransaction = await getTransactionByHash(hash);

      console.log({ signedTransaction });
      // TODO send signed transaction to the server
    },
    []
  );

  const signAndSendTransactions = useCallback(
    async (transactions: TransactionType[]) => {
      const signedTransactions: Transaction[] = [];
      const hashes = await signTransactions(transactions);

      for (const hash of hashes) {
        const signedTransaction = await getTransactionByHash(hash);

        if (!signedTransaction) {
          continue;
        }

        signedTransactions.push(signedTransaction);
      }

      console.log({ signedTransactions });
      // TODO send signed transactions to the server
    },
    []
  );

  return {
    signAndSendTransaction,
    signAndSendTransactions
  };
};

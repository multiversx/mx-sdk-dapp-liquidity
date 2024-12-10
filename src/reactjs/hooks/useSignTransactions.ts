import { useCallback, useMemo } from 'react';
import { sendTransaction } from 'viem/actions';
import { TransactionType } from 'types/transaction';
import { useWeb3App } from './useWeb3App';

export const useSignTransactions = () => {
  const app = useWeb3App();

  const chainId = useMemo(() => app.appKit.getChainId(), [app.appKit]);
  const client = useMemo(
    () =>
      app.config.getClient({
        chainId: Number(chainId)
      }),
    [app.config, chainId]
  );

  const signTransaction = useCallback(
    async (transaction: TransactionType & { account: `0x${string}` }) => {
      const signature = await sendTransaction(client, transaction);

      // TODO send signed transaction to the server
      return {
        ...transaction,
        signature
      };
    },
    [client]
  );

  const signTransactions = useCallback(
    async (transactions: TransactionType[]) => {
      const signedTransactions: TransactionType[] = [];

      const promises = transactions.map((transaction) =>
        signTransaction(transaction)
      );
      const resolvedPromises = await Promise.allSettled(promises);

      resolvedPromises.forEach((resolvedPromise) => {
        if (resolvedPromise.status === 'fulfilled') {
          signedTransactions.push(resolvedPromise.value);
        }
        if (resolvedPromise.status === 'rejected') {
          console.log('error', resolvedPromise.reason);
        }
      });

      // TODO send signed transactions to the server
      return signedTransactions;
    },
    [signTransaction]
  );

  return {
    signTransaction,
    signTransactions
  };
};

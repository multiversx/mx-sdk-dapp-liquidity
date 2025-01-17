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
    async (transaction: TransactionType) => {
      if (!client) {
        throw new Error('Client not found');
      }

      // TODO fix typescript error
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const hash = await sendTransaction(client, transaction);
      console.log({ hash });
      return {
        ...transaction,
        hash
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

      return signedTransactions;
    },
    [signTransaction]
  );

  return {
    signTransaction,
    signTransactions
  };
};

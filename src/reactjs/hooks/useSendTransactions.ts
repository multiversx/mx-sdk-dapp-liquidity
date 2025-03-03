import { useCallback } from 'react';
import {
  sendTransactions,
  SendTransactionsType
} from '../../api/sendTransactions';

export const useSendTransactions = () => {
  return useCallback(
    async ({
      transactions,
      provider,
      url,
      token,
      axiosConfig
    }: SendTransactionsType) => {
      return await sendTransactions({
        transactions,
        provider,
        url,
        token,
        axiosConfig
      });
    },
    []
  );
};

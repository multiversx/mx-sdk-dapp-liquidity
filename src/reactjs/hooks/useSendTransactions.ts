import { useCallback } from 'react';
import {
  sendTransactions,
  SendTransactionsType
} from '../../api/sendTransactions';

export const useSendTransactions = () => {
  return useCallback(
    async ({ transactions, url, token, axiosConfig }: SendTransactionsType) => {
      return await sendTransactions({
        transactions,
        url,
        token,
        axiosConfig
      });
    },
    []
  );
};

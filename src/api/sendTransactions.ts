import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Transaction } from 'viem/types/transaction';
import { TransactionType } from 'types/transaction';
import { serializeTransaction } from '../helpers/serializeTransaction';

export type SendTransactionsType = {
  transactions: Transaction[];
  url: string;
  token: string;
  axiosConfig?: AxiosRequestConfig;
};

export const sendTransactions = async ({
  transactions,
  url,
  token,
  axiosConfig
}: SendTransactionsType): Promise<AxiosResponse<TransactionType[]>> => {
  const config: AxiosRequestConfig = {
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    ...axiosConfig
  };

  return axios.post<TransactionType[]>(
    `/transactions`,
    transactions.map((transaction) =>
      JSON.parse(serializeTransaction(transaction))
    ),
    config
  );
};

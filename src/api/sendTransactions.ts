import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { serializeTransaction } from '../helpers/serializeTransaction';
import { BatchTransactions } from '../types/batchTransactions';
import { ServerTransaction } from '../types/transaction';

export type SendTransactionsType = {
  transactions: ServerTransaction[];
  url: string;
  token: string;
  axiosConfig?: AxiosRequestConfig;
};

export const sendTransactions = async ({
  transactions,
  url,
  token,
  axiosConfig
}: SendTransactionsType): Promise<AxiosResponse<BatchTransactions>> => {
  const config: AxiosRequestConfig = {
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    ...axiosConfig
  };

  return axios.post<BatchTransactions>(
    `/transactions`,
    transactions.map((transaction) =>
      JSON.parse(serializeTransaction(transaction))
    ),
    config
  );
};

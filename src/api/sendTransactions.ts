import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { serializeTransaction } from '../helpers/serializeTransaction';
import { BatchTransactions } from '../types/batchTransactions';
import { ProviderType } from '../types/providerType';
import { ServerTransaction } from '../types/transaction';

export type SendTransactionsType = {
  transactions: ServerTransaction[];
  provider: ProviderType;
  url: string;
  token: string;
  axiosConfig?: AxiosRequestConfig;
};

export const sendTransactions = async ({
  transactions,
  provider,
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
    {
      transactions: transactions.map((transaction) =>
        JSON.parse(serializeTransaction(transaction))
      ),
      provider
    },
    config
  );
};

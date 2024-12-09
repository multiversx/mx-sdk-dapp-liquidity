import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { TransactionType } from 'types/transaction';

type SendTransactionsType = {
  transactions: TransactionType[];
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

  return await axios.post<TransactionType[]>(
    `/transactions`,
    transactions,
    config
  );
};

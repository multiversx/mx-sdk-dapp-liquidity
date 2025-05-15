import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { TransactionDTO } from 'dto/Transaction.dto';
import { ProviderType } from 'types/providerType';

export async function getTransactions({
  url,
  address,
  sender,
  provider,
  status,
  tokenIn,
  tokenOut,
  nativeAuthToken
}: {
  url: string;
  address: string;
  sender?: string;
  provider?: ProviderType;
  status?: string;
  tokenIn?: string;
  tokenOut?: string;
  nativeAuthToken: string;
}): Promise<AxiosResponse<TransactionDTO[]>> {
  const queryParams = new URLSearchParams({
    receiver: address || '',
    sender: sender || '',
    provider: provider || '',
    status: status || '',
    tokenIn: tokenIn || '',
    tokenOut: tokenOut || ''
  });

  const params = Object.entries(Object.fromEntries(queryParams.entries()));

  for (const [key, value] of params) {
    if (value === '') {
      queryParams.delete(key);
    }
  }

  const queryString = queryParams.toString();
  const endpointWithParams = `/transactions?${queryString}`;

  const config: AxiosRequestConfig = {
    baseURL: url,
    headers: {
      Authorization: `Bearer ${nativeAuthToken}`
    }
  };

  return await axios.get<TransactionDTO[]>(endpointWithParams, config);
}

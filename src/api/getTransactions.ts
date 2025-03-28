import axios, { AxiosResponse } from 'axios';
import { TransactionDTO } from 'dto/Transaction.dto';
import { ProviderType } from 'types/providerType';

export async function getTransactions({
  url,
  address,
  sender,
  provider,
  status,
  tokenIn,
  tokenOut
}: {
  url: string;
  address: string;
  sender?: string;
  provider?: ProviderType;
  status?: string;
  tokenIn?: string;
  tokenOut?: string;
}): Promise<AxiosResponse<TransactionDTO[]>> {
  const queryParams = new URLSearchParams({
    receiver: address || '',
    sender: sender || '',
    provider: provider || '',
    status: status || '',
    tokenIn: tokenIn || '',
    tokenOut: tokenOut || ''
  });

  for (const [key, value] of queryParams.entries()) {
    if (!value) {
      queryParams.delete(key);
    }
  }

  const queryString = queryParams.toString();
  const endpointWithParams = `/transactions/?${queryString}`;

  return await axios.get<TransactionDTO[]>(endpointWithParams, {
    baseURL: url
  });
}

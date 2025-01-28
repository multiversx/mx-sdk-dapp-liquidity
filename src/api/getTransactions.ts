import axios, { AxiosResponse } from 'axios';
import { TransactionDTO } from 'dto/Transaction.dto';

export async function getTransactions({
  url,
  userWalletAddress
}: {
  url: string;
  userWalletAddress: string;
}): Promise<AxiosResponse<TransactionDTO[]>> {
  const endpoint = userWalletAddress
    ? `/transactions/${userWalletAddress}`
    : '/transactions';

  return await axios.get<TransactionDTO[]>(endpoint, {
    baseURL: url
  });
}

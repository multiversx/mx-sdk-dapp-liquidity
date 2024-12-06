import axios, { AxiosResponse } from 'axios';
import { TransactionDTO } from 'dto/Transaction.dto';

export async function getTransactions({
  url,
  transactionId,
  userWalletAddress
}: {
  url: string;
  transactionId?: number;
  userWalletAddress?: number;
}): Promise<AxiosResponse<TransactionDTO[]>> {
  let endpoint = transactionId
    ? `/transactions/${transactionId}`
    : '/transactions';

  endpoint = userWalletAddress ? `${endpoint}/${userWalletAddress}` : endpoint;

  return await axios.get<TransactionDTO[]>(endpoint, {
    baseURL: url
  });
}

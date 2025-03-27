import axios, { AxiosResponse } from 'axios';
import { TransactionDTO } from 'dto/Transaction.dto';

export async function getTransactions({
  url,
  userWalletAddress
}: {
  url: string;
  userWalletAddress: string;
}): Promise<AxiosResponse<TransactionDTO[]>> {
  return await axios.get<TransactionDTO[]>(
    `/transactions/${userWalletAddress}?receiver=${userWalletAddress}`,
    {
      baseURL: url
    }
  );
}

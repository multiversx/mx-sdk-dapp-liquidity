import axios, { AxiosResponse } from 'axios';
import { TokenBalanceDTO } from '../dto/TokenBalance.dto';

export async function getTokensBalances({
  url,
  userAddress
}: {
  url: string;
  userAddress?: string;
}): Promise<AxiosResponse<TokenBalanceDTO[]>> {
  if (!userAddress) {
    throw new Error('User address is required');
  }

  return await axios.get<TokenBalanceDTO[]>(`/tokens/${userAddress}`, {
    baseURL: url
  });
}

import axios, { AxiosResponse } from 'axios';
import { TokenBalanceDTO } from '../dto/TokenBalance.dto';

export async function getTokensBalances({
  url,
  userAddress,
  chainId
}: {
  url: string;
  userAddress: string;
  chainId: string;
}): Promise<AxiosResponse<TokenBalanceDTO[]>> {
  if (!userAddress) {
    throw new Error('User address is required');
  }

  if (!chainId) {
    throw new Error('Chain ID is required');
  }

  return await axios.get<TokenBalanceDTO[]>(
    `/tokens/balances/${userAddress}/${chainId}`,
    {
      baseURL: url
    }
  );
}

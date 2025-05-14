import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { TokenBalanceDTO } from '../dto/TokenBalance.dto';

export async function getTokensBalances({
  url,
  userAddress,
  chainId,
  nativeAuthToken
}: {
  url: string;
  userAddress: string;
  chainId: string;
  nativeAuthToken?: string;
}): Promise<AxiosResponse<TokenBalanceDTO[]>> {
  const config: AxiosRequestConfig = {
    baseURL: url,
    headers: {
      Authorization: `Bearer ${nativeAuthToken}`
    }
  };

  return await axios.get<TokenBalanceDTO[]>(
    `/tokens/balances/${userAddress}/${chainId}`,
    config
  );
}

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { TokenType } from '../types/token';

export async function getTokens({
  url,
  chainId,
  nativeAuthToken,
  bridgeOnly
}: {
  url: string;
  chainId?: number;
  nativeAuthToken: string;
  bridgeOnly: boolean;
}): Promise<AxiosResponse<TokenType[]>> {
  const config: AxiosRequestConfig = {
    baseURL: url,
    headers: {
      Authorization: `Bearer ${nativeAuthToken}`
    }
  };

  const endpoint = chainId ? `/tokens/${chainId}` : '/tokens';

  return await axios.get<TokenType[]>(
    `${endpoint}?isBridge=${bridgeOnly}`,
    config
  );
}

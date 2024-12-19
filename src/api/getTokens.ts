import axios, { AxiosResponse } from 'axios';
import { TokenType } from '../types/token';

export async function getTokens({
  url,
  chainId
}: {
  url: string;
  chainId?: number;
}): Promise<AxiosResponse<TokenType[]>> {
  const endpoint = chainId ? `/tokens/${chainId}` : '/tokens';

  return await axios.get<TokenType[]>(endpoint, {
    baseURL: url
  });
}

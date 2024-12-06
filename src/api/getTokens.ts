import axios, { AxiosResponse } from 'axios';
import { TokenDTO } from 'dto/Token.dto';

export async function getTokens({
  url,
  chainId
}: {
  url: string;
  chainId?: number;
}): Promise<AxiosResponse<TokenDTO[]>> {
  const endpoint = chainId ? `/tokens/${chainId}` : '/tokens';

  return await axios.get<TokenDTO[]>(endpoint, {
    baseURL: url
  });
}

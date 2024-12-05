import axios, { AxiosResponse } from 'axios';
import { ChainDTO } from '../dto/Chain.dto';

export async function getChains({
  url,
  chainId
}: {
  url: string;
  chainId?: number;
}): Promise<AxiosResponse<ChainDTO[]>> {
  const endpoint = chainId ? `/chains/${chainId}` : '/chains';

  return await axios.get<ChainDTO[]>(endpoint, {
    baseURL: url
  });
}

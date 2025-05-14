import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ChainDTO } from '../dto/Chain.dto';

export async function getChains({
  url,
  nativeAuthToken
}: {
  url: string;
  nativeAuthToken?: string;
}): Promise<AxiosResponse<ChainDTO[]>> {
  const config: AxiosRequestConfig = {
    baseURL: url,
    headers: {
      Authorization: `Bearer ${nativeAuthToken}`
    }
  };

  return await axios.get<ChainDTO[]>('/chains', config);
}

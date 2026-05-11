import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ChainDTO } from '../dto/Chain.dto';

export async function getChains({
  url,
  nativeAuthToken,
  bridgeOnly
}: {
  url: string;
  nativeAuthToken: string;
  bridgeOnly: boolean;
}): Promise<AxiosResponse<ChainDTO[]>> {
  const config: AxiosRequestConfig = {
    baseURL: url,
    headers: {
      Authorization: `Bearer ${nativeAuthToken}`
    }
  };

  return axios.get<ChainDTO[]>(`/chains?isBridge=${bridgeOnly}`, config);
}

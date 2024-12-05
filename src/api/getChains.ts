import axios, { AxiosResponse } from 'axios';
import { ChainDTO } from '../dto/Chain.dto';

export async function getChains({
  url
}: {
  url: string;
}): Promise<AxiosResponse<ChainDTO[]>> {
  return await axios.get<ChainDTO[]>('/chains', {
    baseURL: url
  });
}

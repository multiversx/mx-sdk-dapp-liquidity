import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ConfirmRateDTO } from 'dto/ConfirmRateDTO';
import { decodeToken } from 'helpers/decodeToken';
import { TransactionType } from '../types/transaction.ts';

type ConfirmRateProps = {
  url: string;
  nativeAuthToken: string;
  body: ConfirmRateDTO;
};

export async function confirmRate({
  url,
  nativeAuthToken,
  body
}: ConfirmRateProps): Promise<AxiosResponse<TransactionType[]>> {
  const config: AxiosRequestConfig = {
    baseURL: url,
    headers: {
      Authorization: `Bearer ${nativeAuthToken}`
    }
  };

  if (!nativeAuthToken) {
    delete config.headers?.Authorization;
  }

  const decodedToken = await decodeToken(nativeAuthToken);
  config.headers = {
    ...config.headers,
    origin: decodedToken?.origin
  };

  return await axios.post<TransactionType[]>(`/rate/confirm`, body, config);
}

import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import { decodeToken } from 'helpers/decodeToken';
import { ConfirmRateDto } from '../dto/ConfirmRate.dto.ts';
import { ServerTransaction } from '../types/transaction';

type ConfirmRateProps = {
  url: string;
  nativeAuthToken: string;
  body: ConfirmRateDto;
};

export async function confirmRate({
  url,
  nativeAuthToken,
  body
}: ConfirmRateProps): Promise<AxiosResponse<ServerTransaction[]>> {
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

  if ((config.headers as AxiosHeaders).set) {
    (config.headers as AxiosHeaders).set({
      ...config.headers,
      origin: decodedToken?.origin ?? ''
    });
  }

  return await axios.post<ServerTransaction[]>(`/rate/confirm`, body, config);
}

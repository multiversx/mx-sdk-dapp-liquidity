import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import { decodeToken } from 'helpers/decodeToken';
import { ConfirmRateDto } from '../dto/ConfirmRate.dto';

type ConfirmFiatRateProps = {
  url: string;
  nativeAuthToken: string;
  body: ConfirmRateDto;
};

type ConfirmFiatRateResponse = ConfirmRateDto &
  {
    type: string;
    content: string;
    additionalInfo: {
      url: string;
      checksum: string;
      jsonRequest: string;
    };
  }[];

export async function confirmFiatRate({
  url,
  nativeAuthToken,
  body
}: ConfirmFiatRateProps): Promise<AxiosResponse<ConfirmFiatRateResponse>> {
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

  return await axios.post<ConfirmFiatRateResponse>(
    `/rate/confirm`,
    body,
    config
  );
}

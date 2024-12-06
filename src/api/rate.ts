import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { decodeToken } from 'helpers/decodeToken';
import { RateRequestBody, RateRequestResponse } from 'types/rate';

interface RateProps {
  url: string;
  nativeAuthToken: string;
  body: RateRequestBody;
}

export async function rate({
  url,
  nativeAuthToken,
  body
}: RateProps): Promise<AxiosResponse<RateRequestResponse>> {
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

  return await axios.post<RateRequestResponse>(`/rate`, body, config);
}

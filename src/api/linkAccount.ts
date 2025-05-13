import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { decodeToken } from 'helpers/decodeToken';
import { RateRequestResponse } from 'types/rate';
import { LinkAccountRequestBody } from '../types/linkAccount';

interface LinkAccountProps {
  url: string;
  nativeAuthToken: string;
  body: LinkAccountRequestBody;
}

export async function linkAccount({
  url,
  nativeAuthToken,
  body
}: LinkAccountProps): Promise<AxiosResponse> {
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

  return await axios.post<RateRequestResponse>(
    `/user/linkAccount`,
    body,
    config
  );
}

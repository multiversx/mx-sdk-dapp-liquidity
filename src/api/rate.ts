import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { decodeToken } from 'helpers/decodeToken';

interface RateRequestBody {
  tokenIn: string;
  amountIn: string;
  fromChain: string;
  tokenOut: string;
  toChain: string;
}

interface RateRequestResponse {
  fee: string;
  amountOut: string;
}

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

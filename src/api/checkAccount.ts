import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CheckAccountDto } from '../dto/CheckAccount.dto';

export async function checkAccount({
  url,
  walletAddress,
  chainId,
  nativeAuthToken
}: {
  url: string;
  walletAddress: string;
  chainId: string;
  nativeAuthToken: string;
}): Promise<AxiosResponse<CheckAccountDto>> {
  const config: AxiosRequestConfig = {
    baseURL: url,
    headers: {
      Authorization: `Bearer ${nativeAuthToken}`
    }
  };

  return await axios.get<CheckAccountDto>(
    `/user/checkAccount?walletAddress=${walletAddress}&chainId=${chainId}`,
    config
  );
}

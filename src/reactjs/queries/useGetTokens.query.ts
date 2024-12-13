import { useAppKitAccount } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getTokens } from '../../api/getTokens';
import { API_URL } from '../constants/general';
import { useGetChainId } from '../hooks/useGetChainId';

export const useGetTokensQuery = () => {
  const { address } = useAppKitAccount();
  const chainId = useGetChainId();

  const queryFn = async () => {
    const { data } = await getTokens({
      url: API_URL,
      chainId: Number(chainId)
    });
    return data;
  };

  const retry = (_failureCount: number, error: AxiosError) => {
    return error.response?.status === 404;
  };

  return useQuery({
    queryKey: ['tokens'],
    queryFn,
    retry,
    enabled: Boolean(address),
    refetchOnWindowFocus: false,
    gcTime: 0
  });
};

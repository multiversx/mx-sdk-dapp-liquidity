import { useAppKitAccount } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getTokensBalances } from '../../api/getTokensBalances';
import { API_URL } from '../constants/general';
import { useGetChainId } from '../hooks/useGetChainId.ts';

export const useGetTokensBalancesQuery = () => {
  const { address } = useAppKitAccount();
  const chainId = useGetChainId();

  const queryFn = async () => {
    try {
      if (!address) {
        throw new Error('User address is required');
      }

      if (!chainId) {
        throw new Error('Chain ID is required');
      }

      const { data } = await getTokensBalances({
        url: API_URL,
        userAddress: address,
        chainId: chainId.toString()
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const retry = (_failureCount: number, error: AxiosError) => {
    return error.response?.status === 404;
  };

  return useQuery({
    queryKey: ['tokens-balances', address],
    queryFn,
    retry,
    enabled: Boolean(address),
    refetchOnWindowFocus: false,
    gcTime: 0
  });
};

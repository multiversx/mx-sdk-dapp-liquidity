import { useAppKitAccount } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getTokensBalances } from '../../api/getTokensBalances';
import { API_URL } from '../constants/general';

export const useGetTokensBalancesQuery = () => {
  const { address } = useAppKitAccount();

  const queryFn = async () => {
    try {
      if (!address) {
        return [];
      }
      const { data } = await getTokensBalances({
        url: API_URL,
        userAddress: address
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

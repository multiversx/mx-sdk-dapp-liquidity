import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getTransactions } from '../../api/getTransactions';
import { getApiURL } from '../../helpers/getApiURL';
import { getQueryClient } from '../context/queryClient';

export const useGetHistoryQuery = ({ address }: { address?: string }) => {
  const queryFn = async () => {
    if (!address) {
      throw new Error('User is not connected');
    }

    try {
      const { data } = await getTransactions({
        url: getApiURL(),
        userWalletAddress: address
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
    queryKey: ['user-history', address],
    queryFn,
    retry,
    enabled: Boolean(address),
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: 10000,
    gcTime: 0
  });
};

export const invalidateHistoryQuery = () => {
  const queryClient = getQueryClient();
  queryClient.invalidateQueries({
    queryKey: ['user-history']
  });
};

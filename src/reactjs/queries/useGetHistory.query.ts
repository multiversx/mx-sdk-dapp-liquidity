import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getTransactions } from '../../api/getTransactions';
import { getApiURL } from '../../helpers/getApiURL';
import { getQueryClient } from '../contexts/queryClient.ts';
import { useAccount } from '../hooks/useAccount';

export const useGetHistoryQuery = () => {
  const { address } = useAccount();

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
    // TODO check if the refetch is still needed after API ccache is fjxed or the refetch interval should be increased
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

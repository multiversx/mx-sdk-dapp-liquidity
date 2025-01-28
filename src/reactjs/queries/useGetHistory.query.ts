import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getTransactions } from '../../api/getTransactions';
import { getApiURL } from '../../helpers/getApiURL';
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
    gcTime: 0
  });
};

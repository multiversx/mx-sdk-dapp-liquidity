import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ProviderType } from 'types/providerType';
import { getTransactions } from '../../api/getTransactions';
import { getApiURL } from '../../helpers/getApiURL';
import { getQueryClient } from '../context/queryClient';
import { useWeb3App } from '../context/useWeb3App';

type HistoryQueryType = {
  address?: string;
  sender?: string;
  provider?: ProviderType;
  status?: string;
  tokenIn?: string;
  tokenOut?: string;
};

export const useGetHistoryQuery = ({
  address,
  sender,
  provider,
  status,
  tokenIn,
  tokenOut
}: HistoryQueryType = {}) => {
  const { nativeAuthToken } = useWeb3App();

  const queryFn = async () => {
    if (!address) {
      throw new Error('User is not connected');
    }

    try {
      const { data } = await getTransactions({
        url: getApiURL(),
        address,
        sender,
        provider,
        status,
        tokenIn,
        tokenOut,
        nativeAuthToken
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
    queryKey: [
      'user-history',
      address,
      sender,
      provider,
      status,
      tokenIn,
      tokenOut,
      nativeAuthToken
    ],
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

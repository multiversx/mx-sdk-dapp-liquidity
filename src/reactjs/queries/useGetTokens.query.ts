import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getTokens } from '../../api/getTokens';
import { getApiURL } from '../../helpers/getApiURL';
import { useGetChainId } from '../hooks/useGetChainId';

export const useGetTokensQuery = () => {
  const chainId = useGetChainId();

  const queryFn = async () => {
    try {
      const { data } = await getTokens({
        url: getApiURL(),
        chainId: Number(chainId)
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
    queryKey: ['tokens', chainId],
    queryFn,
    retry,
    refetchOnWindowFocus: false,
    gcTime: 0
  });
};

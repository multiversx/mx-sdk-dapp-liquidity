import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getTokens } from '../../../api';
import { getApiURL } from '../../../helpers';

export const useGetTokensQuery = ({ chainId }: { chainId: string }) => {
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
    gcTime: 5 * 60 * 1000,
    staleTime: 0
  });
};

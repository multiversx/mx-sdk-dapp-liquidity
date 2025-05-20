import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getTokens } from '../../api/getTokens';
import { getApiURL } from '../../helpers/getApiURL';
import { useWeb3App } from '../context/useWeb3App';

export const useGetAllTokensQuery = () => {
  const { nativeAuthToken, bridgeOnly } = useWeb3App();

  const queryFn = async () => {
    try {
      const { data } = await getTokens({
        url: getApiURL(),
        nativeAuthToken,
        bridgeOnly: Boolean(bridgeOnly)
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
    queryKey: ['all-tokens', nativeAuthToken],
    queryFn,
    retry,
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
    staleTime: 0
  });
};

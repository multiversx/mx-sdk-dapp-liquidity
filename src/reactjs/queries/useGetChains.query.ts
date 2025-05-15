import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useWeb3App } from 'reactjs/context/useWeb3App';
import { getChains } from '../../api/getChains';
import { getApiURL } from '../../helpers/getApiURL';

export const useGetChainsQuery = () => {
  const { nativeAuthToken } = useWeb3App();

  const queryFn = async () => {
    try {
      const { data } = await getChains({
        url: getApiURL(),
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
    queryKey: ['chains', nativeAuthToken],
    queryFn,
    retry,
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
    staleTime: 0
  });
};

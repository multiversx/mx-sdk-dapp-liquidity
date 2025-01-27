import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getChains } from '../../api/getChains';
import { getApiURL } from '../../helpers/getApiURL';

export const useGetChainsQuery = () => {
  const queryFn = async () => {
    try {
      const { data } = await getChains({
        url: getApiURL()
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
    queryKey: ['chains'],
    queryFn,
    retry,
    refetchOnWindowFocus: false,
    gcTime: 0
  });
};

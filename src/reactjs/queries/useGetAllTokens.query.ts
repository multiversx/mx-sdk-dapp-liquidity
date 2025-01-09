import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getTokens } from '../../api/getTokens';
import { getApiURL } from '../../helpers/getApiURL';

export const useGetAllTokensQuery = () => {
  const queryFn = async () => {
    try {
      const { data } = await getTokens({
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
    queryKey: ['all-tokens'],
    queryFn,
    retry,
    refetchOnWindowFocus: false,
    gcTime: 0
  });
};

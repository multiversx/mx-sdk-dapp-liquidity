import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getChains } from '../../api/getChains.ts';
import { API_URL } from '../constants/general';

export const useGetChainsQuery = () => {
  const queryFn = async () => {
    try {
      const { data } = await getChains({
        url: API_URL
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

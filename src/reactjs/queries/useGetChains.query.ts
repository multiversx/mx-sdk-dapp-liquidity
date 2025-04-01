import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getChains } from '../../api/getChains';
import { NON_EVM_CHAIN_IDS_MAP } from '../../constants';
import { getApiURL } from '../../helpers/getApiURL';

export const useGetChainsQuery = () => {
  const queryFn = async () => {
    try {
      const { data } = await getChains({
        url: getApiURL()
      });
      return data.map((chain) => ({
        ...chain,
        chainId: NON_EVM_CHAIN_IDS_MAP[chain.chainId]
          ? NON_EVM_CHAIN_IDS_MAP[chain.chainId]
          : chain.chainId
      }));
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
    gcTime: 5 * 60 * 1000,
    staleTime: 0
  });
};

import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getTokens } from '../../api/getTokens';
import { NON_EVM_CHAIN_IDS_MAP } from '../../constants';
import { getApiURL } from '../../helpers/getApiURL';

export const useGetAllTokensQuery = () => {
  const queryFn = async () => {
    try {
      const { data } = await getTokens({
        url: getApiURL()
      });
      return data.map((token) => ({
        ...token,
        chainId: NON_EVM_CHAIN_IDS_MAP[token.chainId]
          ? NON_EVM_CHAIN_IDS_MAP[token.chainId]
          : token.chainId
      }));
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
    gcTime: 5 * 60 * 1000,
    staleTime: 0
  });
};

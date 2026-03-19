import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useMemo } from 'react';
import { useWeb3App } from 'reactjs/context/useWeb3App';
import { mockSuiChain } from 'reactjs/constants/mockSuiData';
import { getChains } from '../../api/getChains';
import { getApiURL } from '../../helpers/getApiURL';

export const useGetChainsQuery = () => {
  const { nativeAuthToken, bridgeOnly, externalChains } = useWeb3App();
  const hasSuiExternal = externalChains?.some((c) => c.chainType === 'sui');

  const queryFn = async () => {
    try {
      const { data } = await getChains({
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

  const query = useQuery({
    queryKey: ['chains', nativeAuthToken],
    queryFn,
    retry,
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
    staleTime: 0
  });

  // Inject mock Sui chain when Sui external chain is configured
  const data = useMemo(() => {
    if (!query.data) return query.data;
    if (!hasSuiExternal) return query.data;

    const hasSuiFromBackend = query.data.some(
      (c) => c.chainId === mockSuiChain.chainId
    );
    if (hasSuiFromBackend) return query.data;

    return [...query.data, mockSuiChain];
  }, [query.data, hasSuiExternal]);

  return { ...query, data };
};

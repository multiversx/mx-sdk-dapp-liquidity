import { useAppKitAccount } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useBalances } from '../hooks/useBalances.ts';
import { useGetChainId } from '../hooks/useGetChainId';

export const useGetTokensBalancesQuery = ({
  tokenIdentifiers
}: {
  tokenIdentifiers: string[];
}) => {
  const { address } = useAppKitAccount();
  const chainId = useGetChainId();
  const { fetchBalances } = useBalances();

  const queryFn = async () => {
    try {
      if (!address) {
        throw new Error('User address is required');
      }

      if (!chainId) {
        throw new Error('Chain ID is required');
      }

      const balances = await fetchBalances({
        address: address as `0x${string}`,
        chainId: chainId.toString(),
        tokenIdentifiers
      });

      console.log({ balances });

      return balances;
    } catch (error) {
      throw error;
    }
  };

  const retry = (_failureCount: number, error: AxiosError) => {
    return error.response?.status === 404;
  };

  return useQuery({
    queryKey: ['tokens-balances', address],
    queryFn,
    retry,
    enabled: Boolean(address),
    refetchOnWindowFocus: false,
    gcTime: 0
  });
};

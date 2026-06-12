import { useAppKitAccount } from '@reown/appkit/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useCallback, useMemo } from 'react';
import { TokenType } from '../../types';
import { useBalances } from '../hooks';

export const useGetNonMvxTokensBalancesQuery = ({
  tokens,
  chainId
}: {
  tokens: TokenType[];
  chainId?: string;
}) => {
  const { address } = useAppKitAccount();
  const { getBalances } = useBalances();
  const identifiers = useMemo(
    () => tokens.map((token) => token.address),
    [tokens]
  );

  const queryFn = async () => {
    try {
      if (!address) {
        throw new Error('User address is required');
      }

      if (!chainId) {
        throw new Error('Chain ID is required');
      }

      const assets = await getBalances({
        tokens,
        chainId
      });

      return assets.map((asset) => {
        const foundToken = tokens.find(
          (token) => token.address.toLowerCase() === asset.tokenId.toLowerCase()
        );

        if (!foundToken) {
          throw new Error('Token not found');
        }

        return {
          ...foundToken,
          balance: asset.balance.toString()
        };
      });
    } catch (error) {
      throw error;
    }
  };

  const retry = (_failureCount: number, error: AxiosError) => {
    return error.response?.status === 404;
  };

  return useQuery({
    queryKey: ['non-mvx-tokens-balances', address, chainId],
    queryFn,
    retry,
    enabled: Boolean(address) && Boolean(chainId) && identifiers.length > 0,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: (query) =>
      query.state.status === 'error' ? false : 20000,
    refetchOnReconnect: 'always',
    gcTime: 60 * 1000
  });
};

export function useInvalidateEvmTokensBalances() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['non-mvx-tokens-balances']
    });
  }, [queryClient]);
}

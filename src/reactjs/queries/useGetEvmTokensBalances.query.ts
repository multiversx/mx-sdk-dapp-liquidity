import { useAppKitAccount } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useMemo } from 'react';
import { TokenType } from '../../types/token';
import { getQueryClient } from '../contexts/queryClient';
import { useBalances } from '../hooks/useBalances';

export const useGetEvmTokensBalancesQuery = ({
  tokens,
  chainId
}: {
  tokens: TokenType[];
  chainId?: string;
}) => {
  const { address } = useAppKitAccount();
  const { fetchBalances } = useBalances();

  const tokenIdentifiers = useMemo(() => {
    return tokens
      .filter((token) => token.chainId.toString() === chainId?.toString())
      .map(({ address: tokenId }) => tokenId);
  }, [tokens, chainId]);

  const queryFn = async () => {
    try {
      if (!address) {
        throw new Error('User address is required');
      }

      if (!chainId) {
        throw new Error('Chain ID is required');
      }

      const assets = await fetchBalances({
        address: address as `0x${string}`,
        chainId: chainId.toString(),
        tokenIdentifiers
      });

      return assets.map((asset) => {
        const foundToken = tokens.find(
          (token) => token.address === asset.tokenId
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
    queryKey: [
      'evm-tokens-balances',
      address,
      chainId,
      tokenIdentifiers.sort()
    ],
    queryFn,
    retry,
    enabled: Boolean(address) && Boolean(chainId),
    refetchOnWindowFocus: false,
    gcTime: 0
  });
};

export function invalidateEvmTokensBalances() {
  const queryKey = ['evm-tokens-balances'];
  const queryClient = getQueryClient();
  queryClient.invalidateQueries({
    queryKey
  });
}

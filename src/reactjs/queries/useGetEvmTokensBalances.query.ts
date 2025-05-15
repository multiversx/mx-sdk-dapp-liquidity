import { useAppKitAccount } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { TokenType } from '../../types';
import { getQueryClient } from '../context/queryClient';
import { useBalances } from '../hooks';

export const useGetEvmTokensBalancesQuery = ({
  tokens,
  chainId
}: {
  tokens: TokenType[];
  chainId?: string;
}) => {
  const { address } = useAppKitAccount();
  const { fetchBalances } = useBalances();

  const queryFn = async () => {
    try {
      if (!address) {
        throw new Error('User address is required');
      }

      if (!chainId) {
        throw new Error('Chain ID is required');
      }

      const assets = await fetchBalances({
        tokens
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
    queryKey: ['evm-tokens-balances', address, chainId],
    queryFn,
    retry,
    enabled: Boolean(address) && Boolean(chainId),
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: 20000,
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

import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosRequestConfig } from 'axios';
import { useCallback, useMemo } from 'react';
import { MvxTokenType, TokenType } from '../../types/token';
import { useWeb3App } from '../context/useWeb3App';

export const useGetMvxTokensBalancesQuery = ({
  tokens,
  mvxAddress,
  apiURL
}: {
  tokens: TokenType[];
  mvxAddress?: string;
  apiURL: string;
}) => {
  const { nativeAuthToken } = useWeb3App();

  const tokenIdentifiers = useMemo(() => {
    return tokens.map(({ address }) => address);
  }, [tokens]);
  const url = `${apiURL}/accounts/${mvxAddress}/tokens?identifiers=${tokenIdentifiers}`;

  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${nativeAuthToken}`
    },
    timeout: 3000
  };

  const queryFn = async () => {
    const { data } = await axios.get<MvxTokenType[]>(url, config);

    return data.map((asset) => {
      const foundToken = tokens.find(
        (token) =>
          token.address.toLowerCase() === asset.identifier.toLowerCase()
      );

      if (!foundToken) {
        throw new Error('Token not found');
      }

      return {
        ...foundToken,
        balance: asset.balance?.toString() ?? '0',
        address: asset.identifier,
        symbol: asset.ticker ?? foundToken.symbol
      };
    });
  };

  return useQuery({
    queryKey: ['mvx-tokens-balances', mvxAddress, tokenIdentifiers.sort()],
    queryFn,
    retry: false,
    enabled: Boolean(mvxAddress) && tokenIdentifiers.length > 0,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: (query) =>
      query.state.status === 'error' ? false : 20000,
    refetchOnReconnect: 'always',
    gcTime: 60 * 1000
  });
};

export function useInvalidateMvxTokensBalancesQuery() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['mvx-tokens-balances']
    });
  }, [queryClient]);
}

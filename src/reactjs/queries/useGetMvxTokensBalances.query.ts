import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useMemo } from 'react';
import { MvxTokenType, TokenType } from '../../types/token';
import { getQueryClient } from '../context/queryClient';

export const useGetMvxTokensBalancesQuery = ({
  tokens,
  mvxAddress,
  apiURL,
  nativeAuthToken
}: {
  tokens: TokenType[];
  mvxAddress?: string;
  apiURL: string;
  nativeAuthToken?: string;
}) => {
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
        (token) => token.address === asset.identifier
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

  const retry = (_failureCount: number, error: AxiosError) => {
    return error.response?.status === 404;
  };

  return useQuery({
    queryKey: ['mvx-tokens-balances', mvxAddress, tokenIdentifiers.sort()],
    queryFn,
    retry,
    enabled: Boolean(mvxAddress) && tokenIdentifiers.length > 0,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: 20000,
    refetchOnReconnect: 'always',
    gcTime: 0
  });
};

export function invalidateMvxTokensBalancesQuery() {
  const queryKey = ['mvx-tokens-balances'];
  const queryClient = getQueryClient();
  queryClient.invalidateQueries({
    queryKey
  });
}

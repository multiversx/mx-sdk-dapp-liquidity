import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useMemo } from 'react';
import { MvxTokenType, TokenType } from '../../types/token';

export const useGetMvxTokensBalancesQuery = ({
  tokens,
  mvxAddress,
  apiURL
}: {
  tokens: TokenType[];
  mvxAddress?: string;
  apiURL: string;
}) => {
  const tokenIdentifiers = useMemo(() => {
    return tokens.map(({ address }) => address);
  }, [tokens]);
  const url = `${apiURL}/accounts/${mvxAddress}/tokens?identifiers=${tokenIdentifiers}`;

  const queryFn = async () => {
    const { data } = await axios.get<MvxTokenType[]>(url, {
      timeout: 3000
    });

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
    queryKey: ['mvx-tokens', 'account', tokenIdentifiers.sort()],
    queryFn,
    retry,
    enabled: Boolean(mvxAddress) && tokenIdentifiers.length > 0,
    refetchInterval: false,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false
  });
};

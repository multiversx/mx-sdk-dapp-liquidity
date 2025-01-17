import { useMemo } from 'react';
import { useFetchTokensBalances } from './useFetchTokensBalances';
import { useGetAllTokensQuery } from '../queries/useGetAllTokens.query';

export const useFetchTokens = () => {
  const {
    data: tokens,
    isLoading: isTokensLoading,
    isError: isTokensError,
    refetch: refetchTokens
  } = useGetAllTokensQuery();
  const {
    tokensBalances,
    isLoadingTokensBalances,
    isErrorTokensBalances,
    refetchTokensBalances
  } = useFetchTokensBalances();

  const tokensWithBalances = useMemo(
    () =>
      tokens?.map((token) => {
        const tokenBalance = tokensBalances?.find(
          ({ address }) => address === token.address
        );

        return {
          ...token,
          balance: tokenBalance?.balance ?? '0'
        };
      }),
    [tokens, tokensBalances]
  );

  return {
    tokens: useMemo(
      () => tokens?.filter((token) => token.chainId.toString() !== '44'),
      [tokens]
    ),
    isTokensLoading,
    isTokensError,
    refetchTokens,
    tokensBalances,
    isLoadingTokensBalances,
    isErrorTokensBalances,
    refetchTokensBalances,
    tokensWithBalances: useMemo(
      () =>
        tokensWithBalances?.filter(
          (token) => token.chainId.toString() !== '44'
        ),
      [tokensWithBalances]
    ),
    mvxTokens: useMemo(
      () => tokens?.filter((token) => token.chainId.toString() === '44'),
      [tokens]
    ),
    mvxTokensWithBalances: useMemo(
      () =>
        tokensWithBalances?.filter(
          (token) => token.chainId.toString() === '44'
        ),
      [tokensWithBalances]
    )
  };
};

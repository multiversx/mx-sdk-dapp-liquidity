import { useMemo } from 'react';
import { useFetchTokensBalances } from './useFetchTokensBalances';
import { mvxChainIds } from '../constants/general.ts';
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
      () =>
        tokens?.filter(
          (token) => !mvxChainIds.includes(Number(token.chainId.toString()))
        ),
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
          (token) => !mvxChainIds.includes(Number(token.chainId.toString()))
        ),
      [tokensWithBalances]
    ),
    mvxTokens: useMemo(
      () =>
        tokens?.filter((token) =>
          mvxChainIds.includes(Number(token.chainId.toString()))
        ),
      [tokens]
    ),
    mvxTokensWithBalances: useMemo(
      () =>
        tokensWithBalances?.filter((token) =>
          mvxChainIds.includes(Number(token.chainId.toString()))
        ),
      [tokensWithBalances]
    )
  };
};

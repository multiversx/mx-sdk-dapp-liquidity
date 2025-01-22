import { useMemo } from 'react';
import { mvxChainIds } from '../constants/general.ts';
import { useGetAllTokensQuery } from '../queries/useGetAllTokens.query';
import { useGetTokensBalancesQuery } from '../queries/useGetTokensBalances.query';

export const useFetchTokens = () => {
  const {
    data,
    isLoading: isTokensLoading,
    isError: isTokensError,
    refetch: refetchTokens
  } = useGetAllTokensQuery();

  const tokens = useMemo(
    () =>
      data?.filter(
        (token) => !mvxChainIds.includes(Number(token.chainId.toString()))
      ),
    [data]
  );

  const {
    data: tokensBalances,
    isLoading: isLoadingTokensBalances,
    isError: isErrorTokensBalances,
    refetch: refetchTokensBalances
  } = useGetTokensBalancesQuery({
    tokenIdentifiers: tokens?.map(({ address }) => address) ?? []
  });

  const tokensWithBalances = useMemo(
    () =>
      tokens?.map((token) => {
        const tokenBalance = tokensBalances?.find(
          ({ tokenId }) => tokenId === token.address
        );

        return {
          ...token,
          balance: tokenBalance?.balance.value.toString()
        };
      }),
    [tokens, tokensBalances]
  );

  console.log({
    tokensWithBalances
  });

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

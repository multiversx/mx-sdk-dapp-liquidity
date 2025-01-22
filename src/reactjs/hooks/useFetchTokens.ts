import { useMemo } from 'react';
import { mvxChainIds } from '../constants/general';
import { useGetAllTokensQuery } from '../queries/useGetAllTokens.query';
import { useGetEvmTokensBalancesQuery } from '../queries/useGetEvmTokensBalances.query';
import { useGetMvxTokensBalancesQuery } from '../queries/useGetMvxTokensBalances.query';

export const useFetchTokens = ({
  mvxAddress,
  mvxApiURL
}: {
  mvxAddress?: string;
  mvxApiURL: string;
}) => {
  const {
    data: tokens,
    isLoading: isTokensLoading,
    isError: isTokensError,
    refetch: refetchTokens
  } = useGetAllTokensQuery();

  const evmTokens = useMemo(
    () =>
      tokens?.filter(
        (token) => !mvxChainIds.includes(Number(token.chainId.toString()))
      ),
    [tokens]
  );

  const mvxTokens = useMemo(
    () =>
      tokens?.filter((token) =>
        mvxChainIds.includes(Number(token.chainId.toString()))
      ),
    [tokens]
  );

  const {
    data: evmTokensBalances,
    isLoading: isLoadingEvmTokensBalances,
    isError: isErrorEvmTokensBalances,
    refetch: refetchEvmTokensBalances
  } = useGetEvmTokensBalancesQuery({
    tokens: evmTokens ?? []
  });

  const {
    data: mvxTokensBalances,
    isLoading: isLoadingMvxTokensBalances,
    isError: isErrorMvxTokensBalances,
    refetch: refetchMvxTokensBalances
  } = useGetMvxTokensBalancesQuery({
    tokens: mvxTokens ?? [],
    mvxAddress,
    apiURL: mvxApiURL
  });

  return {
    isTokensLoading,
    isTokensError,
    refetchTokens,
    isLoadingEvmTokensBalances,
    isErrorEvmTokensBalances,
    refetchEvmTokensBalances,
    evmTokensBalances,
    isLoadingMvxTokensBalances,
    isErrorMvxTokensBalances,
    refetchMvxTokensBalances,
    mvxTokensBalances
  };
};

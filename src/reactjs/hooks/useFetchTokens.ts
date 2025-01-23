import { useMemo } from 'react';
import { mvxChainIds } from '../constants/general';
import { useGetEvmTokensBalancesQuery } from '../queries/useGetEvmTokensBalances.query';
import { useGetMvxTokensBalancesQuery } from '../queries/useGetMvxTokensBalances.query';
import { useGetTokensQuery } from '../queries/useGetTokens.query.ts';

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
  } = useGetTokensQuery();

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

  const mvxTokensWithBalances = useMemo(() => {
    return mvxTokens?.map((token) => {
      const foundToken = mvxTokensBalances?.find(
        (mvxToken) => mvxToken.address === token.address
      );

      if (!foundToken) {
        return {
          ...token,
          balance: '0'
        };
      }

      return {
        ...foundToken,
        balance: foundToken.balance.toString()
      };
    });
  }, [mvxTokens, mvxTokensBalances]);

  console.log({ evmTokensBalances, mvxTokens, mvxTokensBalances });

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
    mvxTokensWithBalances
  };
};

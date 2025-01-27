import { useMemo } from 'react';
import { useGetChainId } from './useGetChainId';
import { mvxChainIds } from '../constants/general';
import { useGetAllTokensQuery } from '../queries/useGetAllTokens.query';
import { useGetEvmTokensBalancesQuery } from '../queries/useGetEvmTokensBalances.query';
import { useGetMvxTokensBalancesQuery } from '../queries/useGetMvxTokensBalances.query';

export const useFetchTokens = ({
  mvxAddress,
  mvxApiURL,
  refetchTrigger
}: {
  mvxAddress?: string;
  mvxApiURL: string;
  refetchTrigger?: number;
}) => {
  const chainId = useGetChainId();

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
    isError: isErrorEvmTokensBalances
  } = useGetEvmTokensBalancesQuery({
    tokens: evmTokens ?? [],
    chainId: chainId.toString()
  });

  const {
    data: mvxTokensBalances,
    isLoading: isLoadingMvxTokensBalances,
    isError: isErrorMvxTokensBalances
  } = useGetMvxTokensBalancesQuery({
    tokens: mvxTokens ?? [],
    mvxAddress,
    apiURL: mvxApiURL,
    refetchTrigger: refetchTrigger ?? chainId
  });

  const evmTokensWithBalances = useMemo(() => {
    return evmTokensBalances?.filter(
      (x) => x.chainId.toString() === chainId?.toString()
    );
  }, [evmTokens, evmTokensBalances]);

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
    evmTokensWithBalances,
    isLoadingMvxTokensBalances,
    isErrorMvxTokensBalances,
    mvxTokensWithBalances
  };
};

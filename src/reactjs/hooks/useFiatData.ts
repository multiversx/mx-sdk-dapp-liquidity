import { useEffect, useMemo } from 'react';
import { MVX_CHAIN_IDS } from '../../constants';
import { useGetAllTokensQuery } from '../queries/useGetAllTokens.query';
import {
  invalidateMvxTokensBalancesQuery,
  useGetMvxTokensBalancesQuery
} from '../queries/useGetMvxTokensBalances.query';

export const useFiatData = ({
  mvxAddress,
  mvxApiURL,
  refetchTrigger
}: {
  mvxAddress?: string;
  mvxApiURL: string;
  refetchTrigger?: number;
}) => {
  const {
    data: tokens,
    isLoading: isTokensLoading,
    isError: isTokensError
  } = useGetAllTokensQuery();

  console.log({
    tokens
  });

  const mvxTokens = useMemo(
    () =>
      tokens?.filter((token) =>
        MVX_CHAIN_IDS.includes(Number(token.chainId.toString()))
      ),
    [tokens]
  );

  const currencies = useMemo(() => {
    return tokens?.filter((token) => !token.chainId);
  }, [tokens]);

  console.log({
    mvxTokens,
    currencies
  });

  const {
    data: mvxTokensBalances,
    isLoading: isLoadingMvxTokensBalances,
    isError: isErrorMvxTokensBalances
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

  useEffect(() => {
    if (mvxAddress) {
      invalidateMvxTokensBalancesQuery();
    }
  }, [refetchTrigger, mvxAddress]);

  return {
    isTokensLoading,
    isTokensError,
    isLoadingMvxTokensBalances,
    isErrorMvxTokensBalances,
    mvxTokensWithBalances,
    currencies,
    tokens
  };
};

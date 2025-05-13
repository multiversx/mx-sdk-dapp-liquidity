import { useEffect, useMemo } from 'react';
import { useAccount } from './useAccount';
import { useGetChainId } from './useGetChainId';
import { MVX_CHAIN_IDS } from '../../constants';
import { useGetAllTokensQuery } from '../queries/useGetAllTokens.query';
import {
  invalidateEvmTokensBalances,
  useGetEvmTokensBalancesQuery
} from '../queries/useGetEvmTokensBalances.query';
import {
  invalidateMvxTokensBalancesQuery,
  useGetMvxTokensBalancesQuery
} from '../queries/useGetMvxTokensBalances.query';

export const useFetchTokens = ({
  mvxAddress,
  mvxApiURL,
  refetchTrigger,
  nativeAuthToken
}: {
  mvxAddress?: string;
  mvxApiURL: string;
  refetchTrigger?: number;
  nativeAuthToken?: string;
}) => {
  const chainId = useGetChainId();
  const account = useAccount();

  const {
    data: tokens,
    isLoading: isTokensLoading,
    isError: isTokensError
  } = useGetAllTokensQuery();

  const evmTokens = useMemo(
    () =>
      tokens?.filter(
        (token) =>
          !MVX_CHAIN_IDS.includes(token.chainId.toString()) &&
          token.chainId.toLowerCase() !== 'fiat'
      ),
    [tokens]
  );

  const mvxTokens = useMemo(
    () =>
      tokens?.filter((token) =>
        MVX_CHAIN_IDS.includes(token.chainId.toString())
      ),
    [tokens]
  );

  const {
    data: evmTokensBalances,
    isLoading: isLoadingEvmTokensBalances,
    isError: isErrorEvmTokensBalances
  } = useGetEvmTokensBalancesQuery({
    tokens: evmTokens ?? [],
    chainId: chainId?.toString(),
    nativeAuthToken
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

  const evmTokensWithBalances = useMemo(() => {
    return evmTokens?.map((token) => {
      const foundToken = evmTokensBalances?.find(
        (evmToken) => evmToken.address === token.address
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
  }, [evmTokens, evmTokensBalances]);

  useEffect(() => {
    if (account.address) {
      invalidateEvmTokensBalances();
    }

    if (mvxAddress) {
      invalidateMvxTokensBalancesQuery();
    }
  }, [refetchTrigger, chainId, account.address, mvxAddress]);

  return {
    isTokensLoading,
    isTokensError,
    isLoadingEvmTokensBalances,
    isErrorEvmTokensBalances,
    evmTokensWithBalances,
    isLoadingMvxTokensBalances,
    isErrorMvxTokensBalances,
    mvxTokensWithBalances,
    tokens
  };
};

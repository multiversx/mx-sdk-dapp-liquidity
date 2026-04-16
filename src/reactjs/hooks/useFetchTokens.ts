import { useEffect, useMemo } from 'react';
import { useAccount } from './useAccount';
import { useBridgeApiChainId } from './useBridgeApiChainId';
import { MVX_CHAIN_IDS } from '../../constants';
import { useWeb3App } from '../context/useWeb3App.ts';
import { useGetAllTokensQuery } from '../queries/useGetAllTokens.query';
import {
  invalidateMvxTokensBalancesQuery,
  useGetMvxTokensBalancesQuery
} from '../queries/useGetMvxTokensBalances.query';
import {
  invalidateEvmTokensBalances,
  useGetNonMvxTokensBalancesQuery
} from '../queries/useGetNonMvxTokensBalances.query';

export const useFetchTokens = ({
  mvxAddress,
  mvxApiURL,
  refetchTrigger
}: {
  mvxAddress?: string;
  mvxApiURL: string;
  refetchTrigger?: number;
}) => {
  const bridgeApiChainId = useBridgeApiChainId();
  const account = useAccount();
  const { nativeAuthToken, bridgeOnly } = useWeb3App();

  const {
    data: tokens,
    isLoading: isTokensLoading,
    isError: isTokensError
  } = useGetAllTokensQuery({
    nativeAuthToken,
    bridgeOnly
  });

  const nonMvxTokens = useMemo(
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
    data: nonMvxTokensBalances,
    isLoading: isLoadingNonMvxTokensBalances,
    isError: isErrorNonMvxTokensBalances
  } = useGetNonMvxTokensBalancesQuery({
    tokens: nonMvxTokens ?? [],
    chainId: bridgeApiChainId
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
        (mvxToken) =>
          mvxToken.address.toLowerCase() === token.address.toLowerCase()
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

  const nonMvxTokensWithBalances = useMemo(() => {
    return nonMvxTokens?.map((token) => {
      const foundToken = nonMvxTokensBalances?.find(
        (nonMvxToken) =>
          nonMvxToken.address.toLowerCase() === token.address.toLowerCase() &&
          nonMvxToken.chainId.toLowerCase() === token.chainId.toLowerCase()
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
  }, [nonMvxTokens, nonMvxTokensBalances]);

  useEffect(() => {
    if (mvxAddress) {
      invalidateMvxTokensBalancesQuery();
    }
  }, [refetchTrigger, mvxAddress]);

  useEffect(() => {
    if (!account.address) {
      return;
    }

    invalidateEvmTokensBalances();
  }, [refetchTrigger, bridgeApiChainId, account.address]);

  return {
    isTokensLoading,
    isTokensError,
    isLoadingEvmTokensBalances: isLoadingNonMvxTokensBalances,
    isErrorEvmTokensBalances: isErrorNonMvxTokensBalances,
    evmTokensWithBalances: nonMvxTokensWithBalances,
    isLoadingMvxTokensBalances,
    isErrorMvxTokensBalances,
    mvxTokensWithBalances,
    tokens
  };
};

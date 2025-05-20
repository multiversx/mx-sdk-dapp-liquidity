import { useAppKitNetwork } from '@reown/appkit/react';
import { useEffect, useMemo } from 'react';
import { useAccount } from './useAccount';
import { MVX_CHAIN_IDS } from '../../constants';
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
  const { chainId } = useAppKitNetwork();
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
  } = useGetNonMvxTokensBalancesQuery({
    tokens: evmTokens ?? [],
    chainId: chainId?.toString()
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
        (evmToken) =>
          evmToken.address === token.address &&
          evmToken.chainId === token.chainId
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
    if (mvxAddress) {
      invalidateMvxTokensBalancesQuery();
    }
  }, [refetchTrigger, mvxAddress]);

  useEffect(() => {
    if (!account.address) {
      return;
    }

    invalidateEvmTokensBalances();
  }, [refetchTrigger, chainId, account.address]);

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

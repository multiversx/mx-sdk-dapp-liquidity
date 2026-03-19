import { useAppKitNetwork } from '@reown/appkit/react';
import { useEffect, useMemo } from 'react';
import { useAccount } from './useAccount';
import { MVX_CHAIN_IDS, SUI_CHAIN_IDS } from '../../constants';
import { mockSuiTokens, SUI_MOCK_CHAIN_ID } from '../constants/mockSuiData';
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
import {
  invalidateSuiTokensBalancesQuery,
  useGetSuiTokensBalancesQuery
} from '../queries/useGetSuiTokensBalances.query';

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
  const { nativeAuthToken, bridgeOnly, externalChains } = useWeb3App();

  const hasSuiExternal = externalChains?.some((c) => c.chainType === 'sui');

  const {
    data: backendTokens,
    isLoading: isTokensLoading,
    isError: isTokensError
  } = useGetAllTokensQuery({
    nativeAuthToken,
    bridgeOnly
  });

  // Inject mock Sui tokens when Sui external chain is configured
  const tokens = useMemo(() => {
    if (!backendTokens) return backendTokens;
    if (!hasSuiExternal) return backendTokens;

    // Only add if backend doesn't already have Sui tokens
    const hasSuiFromBackend = backendTokens.some(
      (t) => t.chainId === SUI_MOCK_CHAIN_ID
    );
    if (hasSuiFromBackend) return backendTokens;

    return [...backendTokens, ...mockSuiTokens];
  }, [backendTokens, hasSuiExternal]);

  const evmTokens = useMemo(
    () =>
      tokens?.filter(
        (token) =>
          !MVX_CHAIN_IDS.includes(token.chainId.toString()) &&
          !SUI_CHAIN_IDS.includes(token.chainId.toString()) &&
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

  const suiTokens = useMemo(
    () =>
      tokens?.filter((token) =>
        SUI_CHAIN_IDS.includes(token.chainId.toString())
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
    data: suiTokensBalances,
    isLoading: isLoadingSuiTokensBalances,
    isError: isErrorSuiTokensBalances
  } = useGetSuiTokensBalancesQuery({
    tokens: suiTokens ?? []
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

  const suiTokensWithBalances = useMemo(() => {
    return suiTokens?.map((token) => {
      const foundToken = suiTokensBalances?.find(
        (suiToken) => suiToken.address === token.address
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
  }, [suiTokens, suiTokensBalances]);

  // Merge EVM + Sui tokens under evmTokensWithBalances key to avoid downstream interface changes
  // TODO: rename to nonMvxTokensWithBalances when cleaning up
  const allNonMvxTokensWithBalances = useMemo(() => {
    return [
      ...(evmTokensWithBalances ?? []),
      ...(suiTokensWithBalances ?? [])
    ];
  }, [evmTokensWithBalances, suiTokensWithBalances]);

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
    invalidateSuiTokensBalancesQuery();
  }, [refetchTrigger, chainId, account.address]);

  return {
    isTokensLoading,
    isTokensError,
    isLoadingEvmTokensBalances: isLoadingEvmTokensBalances || isLoadingSuiTokensBalances,
    isErrorEvmTokensBalances: isErrorEvmTokensBalances || isErrorSuiTokensBalances,
    evmTokensWithBalances: allNonMvxTokensWithBalances,
    isLoadingMvxTokensBalances,
    isErrorMvxTokensBalances,
    mvxTokensWithBalances,
    tokens
  };
};

import { useEffect } from 'react';
import { useFetchTokens } from './useFetchTokens';
import { useGetChainId } from './useGetChainId';
import { useGetChainsQuery } from '../queries/useGetChains.query';

export const useFetchBridgeData = ({
  refetchTrigger,
  mvxAddress,
  mvxApiURL
}: {
  refetchTrigger?: number;
  mvxAddress?: string;
  mvxApiURL: string;
}) => {
  const chainId = useGetChainId();

  const {
    isTokensError,
    isTokensLoading,
    refetchTokens,
    evmTokensBalances,
    isLoadingEvmTokensBalances,
    isErrorMvxTokensBalances,
    refetchEvmTokensBalances,
    mvxTokensWithBalances,
    isLoadingMvxTokensBalances,
    isErrorEvmTokensBalances,
    refetchMvxTokensBalances
  } = useFetchTokens({
    mvxApiURL,
    mvxAddress
  });
  const {
    data: chains,
    isLoading: isChainsLoading,
    isError: isChainsError
  } = useGetChainsQuery();

  useEffect(() => {
    refetchTokens();
    refetchEvmTokensBalances();
    refetchMvxTokensBalances();
  }, [refetchTrigger, chainId, refetchTokens]);

  return {
    isTokensError,
    isTokensLoading,
    evmTokensBalances,
    isLoadingEvmTokensBalances,
    isErrorMvxTokensBalances,
    refetchEvmTokensBalances,
    mvxTokensWithBalances,
    isLoadingMvxTokensBalances,
    isErrorEvmTokensBalances,
    refetchMvxTokensBalances,
    chains,
    isChainsLoading,
    isChainsError
  };
};

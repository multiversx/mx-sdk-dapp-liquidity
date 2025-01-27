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
    evmTokensWithBalances,
    isLoadingEvmTokensBalances,
    isErrorMvxTokensBalances,
    mvxTokensWithBalances,
    isLoadingMvxTokensBalances,
    isErrorEvmTokensBalances
  } = useFetchTokens({
    mvxApiURL,
    mvxAddress,
    refetchTrigger
  });
  const {
    data: chains,
    isLoading: isChainsLoading,
    isError: isChainsError
  } = useGetChainsQuery();

  useEffect(() => {
    refetchTokens();
  }, [refetchTrigger, chainId, refetchTokens]);

  return {
    isTokensError,
    isTokensLoading,
    evmTokensWithBalances,
    isLoadingEvmTokensBalances,
    isErrorMvxTokensBalances,
    mvxTokensWithBalances,
    isLoadingMvxTokensBalances,
    isErrorEvmTokensBalances,
    chains,
    isChainsLoading,
    isChainsError
  };
};

import { useEffect } from 'react';
import { useFetchTokens } from './useFetchTokens';
import { useGetChainId } from './useGetChainId';
import { useGetChainsQuery } from '../queries/useGetChains.query';

export const useFetchBridgeData = ({
  refetchTrigger
}: {
  refetchTrigger?: boolean;
}) => {
  const chainId = useGetChainId();

  const {
    tokens,
    isTokensError,
    isTokensLoading,
    refetchTokens,
    tokensBalances,
    tokensWithBalances,
    mvxTokens,
    mvxTokensWithBalances,
    isLoadingTokensBalances,
    isErrorTokensBalances,
    refetchTokensBalances
  } = useFetchTokens();
  const {
    data: chains,
    isLoading: isChainsLoading,
    isError: isChainsError
  } = useGetChainsQuery();

  useEffect(() => {
    refetchTokens();
    refetchTokensBalances();
  }, [refetchTrigger, chainId, refetchTokens, refetchTokensBalances]);

  return {
    tokens,
    isTokensError,
    isTokensLoading,
    tokensBalances,
    mvxTokens,
    mvxTokensWithBalances,
    isLoadingTokensBalances,
    isErrorTokensBalances,
    tokensWithBalances,
    chains,
    isChainsLoading,
    isChainsError
  };
};

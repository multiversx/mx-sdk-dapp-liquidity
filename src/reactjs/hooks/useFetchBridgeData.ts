import { useFetchTokens } from './useFetchTokens';
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
  const {
    isTokensError,
    isTokensLoading,
    evmTokensWithBalances,
    isLoadingEvmTokensBalances,
    isErrorMvxTokensBalances,
    mvxTokensWithBalances,
    isLoadingMvxTokensBalances,
    isErrorEvmTokensBalances,
    tokens
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
    isChainsError,
    tokens
  };
};

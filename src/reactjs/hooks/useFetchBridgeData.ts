import { useFetchTokens } from './useFetchTokens';
import { useGetChainsQuery } from '../queries/useGetChains.query';

export const useFetchBridgeData = ({
  refetchTrigger,
  mvxAddress,
  mvxApiURL,
  nativeAuthToken
}: {
  refetchTrigger?: number;
  mvxAddress?: string;
  mvxApiURL: string;
  nativeAuthToken?: string;
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
    refetchTrigger,
    nativeAuthToken
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

import { useGetTokensBalancesQuery } from '../queries/useGetTokensBalances.query';

export const useFetchTokensBalances = () => {
  const {
    data: tokensBalances,
    isLoading: isLoadingTokensBalances,
    isError: isErrorTokensBalances,
    refetch: refetchTokensBalances
  } = useGetTokensBalancesQuery();

  return {
    tokensBalances,
    isLoadingTokensBalances,
    isErrorTokensBalances,
    refetchTokensBalances
  };
};

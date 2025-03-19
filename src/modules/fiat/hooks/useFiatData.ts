import { useMemo } from 'react';
import { useGetAllTokensQuery } from 'reactjs';
import { MVX_CHAIN_IDS } from '../../../constants';

export const useFiatData = () => {
  const {
    data: tokens,
    isLoading: isTokensLoading,
    isError: isTokensError
  } = useGetAllTokensQuery();

  const mvxTokens = useMemo(
    () =>
      tokens?.filter((token) =>
        MVX_CHAIN_IDS.includes(Number(token.chainId.toString()))
      ),
    [tokens]
  );

  const currencies = useMemo(() => {
    return tokens?.filter((token) => !token.chainId);
  }, [tokens]);

  return {
    isTokensLoading,
    isTokensError,
    mvxTokens,
    currencies,
    tokens
  };
};

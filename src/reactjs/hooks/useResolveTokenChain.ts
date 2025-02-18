import { useMemo } from 'react';
import { TokenDTO } from '../../dto/Token.dto';
import { useGetChainsQuery } from '../queries/useGetChains.query';
import { chainIdentifier } from '../types/chains';

export const useResolveTokenChain = ({ token }: { token?: TokenDTO }) => {
  const { data: chains, isLoading } = useGetChainsQuery();

  const tokenChain = useMemo(() => {
    return chains?.find(
      (chain) => chain.chainId.toString() === token?.chainId.toString()
    );
  }, [chains, token]);

  return {
    tokenChain,
    isLoading,
    chainIcon: tokenChain
      ? tokenChain.svgUrl ?? chainIdentifier[tokenChain.chainName]
      : null
  };
};

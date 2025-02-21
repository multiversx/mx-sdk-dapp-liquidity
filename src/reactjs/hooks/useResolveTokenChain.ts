import { useMemo } from 'react';
import { TokenDTO } from '../../dto/Token.dto';
import { chainIdentifier, ChainNameType } from '../constants';
import { useGetChainsQuery } from '../queries/useGetChains.query';

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
      ? tokenChain.svgUrl ??
        chainIdentifier[tokenChain.chainName as ChainNameType]
      : null
  };
};

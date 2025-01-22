import { getBalance } from '@wagmi/core';
import { useCallback } from 'react';
import { useWeb3App } from './useWeb3App';

export const useBalances = () => {
  const { config } = useWeb3App();

  const fetchBalances = useCallback(
    async ({
      address,
      chainId,
      tokenIdentifiers
    }: {
      address: `0x${string}`;
      chainId: string;
      tokenIdentifiers: string[];
    }) => {
      return await Promise.all(
        tokenIdentifiers.map(async (tokenIdentifier) => {
          const balance = await getBalance(config, {
            address: address as `0x${string}`,
            chainId: Number(chainId),
            token: tokenIdentifier as `0x${string}`
          });

          return {
            tokenId: tokenIdentifier,
            balance
          };
        })
      );
    },
    [config]
  );

  return {
    fetchBalances
  };
};

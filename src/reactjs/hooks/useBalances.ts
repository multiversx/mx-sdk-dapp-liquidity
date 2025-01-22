import { getBalance } from '@wagmi/core';
import { useCallback } from 'react';
import { useAccount } from './useAccount';
import { useGetChainId } from './useGetChainId';
import { useWeb3App } from './useWeb3App';

export const useBalances = () => {
  const { config } = useWeb3App();
  const { address } = useAccount();
  const chainId = useGetChainId();

  const fetchBalances = useCallback(
    async ({ tokenIdentifiers }: { tokenIdentifiers: string[] }) => {
      if (!address) {
        throw new Error('Address not found');
      }

      const balances = await Promise.all(
        tokenIdentifiers.map(async (tokenIdentifier) => {
          const balance = await getBalance(config, {
            address: address as `0x${string}`,
            chainId: Number(chainId),
            token: tokenIdentifier as `0x${string}`
          });

          return {
            token: tokenIdentifier,
            balance
          };
        })
      );

      return balances;
    },
    [config, address, chainId]
  );

  return {
    fetchBalances
  };
};

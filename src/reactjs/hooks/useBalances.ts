import { getBalance } from '@wagmi/core';
import { useCallback } from 'react';
import { useWeb3App } from '../context/useWeb3App';

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
          try {
            const balance = await getBalance(config, {
              address: address as `0x${string}`,
              chainId: Number(chainId),
              // TODO: fix this using the API support
              // omit passing the token for fetching the native currency balance
              token:
                tokenIdentifier.length > 10
                  ? (tokenIdentifier as `0x${string}`)
                  : undefined
            });

            return {
              tokenId: tokenIdentifier,
              balance: balance.value.toString()
            };
          } catch (error) {
            console.warn(
              'Error fetching balance for: ',
              tokenIdentifier,
              error
            );
            return {
              tokenId: tokenIdentifier,
              balance: '0'
            };
          }
        })
      );
    },
    [config]
  );

  return {
    fetchBalances
  };
};

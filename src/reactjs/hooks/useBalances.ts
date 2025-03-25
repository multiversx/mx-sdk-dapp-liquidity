import { getBalance } from '@wagmi/core';
import { useCallback } from 'react';
import { TokenType } from '../../types';
import { useWeb3App } from '../context/useWeb3App';

export const useBalances = () => {
  const { config } = useWeb3App();

  const fetchBalances = useCallback(
    async ({
      address,
      chainId,
      tokens
    }: {
      address: `0x${string}`;
      chainId: string;
      tokens: TokenType[];
    }) => {
      return await Promise.all(
        tokens.map(async (token) => {
          try {
            const balance = await getBalance(config, {
              address: address as `0x${string}`,
              chainId: Number(chainId),
              // omit passing the token for fetching the native currency balance
              token: token.isNative
                ? undefined
                : (token.address as `0x${string}`)
            });

            return {
              tokenId: token.address,
              balance: balance.value.toString()
            };
          } catch (error) {
            console.warn('Error fetching balance for: ', token.address, error);
            return {
              tokenId: token.address,
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

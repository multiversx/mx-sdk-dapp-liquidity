import { useAppKitAccount } from '@reown/appkit/react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getBalance, GetBalanceReturnType } from '@wagmi/core';
import { useCallback, useMemo } from 'react';
import { useGetChainId } from './useGetChainId.ts';
import { TokenType } from '../../types';
import { useWeb3App } from '../context/useWeb3App';
import { useGetChainsQuery } from '../queries';

export const useBalances = () => {
  const { config } = useWeb3App();
  const { address, isConnected } = useAppKitAccount();
  const chainId = useGetChainId() as string;
  const { data: chains } = useGetChainsQuery();

  const activeChain = useMemo(() => {
    return chains?.find(
      (chain) => chain.chainId.toString() === chainId?.toString()
    );
  }, [chainId, chains]);

  const getSolBalance = async (rpcUrl: string, addr: string) => {
    const connection = new Connection(rpcUrl);
    const publicKey = new PublicKey(addr);
    const balance = await connection.getBalance(publicKey);
    return {
      value: BigInt(balance.toString()),
      decimals: 9,
      formatted: (balance / 1e9).toString(),
      symbol: 'SOL'
    };
  };

  const getBtcBalance = async (rpcUrl: string) => {
    const response = await fetch(rpcUrl);
    const utxos = await response.json();
    const balance = utxos.reduce(
      (sum: number, utxo: { value: number }) => sum + utxo.value,
      0
    );
    return {
      value: BigInt(balance.toString()),
      decimals: 8,
      formatted: (balance / 1e8).toString(),
      symbol: 'BTC'
    };
  };

  const fetchBalances = useCallback(
    async ({ tokens }: { chainId: string; tokens: TokenType[] }) => {
      return await Promise.all(
        tokens.map(async (token) => {
          if (!isConnected || !address || !chainId) {
            return {
              tokenId: token.address,
              balance: '0'
            };
          }

          try {
            let balance: GetBalanceReturnType;

            switch (activeChain?.chainType) {
              case 'evm':
                balance = await getBalance(config, {
                  address: address as `0x${string}`,
                  chainId: Number(chainId),
                  // omit passing the token for fetching the native currency balance
                  token: token.isNative
                    ? undefined
                    : (token.address as `0x${string}`)
                });
                break;
              case 'sol':
                if (!activeChain?.rpc) {
                  throw new Error(`RPC URL not found for chain ID: ${chainId}`);
                }
                balance = await getSolBalance(activeChain?.rpc, address);
                break;
              case 'btc':
                if (!activeChain?.rpc) {
                  throw new Error(`RPC URL not found for chain ID: ${chainId}`);
                }
                balance = await getBtcBalance(activeChain?.rpc);
                break;
              case 'mvx':
              default:
                throw new Error(
                  `Unsupported chain type: ${activeChain?.chainType}`
                );
            }

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
    [config, isConnected, address, chainId, activeChain?.rpc]
  );

  return {
    fetchBalances
  };
};

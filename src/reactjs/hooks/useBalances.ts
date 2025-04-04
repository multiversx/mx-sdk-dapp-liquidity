import { useAppKitAccount } from '@reown/appkit/react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getBalance } from '@wagmi/core';
import axios from 'axios';
import { useCallback, useMemo } from 'react';
import { Utxo } from 'types/utxo.ts';
import { useGetChainId } from './useGetChainId.ts';
import { TokenType } from '../../types';
import { ChainType } from '../../types/chainType.ts';
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
    return BigInt(balance.toString());
  };

  const getBtcBalance = async (rpcUrl: string) => {
    const url = `${rpcUrl}utxo/${address}`;
    try {
      const { data } = await axios.get<Utxo[]>(url);
      const utxos = data || [];

      if (!utxos || utxos.length === 0) {
        throw new Error(`No UTXOs found for address ${address}`);
      }

      let totalInput = 0;
      const chosenUtxos = [];
      for (const utxo of utxos) {
        chosenUtxos.push(utxo);
        totalInput += Number(utxo.value);
      }

      return BigInt(totalInput);
    } catch (error) {
      throw new Error(`Error fetching UTXOs from Trezor: ${error}`);
    }
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
            let balance: bigint = BigInt(0);

            switch (activeChain?.chainType) {
              case ChainType.evm:
                balance = (
                  await getBalance(config, {
                    address: address as `0x${string}`,
                    chainId: Number(chainId),
                    // omit passing the token for fetching the native currency balance
                    token: token.isNative
                      ? undefined
                      : (token.address as `0x${string}`)
                  })
                ).value;
                break;
              case ChainType.sol:
                if (!activeChain?.rpc) {
                  throw new Error(`RPC URL not found for chain ID: ${chainId}`);
                }
                balance = await getSolBalance(activeChain?.rpc, address);
                break;
              case ChainType.btc:
                if (!activeChain?.rpc) {
                  throw new Error(`RPC URL not found for chain ID: ${chainId}`);
                }
                balance = await getBtcBalance(activeChain?.rpc);
                break;
              case ChainType.mvx:
                break;
              default:
                throw new Error(
                  `Unsupported chain type: ${activeChain?.chainType}`
                );
            }

            return {
              tokenId: token.address,
              balance: balance?.toString()
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

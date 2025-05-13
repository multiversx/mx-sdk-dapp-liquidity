import { useAppKitAccount } from '@reown/appkit/react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getBalance } from '@wagmi/core';
import axios from 'axios';
import { useCallback, useMemo } from 'react';
import { getApiURL } from 'helpers/getApiURL.ts';
import { useGetChainId } from './useGetChainId';
import { ChainDTO } from '../../dto';
import { TokenType } from '../../types';
import { ChainType } from '../../types/chainType';
import { useWeb3App } from '../context/useWeb3App';
import { useGetChainsQuery } from '../queries';

export const useBalances = ({
  nativeAuthToken
}: {
  nativeAuthToken?: string;
}) => {
  const { config } = useWeb3App();
  const { address, isConnected } = useAppKitAccount();
  const chainId = useGetChainId() as string;
  const { data: chains } = useGetChainsQuery();

  const activeChain = useMemo(() => {
    return chains?.find(
      (chain) => chain.chainId.toString() === chainId?.toString()
    );
  }, [chainId, chains]);

  const chainsMap = useMemo(() => {
    return (chains ?? []).reduce(
      (acc, chain) => {
        acc[chain.chainId.toString()] = chain;
        return acc;
      },
      {} as Record<string, ChainDTO>
    );
  }, [chains]);

  const getSolBalance = async (rpcUrl: string, addr: string) => {
    const connection = new Connection(rpcUrl);
    const publicKey = new PublicKey(addr);
    const balance = await connection.getBalance(publicKey);
    return BigInt(balance.toString());
  };

  const getBtcBalance = async () => {
    const url = `${getApiURL()}/user/balance/${address}?chainId=${activeChain?.chainId}`;

    try {
      const { data } = await axios.get<{
        address: string;
        chainId: string;
        balance: string;
      }>(url, {
        baseURL: url,
        headers: {
          Authorization: `Bearer ${nativeAuthToken}`
        }
      });
      return BigInt(data.balance);
    } catch (error) {
      throw new Error(`Error fetching BTC balance: ${error}`);
    }
  };

  const fetchBalances = useCallback(
    async ({ tokens }: { tokens: TokenType[] }) => {
      return await Promise.all(
        tokens.map(async (token) => {
          if (!isConnected || !address || !token.chainId) {
            return {
              tokenId: token.address,
              balance: '0'
            };
          }

          const chainType = chainsMap[token.chainId]?.chainType;

          try {
            let balance: bigint = BigInt(0);

            switch (chainType) {
              case ChainType.evm:
                if (activeChain?.chainType !== ChainType.evm) {
                  break;
                }
                balance = (
                  await getBalance(config, {
                    address: address as `0x${string}`,
                    chainId: Number(token.chainId),
                    // omit passing the token for fetching the native currency balance
                    token: token.isNative
                      ? undefined
                      : (token.address as `0x${string}`)
                  })
                ).value;
                break;
              case ChainType.sol:
                if (activeChain?.chainType !== ChainType.sol) {
                  break;
                }
                if (!activeChain?.rpc) {
                  throw new Error(
                    `RPC URL not found for chain ID: ${token.chainId}`
                  );
                }
                balance = await getSolBalance(activeChain?.rpc, address);
                break;
              case ChainType.btc:
                if (activeChain?.chainType !== ChainType.btc) {
                  break;
                }
                balance = await getBtcBalance();
                break;
              case ChainType.mvx:
                break;
              default:
                throw new Error(`Unsupported chain type: ${chainType}`);
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
    [config, isConnected, address, activeChain?.rpc]
  );

  return {
    fetchBalances
  };
};

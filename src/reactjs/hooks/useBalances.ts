import { useAppKitAccount } from '@reown/appkit/react';
import axios from 'axios';
import { useCallback } from 'react';
import { getApiURL } from 'helpers/getApiURL';
import { TokenType } from '../../types';
import { useWeb3App } from '../context/useWeb3App';

export const useBalances = () => {
  const { config } = useWeb3App();
  const { address, isConnected } = useAppKitAccount();
  const { nativeAuthToken } = useWeb3App();

  const fetchBalances = async (chainId: string) => {
    const url = `${getApiURL()}/user/balance/${address}?chainId=${chainId}`;

    try {
      const { data } = await axios.get<
        {
          tokenAddress: string;
          balance: string;
        }[]
      >(url, {
        headers: {
          Authorization: `Bearer ${nativeAuthToken}`
        }
      });
      return data.reduce(
        (acc, cur) => {
          acc[cur.tokenAddress] = cur.balance;
          return acc;
        },
        {} as Record<string, string>
      );
    } catch (error) {
      throw new Error(`Error fetching balances: ${error}`);
    }
  };

  const getBalances = useCallback(
    async ({ tokens, chainId }: { tokens: TokenType[]; chainId: string }) => {
      const tokensBalances = await fetchBalances(chainId);

      return tokens.map((token) => {
        if (!isConnected || !address || !token.chainId) {
          return {
            tokenId: token.address,
            balance: '0'
          };
        }

        return {
          tokenId: token.address,
          balance: tokensBalances[token.address] ?? '0'
        };
      });
    },
    [config, isConnected, address]
  );

  return {
    getBalances
  };
};

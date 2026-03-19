import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { SUI_RPC_URLS } from '../../constants';
import { TokenType } from '../../types';
import { getQueryClient } from '../context/queryClient';

export const useGetSuiTokensBalancesQuery = ({
  tokens
}: {
  tokens: TokenType[];
}) => {
  const { address } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();

  const isSuiActive = caipNetwork?.chainNamespace === 'sui';

  const rpcUrl = useMemo(() => {
    if (!caipNetwork || caipNetwork.chainNamespace !== 'sui') {
      return SUI_RPC_URLS.mainnet;
    }
    const env = caipNetwork.chainId?.toString() ?? 'mainnet';
    return SUI_RPC_URLS[env] ?? SUI_RPC_URLS.mainnet;
  }, [caipNetwork]);

  const tokenIdentifiers = useMemo(
    () => tokens.map(({ address }) => address),
    [tokens]
  );

  const queryFn = async () => {
    if (!address) {
      throw new Error('Sui address is required');
    }

    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'suix_getAllBalances',
        params: [address]
      })
    });

    const json = await response.json();
    const balances: Array<{
      coinType: string;
      totalBalance: string;
    }> = json.result ?? [];

    return tokens.map((token) => {
      const found = balances.find((b) => b.coinType === token.address);
      return {
        ...token,
        balance: found?.totalBalance ?? '0'
      };
    });
  };

  return useQuery({
    queryKey: ['sui-tokens-balances', address, tokenIdentifiers.sort()],
    queryFn,
    enabled: Boolean(address) && tokenIdentifiers.length > 0 && isSuiActive,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: 20000,
    refetchOnReconnect: 'always',
    gcTime: 0
  });
};

export function invalidateSuiTokensBalancesQuery() {
  const queryClient = getQueryClient();
  queryClient.invalidateQueries({
    queryKey: ['sui-tokens-balances']
  });
}

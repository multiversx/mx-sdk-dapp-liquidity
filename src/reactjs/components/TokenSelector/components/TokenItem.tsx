import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { useMemo } from 'react';
import { useSwitchChain } from 'wagmi';
import { TokenIcon } from './TokenIcon';
import { TokenType } from '../../../../types/token';
import { useGetChainId } from '../../../hooks/useGetChainId';
import { useResolveTokenChain } from '../../../hooks/useResolveTokenChain';

export const TokenItem = ({
  token,
  onClick,
  selected
}: {
  token: TokenType;
  onClick: (token: TokenType) => void;
  selected: boolean;
}) => {
  const { tokenChain, chainIcon } = useResolveTokenChain({
    token
  });

  const { chains: sdkChains, switchChain } = useSwitchChain();
  const chainId = useGetChainId();

  const activeChain = useMemo(() => {
    return sdkChains.find(
      (chain) => chain.id.toString() === chainId.toString()
    );
  }, [chainId, sdkChains]);

  const formattedBalance = formatAmount({
    decimals: token.decimals,
    input: token.balance ?? '0',
    addCommas: true,
    digits: 4
  });

  return (
    <div
      className={`token-item ${
        selected ? 'selected' : ''
      } flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-neutral-700 border border-neutral-750 bg-neutral-850`}
      onClick={() => {
        if (tokenChain?.chainId && activeChain?.id !== tokenChain?.chainId) {
          switchChain({
            chainId: Number(tokenChain.chainId)
          });
        }

        onClick(token);
      }}
    >
      <div className="mx-4 flex w-full items-center relative">
        <TokenIcon
          size="lg"
          token={token}
          className="flex items-center justify-center"
        />
        {chainIcon && (
          <img
            src={chainIcon}
            alt={tokenChain?.chainName}
            className="absolute left-4 -bottom-0.5 chain-icon sm w-6 h-6"
          />
        )}
        <div className="ml-2">
          <div className="text-sm font-bold">{token.symbol}</div>
          <div className="text-xs text-gray-400">{token.name}</div>
        </div>
        <div className="ml-auto mr-0 flex justify-end">
          <div className="text-sm font-bold">{formattedBalance}</div>
        </div>
      </div>
    </div>
  );
};

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
        selected ? 'liq-selected' : ''
      } liq-flex liq-cursor-pointer liq-items-center liq-justify-between liq-rounded-lg liq-p-2 hover:liq-bg-neutral-700 liq-border liq-border-neutral-750 liq-bg-neutral-850`}
      onClick={() => {
        if (tokenChain?.chainId && activeChain?.id !== tokenChain?.chainId) {
          switchChain({
            chainId: Number(tokenChain.chainId)
          });
        }

        onClick(token);
      }}
    >
      <div className="liq-mx-4 liq-flex liq-w-full liq-items-center liq-relative">
        <TokenIcon
          size="lg"
          token={token}
          className="liq-flex liq-items-center liq-justify-center"
        />
        {chainIcon && (
          <img
            src={chainIcon}
            alt={tokenChain?.chainName}
            className="liq-absolute liq-left-4 liq--bottom-0.5 liq-chain-icon liq-sm liq-w-6 liq-h-6"
          />
        )}
        <div className="liq-ml-2">
          <div className="liq-text-sm liq-font-bold">{token.symbol}</div>
          <div className="liq-text-xs liq-text-gray-400">{token.name}</div>
        </div>
        <div className="liq-ml-auto liq-mr-0 liq-flex liq-justify-end">
          <div className="liq-text-sm liq-font-bold">{formattedBalance}</div>
        </div>
      </div>
    </div>
  );
};

import { useAppKitNetwork } from '@reown/appkit/react';
import { useCallback, useMemo } from 'react';
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

  const { chains: sdkChains } = useSwitchChain();
  const { switchNetwork } = useAppKitNetwork();
  const chainId = useGetChainId();

  console.log({
    tokenChain,
    sdkChains,
    chainId
  });

  const activeChain = useMemo(() => {
    return sdkChains.find(
      (chain) => chain.id.toString() === chainId?.toString()
    );
  }, [chainId, sdkChains]);

  const handleSwitchChain = useCallback(() => {
    if (
      activeChain &&
      tokenChain?.chainId &&
      activeChain?.id.toString() !== tokenChain?.chainId.toString()
    ) {
      // TODO remove any when sdk is updated
      switchNetwork(
        (sdkChains.find(
          (chain) => chain.id.toString() === tokenChain?.chainId.toString()
        ) ?? activeChain) as any
      );
    }
  }, [activeChain, sdkChains, tokenChain?.chainId, activeChain?.id]);

  return (
    <div
      className={`token-item ${
        selected ? 'liq-selected' : ''
      } liq-flex liq-cursor-pointer liq-items-center liq-justify-between liq-rounded-lg liq-p-2 hover:liq-bg-neutral-700 liq-bg-neutral-850`}
      onClick={() => {
        handleSwitchChain();
        onClick(token);
      }}
    >
      <div className="liq-flex liq-w-full liq-items-center liq-relative">
        <TokenIcon
          size="lg"
          token={token}
          className="liq-flex liq-items-center liq-justify-center"
        />
        {chainIcon && (
          <img
            src={chainIcon}
            alt=""
            className="liq-absolute liq-left-4 liq-bottom-[-2px] liq-chain-icon liq-sm liq-w-6 liq-h-6 liq-border-[3px] liq-border-neutral-850  liq-rounded-lg"
          />
        )}
        <div className="liq-ml-2">
          <div className="liq-text-sm liq-font-bold">{token.symbol}</div>
          <div className="liq-text-xs liq-text-gray-400">{token.name}</div>
        </div>
      </div>
    </div>
  );
};

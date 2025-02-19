// import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
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

  const activeChain = useMemo(() => {
    return sdkChains.find(
      (chain) => chain.id.toString() === chainId?.toString()
    );
  }, [chainId, sdkChains]);

  // const formattedBalance = formatAmount({
  //   decimals: token.decimals,
  //   input: token.balance ?? '0',
  //   addCommas: true,
  //   digits: 4
  // });

  const handleSwitchChain = useCallback(() => {
    if (
      activeChain &&
      tokenChain?.chainId &&
      activeChain?.id !== tokenChain?.chainId
    ) {
      switchNetwork(
        sdkChains.find(
          (chain) => chain.id.toString() === tokenChain?.chainId.toString()
        ) ?? activeChain
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
        {/*Temp hide token balance from the token selector screen*/}
        {/*<div className="liq-ml-auto liq-mr-0 liq-flex liq-justify-end">*/}
        {/*  <div className="liq-text-sm liq-font-bold">{formattedBalance}</div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

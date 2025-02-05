// import { useEffect, useMemo } from 'react';
// import { useSwitchChain } from 'wagmi';
import { TokenIcon } from './TokenIcon';
import { TokenSymbol } from './TokenSymbol';
import { TokenType } from '../../../../types/token';
// import { useGetChainId } from '../../../hooks/useGetChainId';

export const SelectedOption = ({ value }: { value?: TokenType }) => {
  // const { chains: sdkChains, switchChain } = useSwitchChain();
  // const chainId = useGetChainId();
  //
  // const activeChain = useMemo(() => {
  //   return sdkChains.find(
  //     (chain) => chain.id.toString() === chainId.toString()
  //   );
  // }, [chainId, sdkChains]);
  //
  // useEffect(() => {
  //   if (value?.chainId && activeChain?.id !== value.chainId) {
  //     switchChain({
  //       chainId: Number(value.chainId)
  //     });
  //   }
  // }, [value?.chainId]);

  return (
    <>
      <TokenIcon
        size="lg"
        token={value}
        className="flex items-center justify-center relative"
      />

      <div className="flex-1 truncate text-left">
        {value && (
          <div className="flex flex-col">
            <div className="flex items-center">
              <TokenSymbol
                token={value}
                className="font-semibold leading-none"
              />
            </div>
          </div>
        )}
        {!value && <div className="text-neutral-500">Select token</div>}
      </div>
    </>
  );
};

import { useAppKitNetwork } from '@reown/appkit/react';
import { useMemo } from 'react';
import { useWeb3App } from './useWeb3App';

export const useGetChainId = () => {
  const { chainId } = useAppKitNetwork();
  const { appKit } = useWeb3App();

  return useMemo(() => chainId ?? appKit.getChainId(), [chainId, appKit]);
};

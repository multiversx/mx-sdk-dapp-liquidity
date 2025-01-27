import { useMemo } from 'react';
import { useAccount } from './useAccount';
import { useWeb3App } from './useWeb3App';

export const useGetChainId = () => {
  const account = useAccount();
  const { appKit } = useWeb3App();

  return useMemo(
    () => Number(account.caipAddress?.split(':')[1] ?? appKit.getChainId()),
    [account.caipAddress, appKit]
  );
};

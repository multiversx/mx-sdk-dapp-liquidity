import { useMemo } from 'react';
import { useWeb3App } from './useWeb3App';

export const useGetChainId = () => {
  const app = useWeb3App();
  return useMemo(() => app.appKit.getChainId(), [app.appKit]);
};

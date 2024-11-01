import { useCallback } from 'react';
import { useWeb3App } from './useWeb3App';

export const useResolveConnectorIcon = () => {
  const { options } = useWeb3App();

  return useCallback(
    (connectorID: string) => {
      return (
        options.appKitOptions?.connectorImages?.[connectorID] ??
        'https://avatars.githubusercontent.com/u/179229932'
      );
    },
    [options.appKitOptions?.connectorImages]
  );
};

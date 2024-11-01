import { useCallback } from 'react';
import { useWeb3App } from './useWeb3App';
import { REWON_ICON } from '../constants/brand';

export const useResolveConnectorIcon = () => {
  const { options } = useWeb3App();

  return useCallback(
    (connectorID: string) => {
      return (
        options.appKitOptions?.connectorImages?.[connectorID] ?? REWON_ICON
      );
    },
    [options.appKitOptions?.connectorImages]
  );
};

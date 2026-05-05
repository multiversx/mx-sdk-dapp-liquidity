import { useAppKitNetwork } from '@reown/appkit/react';
import { useMemo } from 'react';
import { toBridgeApiChainId } from '../helpers/resolveBridgeApiChainId';

/** Active AppKit network `chainId` normalized for bridge HTTP APIs (see `toBridgeApiChainId`). */
export function useBridgeApiChainId() {
  const { chainId, caipNetwork } = useAppKitNetwork();

  return useMemo(
    () => toBridgeApiChainId(chainId, caipNetwork),
    [chainId, caipNetwork]
  );
}

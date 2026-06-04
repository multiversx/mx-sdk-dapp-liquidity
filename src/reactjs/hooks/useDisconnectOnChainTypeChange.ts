import { useDisconnect } from '@reown/appkit/react';
import { useEffect, useRef } from 'react';
import { ChainType } from '../../types/chainType';

/**
 * Disconnects the previous chain namespace when the active chain type changes.
 *
 * This covers all paths that can change the chain type (token selection, direction
 * toggle, etc.) and prevents stale SUI sessions from lingering after switching to
 * EVM (and vice-versa) in mobile dapp browsers.
 *
 * Only reacts to genuine transitions — skips the initial undefined→value mount.
 */
export function useDisconnectOnChainTypeChange(
  chainType: ChainType | undefined
): void {
  const { disconnect } = useDisconnect();
  const prevChainTypeRef = useRef<ChainType | undefined>(undefined);

  useEffect(() => {
    const prev = prevChainTypeRef.current;
    prevChainTypeRef.current = chainType;

    if (prev === undefined || prev === chainType) {
      return;
    }

    if (prev === ChainType.sui) {
      void disconnect({ namespace: 'sui' as any });
    } else if (prev === ChainType.evm) {
      // No namespace arg = disconnect the active EVM (eip155) session
      void disconnect();
    }
    // SOL, BTC, MVX: not managed via AppKit namespaces — nothing to disconnect here
  }, [chainType]);
}

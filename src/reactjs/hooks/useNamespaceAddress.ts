import { useAppKitAccount } from '@reown/appkit/react';
import { ChainType } from '../../types/chainType';

/**
 * Returns the connected wallet address scoped to the AppKit namespace that corresponds
 * to the given chain type, preventing a stale SUI address from leaking into EVM form
 * fields (and vice-versa) during namespace switches.
 *
 * Mapping:
 *   ChainType.sui  → 'sui'    namespace
 *   ChainType.evm  → 'eip155' namespace
 *   ChainType.mvx  → undefined (MVX addresses come from the dApp's own auth layer)
 *   all others     → undefined
 *
 * Because hooks must be called unconditionally and before derived values in the same
 * component, call this hook at the top of the component and pass the chain type that
 * will be resolved later (it can be undefined on first render — the hook reads both
 * namespaces unconditionally and picks based on chainType).
 */
export function useNamespaceAddress(
  chainType: ChainType | undefined
): string | undefined {
  // Both namespaces are always read so the hook call count never changes between renders.
  const suiAccount = useAppKitAccount({ namespace: 'sui' as any });
  const evmAccount = useAppKitAccount({ namespace: 'eip155' as any });

  switch (chainType) {
    case ChainType.sui:
      return suiAccount.address;
    case ChainType.evm:
      return evmAccount.address;
    default:
      return undefined;
  }
}

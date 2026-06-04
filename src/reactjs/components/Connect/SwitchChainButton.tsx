import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { ChainNamespace } from '@reown/appkit-common';
import { ReactNode } from 'react';
import { ChainType } from '../../../types/chainType';

export const SwitchChainButton = ({
  children,
  className,
  disabled,
  chainType
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  chainType?: ChainType;
}) => {
  const { open } = useAppKit();
  const evmAccount = useAppKitAccount({
    namespace: 'eip155' as ChainNamespace
  });
  const suiAccount = useAppKitAccount({ namespace: 'sui' as ChainNamespace });

  // Map chain type to AppKit namespace so the WC session proposal only requests
  // the relevant chain family (prevents sui:mainnet appearing in EVM proposals).
  const namespace =
    chainType === ChainType.evm
      ? 'eip155'
      : chainType === ChainType.sui
        ? 'sui'
        : undefined;

  // Namespace-scoped connection check so SUI being connected doesn't cause 'Networks'
  // to open when the user wants to connect/switch the EVM namespace.
  const isConnectedForNamespace =
    chainType === ChainType.evm
      ? Boolean(evmAccount.address)
      : chainType === ChainType.sui
        ? Boolean(suiAccount.address)
        : evmAccount.isConnected;

  const baseStyle = `liq-font-bold liq-text-white liq-rounded-lg ${
    disabled ? 'liq-cursor-not-allowed' : 'liq-cursor-pointer'
  }`;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        open({
          view: isConnectedForNamespace ? 'Networks' : 'Connect',
          ...(namespace ? { namespace } : {})
        });
      }}
      className={`${baseStyle} ${className}`}
      disabled={disabled}
      data-tesid="evm-connect-button"
    >
      {children}
    </button>
  );
};

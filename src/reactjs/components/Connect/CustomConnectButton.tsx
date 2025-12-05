import { useAppKit } from '@reown/appkit/react';
import { ReactNode } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

export const CustomConnectButton = ({
  disabled,
  className,
  children,
  'data-testid': dataTestId
}: {
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}) => {
  const { open } = useAppKit();
  const { isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  const baseStyle = 'liq-font-bold liq-text-inherit liq-rounded-lg';

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className={`${baseStyle} ${className}`}
        disabled={disabled}
      >
        {children || 'Disconnect'}
      </button>
    );
  }
  return (
    <button
      data-testid={dataTestId}
      onClick={() =>
        open({
          view: 'Connect'
        })
      }
      className={`${baseStyle} ${className}`}
      disabled={disabled}
    >
      {children || (isConnecting ? 'Trying to connect...' : 'Connect')}
    </button>
  );
};

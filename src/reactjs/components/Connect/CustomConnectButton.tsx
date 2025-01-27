import { useAppKit } from '@reown/appkit/react';
import { ReactNode } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

export const CustomConnectButton = ({
  disabled,
  className,
  children
}: {
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}) => {
  const { open } = useAppKit();
  const { isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  const baseStyle = 'font-bold text-white rounded-lg';

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

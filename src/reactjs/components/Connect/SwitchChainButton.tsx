import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { ReactNode } from 'react';

export const SwitchChainButton = ({
  children,
  className,
  disabled
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) => {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();

  const baseStyle = `font-bold text-white rounded-lg ${
    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
  }`;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        open({
          view: isConnected ? 'Networks' : 'Connect'
        });
      }}
      className={`${baseStyle} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

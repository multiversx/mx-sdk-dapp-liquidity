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

  const baseStyle = `liq-font-bold liq-text-white liq-rounded-lg ${
    disabled ? 'liq-cursor-not-allowed' : 'liq-cursor-pointer'
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

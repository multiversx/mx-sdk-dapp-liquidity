import { useWeb3Modal } from '@web3modal/wagmi/react';
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
  const { open } = useWeb3Modal();

  const baseStyle = `font-bold text-white rounded-lg ${
    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
  }`;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        open({
          view: 'Networks'
        });
      }}
      className={`${baseStyle} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

import { useAppKitAccount } from '@reown/appkit/react';
import { useAccount as useWagmiAccount } from 'wagmi';

export const useAccount = () => {
  const appkitAccount = useAppKitAccount();
  const wagmiAccount = useWagmiAccount();

  return {
    ...wagmiAccount,
    ...appkitAccount
  };
};

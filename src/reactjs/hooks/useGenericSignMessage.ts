import { useAppKitNetworkCore, useAppKitProvider } from '@reown/appkit/react';
import type { BitcoinConnector } from '@reown/appkit-adapter-bitcoin';
import type { Provider } from '@reown/appkit-adapter-solana/react';
import { useSignMessage } from 'wagmi';
import { useAccount } from './useAccount';

export const useGenericSignMessage = () => {
  const { caipNetwork } = useAppKitNetworkCore();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const { walletProvider: solWalletProvider } =
    useAppKitProvider<Provider>('solana');
  const { walletProvider: btcWalletProvider } =
    useAppKitProvider<BitcoinConnector>('bip122');

  const signMessage = async (message: string) => {
    if (!isConnected || !caipNetwork?.chainNamespace) {
      throw new Error('Wallet not connected or chain namespace unavailable');
    }

    switch (caipNetwork?.chainNamespace) {
      case 'eip155': {
        return await signMessageAsync({ message });
      }
      case 'solana': {
        const encodedMessage = Buffer.from(message);
        const signature = await solWalletProvider.signMessage(encodedMessage);
        return Buffer.from(signature).toString('hex');
      }
      case 'bip122': {
        return await btcWalletProvider.signMessage({
          address: address ?? '',
          message
        });
      }
      default:
        throw new Error(
          `Unsupported chain namespace: ${caipNetwork.chainNamespace}`
        );
    }
  };

  return {
    signMessage
  };
};

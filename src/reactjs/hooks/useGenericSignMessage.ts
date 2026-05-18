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
  // TODO: type properly when @reown exports Sui provider type
  const { walletProvider: suiWalletProvider } = useAppKitProvider<any>('sui');

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
      case 'sui': {
        if (!suiWalletProvider) {
          throw new Error('Sui wallet not connected');
        }
        const encodedMessage = new TextEncoder().encode(message);
        const params = {
          message: Buffer.from(encodedMessage).toString('base64')
        };

        const MAX_SUI_MESSAGE_BYTES = 32 * 1024; // 32 KiB

        if (!params.message || typeof params.message !== 'string') {
          throw new Error(
            'Invalid Sui message: payload must be a non-empty string'
          );
        }

        // Validate base64
        try {
          const decoded = atob(params.message);
          if (decoded.length > MAX_SUI_MESSAGE_BYTES) {
            throw new Error(
              `Sui message payload exceeds maximum size of ${MAX_SUI_MESSAGE_BYTES} bytes`
            );
          }
        } catch (e) {
          if (e instanceof Error && e.message.includes('maximum size')) {
            throw e;
          }
          throw new Error('Invalid Sui message: payload is not valid base64');
        }

        const result = await suiWalletProvider.request({
          method: 'sui_signPersonalMessage',
          params
        });
        return result.signature;
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

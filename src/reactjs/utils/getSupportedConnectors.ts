import { authConnector } from '@reown/appkit-adapter-wagmi';
import { walletConnect, coinbaseWallet, injected } from 'wagmi/connectors';

export const getSupportedConnectors = () => {
  return { authConnector, walletConnect, coinbaseWallet, injected };
};

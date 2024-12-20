import { authConnector } from '@web3modal/wagmi';
import { walletConnect, coinbaseWallet, injected } from 'wagmi/connectors';

export const getSupportedConnectors = () => {
  return { authConnector, walletConnect, coinbaseWallet, injected };
};

import { useMemo } from 'react';
import { useConnectors } from 'wagmi';
import { useWeb3App } from './useWeb3App';

const defaultAcceptedConnectorsIDs = [
  'injected',
  'walletconnect',
  'io.metamask',
  'com.trustwallet.app'
];

export const useSupportedConnectors = () => {
  const connectors = useConnectors();
  const { options } = useWeb3App();

  const supportedConnectorIds =
    options?.acceptedConnectorsIDs || defaultAcceptedConnectorsIDs;

  const supportedConnectors = useMemo(
    () =>
      connectors.filter((connector) =>
        supportedConnectorIds.includes(connector.id.toLowerCase())
      ),
    [connectors, supportedConnectorIds]
  );

  return useMemo(() => supportedConnectors.filter(
      (connector, index) =>
          supportedConnectors.findIndex(
              (searchingConnector) => connector.id === searchingConnector.id
          ) === index
  ), [supportedConnectors]);
};

import { useMemo } from 'react';
import { ConnectButton } from './ConnectButton';
import { useResolveConnectorIcon } from '../../hooks/useResolveConnectorIcon';
import { useSupportedConnectors } from '../../hooks/useSupportedConnectors';

export const ConnectButtons = () => {
  const supportedConnectors = useSupportedConnectors();
  const resolveConnectorIcon = useResolveConnectorIcon();

  const supportedConnectorsWithIcon = useMemo(
    () =>
      supportedConnectors.map((connector) => ({
        ...connector,
        icon: resolveConnectorIcon(connector.id)
      })),
    [resolveConnectorIcon, supportedConnectors]
  );

  return supportedConnectorsWithIcon.map((connector) => (
    <ConnectButton key={connector.uid} connector={connector} />
  ));
};

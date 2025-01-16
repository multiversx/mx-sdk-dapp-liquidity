import { useMemo } from 'react';
import { ConnectButton } from './ConnectButton.tsx';
import { useResolveConnectorIcon } from '../../hooks/useResolveConnectorIcon.ts';
import { useSupportedConnectors } from '../../hooks/useSupportedConnectors.ts';

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

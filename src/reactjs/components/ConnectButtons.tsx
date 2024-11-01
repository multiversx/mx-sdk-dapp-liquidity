import { useCallback, useEffect, useMemo, useState } from 'react';
import { Connector } from 'wagmi';
import { useAuth } from '../hooks/useAuth';
import { useResolveConnectorIcon } from '../hooks/useResolveConnectorIcon';
import { useSupportedConnectors } from '../hooks/useSupportedConnectors';

export function ConnectButtons() {
  const supportedConnectors = useSupportedConnectors();
  const resolveConnectorIcon = useResolveConnectorIcon();

  const supportedConnectorsWithIcon = useMemo(
    () =>
      supportedConnectors.map((connector) => {
        return {
          ...connector,
          icon: resolveConnectorIcon(connector.id)
        };
      }),
    [resolveConnectorIcon, supportedConnectors]
  );

  return supportedConnectorsWithIcon.map((connector) => (
    <ConnectButton key={connector.uid} connector={connector} />
  ));
}

function ConnectButton({ connector }: { connector: Connector }) {
  const [ready, setReady] = useState(false);
  const { isConnecting, connect } = useAuth();

  const isDisabled = !ready || isConnecting;

  const handleConnect = useCallback(
    (connectorID: string) => async () => {
      await connect(connectorID);
    },
    [connect]
  );

  const handleCheckIfReady = useCallback(async () => {
    const provider = await connector.getProvider();
    setReady(!!provider);
  }, [connector]);

  useEffect(() => {
    handleCheckIfReady();
  }, [handleCheckIfReady]);

  return (
    <button
      className="sdk-dapp-liquidity-wallet-connect-button"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        margin: '1rem'
      }}
      disabled={isDisabled}
      onClick={handleConnect(connector.id)}
    >
      <img
        src={connector.icon}
        alt={''}
        className="sdk-dapp-liquidity-wallet-connect-button-icon"
        style={{ width: '2rem', height: '2rem', borderRadius: '0.25rem' }}
      />
      <span style={{ float: 'left' }}>{connector.name}</span>
    </button>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { Connector } from 'wagmi';
import { useAuth } from '../hooks/useAuth';

export const ConnectButton = ({ connector }: { connector: Connector }) => {
  const [ready, setReady] = useState(false);
  const { isConnecting, connect } = useAuth();

  const isDisabled = !ready || isConnecting;

  const handleConnect = useCallback(
    (connectorID: string) => () => connect(connectorID),
    [connect]
  );

  const handleCheckIfReady = useCallback(async () => {
    const provider = await connector.getProvider();
    setReady(Boolean(provider));
  }, [connector]);

  useEffect(() => {
    handleCheckIfReady();
  }, [handleCheckIfReady]);

  return (
    <button
      className="sdk-dapp-liquidity-wallet-connect-button"
      disabled={isDisabled}
      onClick={handleConnect(connector.id)}
    >
      <img
        src={connector.icon}
        alt={''}
        className="sdk-dapp-liquidity-wallet-connect-button-icon"
      />
      <span className="sdk-dapp-liquidity-wallet-connect-button-text">
        {connector.name}
      </span>
    </button>
  );
};

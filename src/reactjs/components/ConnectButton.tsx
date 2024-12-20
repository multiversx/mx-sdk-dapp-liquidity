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
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <div className="flex-shrink-0">
        <img
          src={connector.icon}
          alt={''}
          className="sdk-dapp-liquidity-wallet-connect-button-icon"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate dark:text-white sdk-dapp-liquidity-wallet-connect-button-text">
          {connector.name}
        </p>
      </div>
      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
        <button
          className="sdk-dapp-liquidity-wallet-connect-button"
          disabled={isDisabled}
          onClick={handleConnect(connector.id)}
        >
          Connect
        </button>
      </div>
    </div>
  );
};

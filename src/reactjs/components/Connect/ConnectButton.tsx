import { useCallback, useEffect, useState } from 'react';
import { Connector } from 'wagmi';
import { useAuth } from '../../hooks/useAuth';

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
    <div className="liq-flex liq-items-center liq-space-x-4 rtl:liq-space-x-reverse">
      <div className="liq-flex-shrink-0">
        <img
          src={connector.icon}
          alt={''}
          className="sdk-dapp-liquidity-wallet-connect-button-icon"
        />
      </div>
      <div className="liq-flex-1 liq-min-w-0">
        <p className="liq-text-sm liq-font-medium liq-text-gray-900 liq-truncate dark:liq-text-white sdk-dapp-liquidity-wallet-connect-button-text">
          {connector.name}
        </p>
      </div>
      <div className="liq-inline-flex liq-items-center liq-text-base liq-font-semibold liq-text-gray-900 dark:liq-text-white">
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

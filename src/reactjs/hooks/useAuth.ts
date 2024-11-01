import { useCallback, useState } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { useSupportedConnectors } from './useSupportedConnectors';

export const useAuth = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const supportedConnectors = useSupportedConnectors();

  const connect = useCallback(
    async (connectorID: string) => {
      const foundConnector = supportedConnectors.find(
        (connector) => connector.id === connectorID
      );
      if (!foundConnector) {
        throw new Error(`Unsupported connector: ${connectorID}`);
      }

      try {
        setIsConnecting(true);
        const connected = await connectAsync({ connector: foundConnector });
        setIsConnecting(false);

        return connected;
      } catch (error) {
        console.error(error);
        setIsConnecting(false);
      }
    },
    [connectAsync, supportedConnectors]
  );

  const disconnect = useCallback(async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      console.error(error);
    } finally {
      console.log('Disconnected');
    }
  }, [disconnectAsync]);

  return {
    connect,
    disconnect,
    isConnecting
  };
};

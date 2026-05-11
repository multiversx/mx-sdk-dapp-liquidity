import { CustomConnectButton } from './CustomConnectButton';
import { ChainDTO } from '../../../dto/Chain.dto';
import { getDisplayName, safeImageUrl } from '../../../helpers';
import { useAccount } from '../../hooks/useAccount';

export const BridgeConnectButton = ({
  activeChain,
  disabled,
  className
}: {
  activeChain?: ChainDTO;
  disabled?: boolean;
  className?: string;
}) => {
  const account = useAccount();

  return (
    <CustomConnectButton
      className={className}
      disabled={disabled}
      data-testid="evm-network-connect-button"
    >
      {account.isConnected ? null : (
        <div className="liq-flex liq-items-center liq-justify-center liq-gap-1">
          {!account.isConnected && (
            <div className="liq-ml-2 liq-flex liq-items-center liq-gap-1">
              <span className="liq-text-primary-200">
                {account.isConnecting ? 'Connecting...' : 'Connect'}
              </span>
            </div>
          )}
          {activeChain && (
            <img
              src={safeImageUrl(activeChain.pngUrl)}
              alt=""
              className="liq-z-10 liq-flex liq-h-[1.5rem] liq-w-[1.5rem] liq-rounded-lg"
            />
          )}
          {activeChain?.networkName && (
            <span className="liq-inline liq-truncate">
              {getDisplayName(activeChain)}
            </span>
          )}
        </div>
      )}
    </CustomConnectButton>
  );
};

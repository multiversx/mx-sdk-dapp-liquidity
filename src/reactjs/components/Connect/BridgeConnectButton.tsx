import { CustomConnectButton } from './CustomConnectButton';
import { ChainDTO } from '../../../dto/Chain.dto';
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
    <CustomConnectButton className={className} disabled={disabled}>
      {account.isConnected ? null : (
        <div className="liq-flex liq-items-center liq-justify-center liq-gap-1 liq-text-neutral-100">
          {!account.isConnected && (
            <div className="liq-ml-2 liq-flex liq-items-center liq-gap-1">
              <span className="liq-text-neutral-100">
                {account.isConnecting ? 'Connecting...' : 'Connect'}
              </span>
            </div>
          )}
          {activeChain && (
            <img
              src={activeChain.svgUrl}
              alt={activeChain.chainName}
              className="liq-z-10 liq-flex liq-h-[1.5rem] liq-w-[1.5rem] liq-p-1"
            />
          )}
          {activeChain?.chainName}
        </div>
      )}
    </CustomConnectButton>
  );
};

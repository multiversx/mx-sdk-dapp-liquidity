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
        <div className="flex items-center justify-center gap-1 text-neutral-100">
          {!account.isConnected && (
            <div className="ml-2 flex items-center gap-1">
              <span className="text-neutral-100">
                {account.isConnecting ? 'Connecting...' : 'Connect'}
              </span>
            </div>
          )}
          {activeChain && (
            <img
              src={activeChain.svgUrl}
              alt={activeChain.chainName}
              className="z-10 flex h-[1.5rem] w-[1.5rem] p-1"
            />
          )}
          {activeChain?.chainName}
        </div>
      )}
    </CustomConnectButton>
  );
};

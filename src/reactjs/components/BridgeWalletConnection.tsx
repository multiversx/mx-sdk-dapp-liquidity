import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons/faPowerOff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDisconnect } from '@reown/appkit/react';
import { SwitchChainButton } from './Connect/SwitchChainButton';
import { MxLink } from './MxLink';
import { ChainDTO } from '../../dto/Chain.dto';
import { useAccount } from '../hooks/useAccount';

export const BridgeWalletConnection = ({
  activeChain,
  disabled,
  TrimAddressComponent
}: {
  activeChain?: ChainDTO;
  disabled: boolean;
  TrimAddressComponent: (props: {
    text: string;
    color?: 'muted' | 'secondary' | string;
    className?: string;
  }) => JSX.Element;
}) => {
  const account = useAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  return (
    <div className="flex items-center">
      From
      <SwitchChainButton
        disabled={disabled}
        className="focus-primary mr-1 rounded-lg bg-neutral-850/50 pr-2 font-semibold text-primary-200 transition-colors duration-200 hover:enabled:bg-primary-700/80 disabled:opacity-50"
      >
        <div className="flex items-center text-neutral-100">
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
      </SwitchChainButton>
      {account.address && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex max-w-[10rem] items-center gap-1">
            <MxLink
              to={`${activeChain?.blockExplorerUrls?.[0]}/address/${account.address}`}
              target="_blank"
              showExternalIcon={false}
            >
              <div className="flex min-w-0 flex-grow overflow-hidden leading-none">
                <TrimAddressComponent
                  text={account.address}
                  className="flex items-center"
                />
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="ml-1 text-neutral-400"
                />
              </div>
            </MxLink>
            {/*<CopyButton text={account.address} className="text-sm" />*/}
          </div>
        </div>
      )}
      {account.address && (
        <div className={`ml-auto mr-0 flex items-center gap-1`}>
          <button
            className="focus-primary flex items-center gap-1 rounded-xl px-0 py-2 text-sm font-semibold text-neutral-400 transition-colors duration-200 hover:enabled:text-white disabled:opacity-50"
            onClick={handleDisconnect}
          >
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div>
      )}
    </div>
  );
};

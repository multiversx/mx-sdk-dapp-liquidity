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

  const handleDisconnect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  return (
    <div className="liq-flex liq-items-center">
      From
      <SwitchChainButton
        disabled={disabled}
        className="focus-primary liq-mr-1 liq-rounded-lg liq-bg-neutral-850/50 liq-pr-2 liq-font-semibold liq-text-primary-200 liq-transition-colors liq-duration-200 hover:enabled:liq-bg-primary-700/80 disabled:liq-opacity-50"
      >
        <div className="liq-flex liq-items-center liq-text-neutral-100">
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
      </SwitchChainButton>
      {account.address && (
        <div className="liq-flex liq-items-center liq-justify-between liq-gap-2">
          <div className="liq-flex liq-max-w-[10rem] liq-items-center liq-gap-1">
            <MxLink
              to={`${activeChain?.blockExplorerUrls?.[0]}/address/${account.address}`}
              target="_blank"
              showExternalIcon={false}
            >
              <div className="liq-flex liq-min-w-0 liq-flex-grow liq-overflow-hidden liq-leading-none liq-max-w-[10rem]">
                <TrimAddressComponent
                  text={account.address}
                  className="liq-flex liq-items-center  liq-text-neutral-100"
                />
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="liq-ml-1 liq-text-neutral-400"
                />
              </div>
            </MxLink>
            {/*<CopyButton text={account.address} className="liq-text-sm" />*/}
          </div>
        </div>
      )}
      {account.address && (
        <div className="liq-ml-auto liq-mr-0 liq-flex liq-items-center liq-gap-1">
          <button
            className="focus-primary liq-flex liq-items-center liq-gap-1 liq-rounded-xl liq-px-0 liq-py-2 liq-text-sm liq-font-semibold liq-text-neutral-400 liq-transition-colors liq-duration-200 hover:enabled:liq-text-white disabled:liq-opacity-50"
            onClick={handleDisconnect}
          >
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div>
      )}
    </div>
  );
};

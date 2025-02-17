// import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons/faPowerOff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDisconnect } from '@reown/appkit/react';
import { SwitchChainButton } from './Connect/SwitchChainButton';
import { CopyButton } from './CopyButton';
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
    <>
      {account.address && (
        <>
          <img src={activeChain?.svgUrl} alt="" className="liq-w-6" />
          <span className="">{activeChain?.chainName}:</span>
          <div className="liq-flex liq-items-center liq-justify-between">
            <div className="liq-flex liq-max-w-[10rem] liq-items-center liq-gap-1">
              <MxLink
                to={`${activeChain?.blockExplorerUrls?.[0]}/address/${account.address}`}
                target="_blank"
                showExternalIcon={false}
              >
                <div className="liq-flex liq-min-w-0 liq-flex-grow liq-overflow-hidden liq-leading-none liq-max-w-[10rem]">
                  <TrimAddressComponent
                    text={account.address}
                    className="liq-flex liq-items-center  liq-text-neutral-100 uppercase"
                  />
                  {/*<FontAwesomeIcon*/}
                  {/*  icon={faChevronRight}*/}
                  {/*  className="liq-ml-1 liq-text-neutral-400"*/}
                  {/*/>*/}
                </div>
              </MxLink>
              <CopyButton text={account.address} className="liq-text-sm" />
            </div>
          </div>
          <div className="liq-ml-auto liq-mr-0 liq-flex liq-items-center liq-gap-1">
            <button
              className="focus-primary liq-flex liq-items-center liq-gap-1 liq-rounded-xl liq-px-0 liq-py-2 liq-text-sm liq-font-semibold liq-text-neutral-400 liq-transition-colors liq-duration-200 hover:enabled:liq-text-white disabled:liq-opacity-50"
              onClick={handleDisconnect}
            >
              <FontAwesomeIcon icon={faPowerOff} />
            </button>
          </div>
        </>
      )}
      {!account.address && (
        <SwitchChainButton
          disabled={disabled}
          className="liq-rounded-lg liq-font-semibold liq-transition-colors liq-duration-200 disabled:liq-opacity-50 liq-bg-neutral-750 liq-text-primary-200 hover:enabled:liq-bg-primary liq-px-2"
        >
          <div className="liq-flex liq-items-center liq-text-neutral-100">
            <div className="liq-flex liq-justify-center liq-gap-2">
              <div> {account.isConnecting ? 'Connecting...' : 'Connect'} </div>
              <img src={activeChain?.svgUrl} alt="" className="liq-w-4" />
              <div>{activeChain?.chainName}</div>
            </div>
          </div>
        </SwitchChainButton>
      )}
    </>
  );
};

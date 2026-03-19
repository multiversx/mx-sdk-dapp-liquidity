import { faPowerOff } from '@fortawesome/free-solid-svg-icons/faPowerOff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDisconnect } from '@reown/appkit/react';
import { getDisplayName } from 'helpers/getDisplayName';
import { useState } from 'react';
import { SwitchChainButton } from './SwitchChainButton';
import { ChainDTO } from '../../../dto/Chain.dto';
import { ChainType } from '../../../types/chainType';
import { useAccount } from '../../hooks/useAccount';
import { useWeb3App } from '../../context/useWeb3App';
import { MxLink } from '../base';
import { CopyButton } from '../CopyButton';
import { TrimAddress } from '../TrimAddress';

export const BridgeAccountDisplay = ({
  activeChain,
  disabled
}: {
  activeChain?: ChainDTO;
  disabled: boolean;
}) => {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const { externalChains } = useWeb3App();
  const [suiConnecting, setSuiConnecting] = useState(false);

  const isSuiChain = activeChain?.chainType === ChainType.sui;

  const suiExternal = externalChains?.find((c) => c.chainType === 'sui');
  const connectedExternal = externalChains?.find((c) => c.address);

  const handleDisconnect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  // Connected to an external chain (e.g. Sui)
  if (connectedExternal) {
    return (
      <>
        {connectedExternal.chainIcon && (
          <img
            src={connectedExternal.chainIcon}
            alt=""
            className="liq-w-6 liq-rounded-full"
          />
        )}
        <span className="liq-truncate liq-text-gray-400">
          {connectedExternal.chainName}
        </span>
        <span className="liq-ml-[-5px]">:</span>
        <div className="liq-flex liq-items-center liq-justify-between">
          <div className="liq-flex liq-max-w-[10rem] liq-items-center liq-gap-1">
            <div className="liq-flex liq-min-w-0 liq-flex-grow liq-overflow-hidden liq-leading-none liq-max-w-[10rem]">
              <TrimAddress
                address={connectedExternal.address ?? ''}
                data-testid="external-address"
              />
            </div>
            <CopyButton
              text={connectedExternal.address ?? ''}
              className="liq-text-sm"
              data-testid="external-copy-button"
            />
          </div>
        </div>
        <div className="liq-ml-auto liq-mr-0 liq-flex liq-items-center liq-gap-1">
          <button
            className="focus-primary liq-flex liq-items-center liq-gap-1 liq-rounded-xl liq-px-0 liq-py-2 liq-text-sm liq-font-semibold liq-text-neutral-400 liq-transition-colors liq-duration-200 hover:enabled:liq-text-white disabled:liq-opacity-50"
            onClick={() => connectedExternal.onDisconnect()}
            data-testid="external-disconnect-button"
          >
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div>
      </>
    );
  }

  // Connected to EVM
  if (account.address) {
    return (
      <>
        <img src={activeChain?.pngUrl} alt="" className="liq-w-6" />
        <span className="liq-truncate liq-text-gray-400">
          {getDisplayName(activeChain)}
        </span>
        <span className="liq-ml-[-5px]">:</span>
        <div className="liq-flex liq-items-center liq-justify-between">
          <div className="liq-flex liq-max-w-[10rem] liq-items-center liq-gap-1">
            <MxLink
              to={`${activeChain?.blockExplorerUrls?.[0]}/address/${account.address}`}
              target="_blank"
              showExternalIcon={false}
              className="!liq-relative"
            >
              <div className="liq-flex liq-min-w-0 liq-flex-grow liq-overflow-hidden liq-leading-none liq-max-w-[10rem]">
                <TrimAddress
                  address={account.address}
                  data-testid="evm-address"
                />
              </div>
            </MxLink>
            <CopyButton
              text={account.address}
              className="liq-text-sm"
              data-testid="evm-copy-button"
            />
          </div>
        </div>
        <div className="liq-ml-auto liq-mr-0 liq-flex liq-items-center liq-gap-1">
          <button
            className="focus-primary liq-flex liq-items-center liq-gap-1 liq-rounded-xl liq-px-0 liq-py-2 liq-text-sm liq-font-semibold liq-text-neutral-400 liq-transition-colors liq-duration-200 hover:enabled:liq-text-white disabled:liq-opacity-50"
            onClick={handleDisconnect}
            data-testid="evm-disconnect-button"
          >
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div>
      </>
    );
  }

  // Not connected — if selected token is on Sui, show "Connect Sui"
  if (isSuiChain && suiExternal) {
    const handleSuiConnect = async () => {
      if (suiConnecting) return;
      setSuiConnecting(true);
      try {
        const { address } = await suiExternal.connector.connect();
        suiExternal.onConnect(address);
      } catch (error) {
        console.error('[Sui] Connection failed:', error);
      } finally {
        setSuiConnecting(false);
      }
    };

    return (
      <>
        <button
          disabled={disabled}
          onClick={handleSuiConnect}
          className="liq-rounded-lg liq-font-semibold liq-transition-colors liq-duration-200 disabled:liq-opacity-50 liq-bg-neutral-750 !liq-text-primary-200 hover:enabled:liq-bg-primary liq-px-2"
        >
          <div className="liq-flex liq-items-center">
            <div className="liq-flex liq-justify-center liq-gap-2">
              <div>{account.isConnecting ? 'Connecting...' : 'Connect'}</div>
              <img
                src={activeChain?.pngUrl}
                alt=""
                className="liq-w-4 liq-rounded-full"
              />
              <div className="liq-truncate md:liq-text-clip">
                {getDisplayName(activeChain)}
              </div>
            </div>
          </div>
        </button>
      </>
    );
  }

  // Default: EVM connect
  return (
    <SwitchChainButton
      disabled={disabled}
      className="liq-rounded-lg liq-font-semibold liq-transition-colors liq-duration-200 disabled:liq-opacity-50 liq-bg-neutral-750 !liq-text-primary-200 hover:enabled:liq-bg-primary liq-px-2"
    >
      <div className="liq-flex liq-items-center">
        <div className="liq-flex liq-justify-center liq-gap-2">
          <div>{account.isConnecting ? 'Connecting...' : 'Connect'}</div>
          <img src={activeChain?.pngUrl} alt="" className="liq-w-4" />
          <div className="liq-truncate md:liq-text-clip">
            {getDisplayName(activeChain)}
          </div>
        </div>
      </div>
    </SwitchChainButton>
  );
};

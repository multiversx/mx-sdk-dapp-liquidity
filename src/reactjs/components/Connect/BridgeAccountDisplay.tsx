import { faPowerOff } from '@fortawesome/free-solid-svg-icons/faPowerOff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDisconnect } from '@reown/appkit/react';
import { getDisplayName } from 'helpers/getDisplayName';
import { SwitchChainButton } from './SwitchChainButton';
import { ChainDTO } from '../../../dto/Chain.dto';
import { ChainType } from '../../../types/chainType';
import { useAccount } from '../../hooks/useAccount';
import { useNamespaceAddress } from '../../hooks/useNamespaceAddress';
import { useSuiConnect } from '../../hooks/useSuiConnect';
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
  const suiConnect = useSuiConnect();
  // Namespace-scoped: returns EVM address for evm chains, SUI address for sui chains,
  // undefined for sol/btc (falls back to account.address which wagmi manages for those).
  const namespaceAddress = useNamespaceAddress(activeChain?.chainType);

  const isSuiChain = activeChain?.chainType === ChainType.sui;
  const isNamespacedChain =
    activeChain?.chainType === ChainType.evm ||
    activeChain?.chainType === ChainType.sui;
  // For EVM/SUI never fall back to the namespace-less account.address — it can carry
  // a stale cross-chain address (e.g. SUI address persisting after switching to EVM).
  // SOL/BTC are not managed by AppKit namespaces so the generic fallback is safe there.
  const displayAddress = isNamespacedChain
    ? namespaceAddress
    : namespaceAddress ?? account.address;

  const handleDisconnect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      if (isSuiChain) {
        await suiConnect.disconnect();
      } else {
        await disconnect();
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  if (displayAddress) {
    return (
      <>
        <img
          src={activeChain?.pngUrl}
          alt=""
          className="liq-w-6 liq-h-6 liq-rounded-lg"
        />
        <span className="liq-truncate liq-text-gray-400">
          {getDisplayName(activeChain)}
        </span>
        <span className="liq-ml-[-5px]">:</span>
        <div className="liq-flex liq-items-center liq-justify-between">
          <div className="liq-flex liq-max-w-[10rem] liq-items-center liq-gap-1">
            <MxLink
              to={`${activeChain?.blockExplorerUrls?.[0]}/address/${displayAddress}`}
              target="_blank"
              showExternalIcon={false}
              className="!liq-relative"
            >
              <div className="liq-flex liq-min-w-0 liq-flex-grow liq-overflow-hidden liq-leading-none liq-max-w-[10rem]">
                <TrimAddress
                  address={displayAddress}
                  data-testid="evm-address"
                />
              </div>
            </MxLink>
            <CopyButton
              text={displayAddress}
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

  if (isSuiChain) {
    return (
      <div className="liq-flex liq-max-w-full liq-items-center liq-gap-2">
        <button
          disabled={disabled || suiConnect.isConnecting}
          onClick={() => suiConnect.connect()}
          className="liq-rounded-lg liq-font-semibold liq-transition-colors liq-duration-200 disabled:liq-opacity-50 liq-bg-neutral-750 !liq-text-primary-200 hover:enabled:liq-bg-primary liq-px-2"
        >
          <div className="liq-flex liq-items-center">
            <div className="liq-flex liq-justify-center liq-items-center liq-gap-2">
              <div>{suiConnect.isConnecting ? 'Connecting...' : 'Connect'}</div>
              <img
                src={activeChain?.pngUrl}
                alt=""
                className="liq-w-4 liq-h-4 liq-rounded-sm"
              />
              <div className="liq-truncate md:liq-text-clip">
                {getDisplayName(activeChain)}
              </div>
            </div>
          </div>
        </button>
        {suiConnect.isConnecting && (
          <button
            type="button"
            onClick={() => void suiConnect.cancelPendingConnection()}
            className="liq-shrink-0 liq-rounded-lg liq-px-2 liq-py-1 liq-text-xs liq-font-medium liq-text-neutral-400 hover:liq-text-white"
          >
            Cancel
          </button>
        )}
      </div>
    );
  }

  return (
    <SwitchChainButton
      disabled={disabled}
      chainType={activeChain?.chainType}
      className="liq-rounded-lg liq-font-semibold liq-transition-colors liq-duration-200 disabled:liq-opacity-50 liq-bg-neutral-750 !liq-text-primary-200 hover:enabled:liq-bg-primary liq-px-2"
    >
      <div className="liq-flex liq-items-center">
        <div className="liq-flex liq-justify-center liq-items-center liq-gap-2">
          <div>{account.isConnecting ? 'Connecting...' : 'Connect'}</div>
          <img
            src={activeChain?.pngUrl}
            alt=""
            className="liq-w-4 liq-h-4 liq-rounded-sm"
          />
          <div className="liq-truncate md:liq-text-clip">
            {getDisplayName(activeChain)}
          </div>
        </div>
      </div>
    </SwitchChainButton>
  );
};

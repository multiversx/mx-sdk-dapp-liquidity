import { faPowerOff } from '@fortawesome/free-solid-svg-icons/faPowerOff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDisconnect } from '@reown/appkit/react';
import { useEffect } from 'react';
import { useSignMessage } from 'wagmi';
import { SwitchChainButton } from './SwitchChainButton';
import { ChainDTO } from '../../../dto/Chain.dto';
import { useAccount } from '../../hooks/useAccount';
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
  const { signMessageAsync } = useSignMessage();

  const handleDisconnect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const checkIfHasOwnership = async () => {
    if (account.address) {
      const { isAssociated } = await new Promise<{ isAssociated: boolean }>(
        (resolve) =>
          setTimeout(
            () =>
              resolve({
                isAssociated: true
              }),
            100
          )
      );

      return isAssociated;
    }

    return false;
  };

  const validateOwnership = async () => {
    if (account.address) {
      const hasOwnership = await checkIfHasOwnership();

      if (!hasOwnership) {
        const signature = await signMessageAsync({
          message: 'Please sign the message to proceed with the transaction'
        });
        console.log('signature = ', signature);
      }
    }
  };

  useEffect(() => {
    if (account.address) {
      validateOwnership();
    }
  }, [account.address]);

  return (
    <>
      {account.address && (
        <>
          <img src={activeChain?.svgUrl} alt="" className="liq-w-6" />
          <span className="liq-truncate liq-text-gray-400">
            {activeChain?.networkName}
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
                  <TrimAddress address={account.address} />
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
          className="liq-rounded-lg liq-font-semibold liq-transition-colors liq-duration-200 disabled:liq-opacity-50 liq-bg-neutral-750 !liq-text-primary-200 hover:enabled:liq-bg-primary liq-px-2"
        >
          <div className="liq-flex liq-items-center">
            <div className="liq-flex liq-justify-center liq-gap-2">
              <div> {account.isConnecting ? 'Connecting...' : 'Connect'} </div>
              <img src={activeChain?.svgUrl} alt="" className="liq-w-4" />
              <div className="liq-truncate md:liq-text-clip">
                {activeChain?.networkName}
              </div>
            </div>
          </div>
        </SwitchChainButton>
      )}
    </>
  );
};

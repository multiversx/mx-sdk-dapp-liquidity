import { faPowerOff } from '@fortawesome/free-solid-svg-icons/faPowerOff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDisconnect } from '@reown/appkit/react';
import { useCallback, useEffect } from 'react';
import { checkAccount } from 'api/checkAccount';
import { getDisplayName } from 'helpers/getDisplayName';
import { SwitchChainButton } from './SwitchChainButton';
import { ChainDTO } from '../../../dto/Chain.dto';
import { getApiURL } from '../../../helpers';
import { useWeb3App } from '../../context/useWeb3App';
import { useGetChainId } from '../../hooks';
import { useAccount } from '../../hooks/useAccount';
import { useGenericSignMessage } from '../../hooks/useGenericSignMessage';
import { useLinkAccountMutation } from '../../queries/useLinkAccount.mutation';
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
  const chainId = useGetChainId();
  const { signMessage } = useGenericSignMessage();
  const { nativeAuthToken } = useWeb3App();

  const { mutateAsync: linkAccount } = useLinkAccountMutation();

  const handleDisconnect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const validateOwnership = useCallback(async () => {
    if (account.address && chainId) {
      try {
        const { data: ownership } = await checkAccount({
          url: getApiURL(),
          walletAddress: account.address,
          chainId: chainId ? chainId.toString() : '',
          nativeAuthToken
        });

        if (!ownership?.isLinked) {
          try {
            const signature = await signMessage(
              ownership?.signMessage ?? 'Missing message'
            );

            await linkAccount({
              nativeAuthToken: nativeAuthToken ?? '',
              body: {
                chainId: chainId ? chainId.toString() : '',
                address: account.address,
                signature,
                message: ownership?.signMessage ?? ''
              }
            });
          } catch (error) {
            console.error('Failed to link account:', error);
          }
        }
      } catch (error) {
        console.error('Failed to check account:', error);
        return;
      }
    }
  }, [account.address, chainId, nativeAuthToken]);

  useEffect(() => {
    validateOwnership();
  }, [account.address]);

  return (
    <>
      {account.address && (
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
              <img src={activeChain?.pngUrl} alt="" className="liq-w-4" />
              <div className="liq-truncate md:liq-text-clip">
                {getDisplayName(activeChain)}
              </div>
            </div>
          </div>
        </SwitchChainButton>
      )}
    </>
  );
};

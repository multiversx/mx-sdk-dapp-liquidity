import { faPowerOff } from '@fortawesome/free-solid-svg-icons/faPowerOff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AccountAddress } from './AccountAddress';
import { CopyButton } from './CopyButton';
import { MxLink } from './MxLink';

export const MvxAccountDisplay = ({
  accountExplorerUrl,
  chainIcon,
  accountAddress,
  username,
  showTag,
  onDisconnect,
  onConnect
}: {
  accountExplorerUrl: string;
  chainIcon: string;
  accountAddress?: string;
  username?: string;
  showTag?: boolean;
  onDisconnect?: () => void;
  onConnect?: () => void;
}) => {
  const handleConnect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onConnect?.();
  };

  const handleDisconnect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onDisconnect?.();
  };

  return (
    <>
      {accountAddress && (
        <>
          <img src={chainIcon} alt="" className="liq-w-6" />
          <span className="liq-truncate liq-text-gray-400">MultiversX:</span>
          <div className="liq-flex liq-items-center liq-justify-between">
            <div className="liq-flex liq-max-w-[10rem] liq-items-center liq-gap-1">
              <MxLink
                to={`${accountExplorerUrl}`}
                target="_blank"
                showExternalIcon={false}
                className="!liq-relative"
              >
                <AccountAddress
                  address={accountAddress}
                  username={username}
                  showTag={showTag}
                />
              </MxLink>

              <CopyButton text={accountAddress} className="liq-text-sm" />
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
      {!accountAddress && (
        <button
          type="button"
          className="liq-rounded-lg liq-font-semibold liq-transition-colors liq-duration-200 disabled:liq-opacity-50 liq-bg-neutral-750 liq-text-primary-200 hover:enabled:liq-bg-primary liq-px-2"
          onClick={handleConnect}
        >
          <div className="liq-flex liq-justify-center liq-gap-2">
            <div>Connect </div>
            <img src={chainIcon} alt="" className="liq-w-4" />
            <div>MultiversX</div>
          </div>
        </button>
      )}
    </>
  );
};

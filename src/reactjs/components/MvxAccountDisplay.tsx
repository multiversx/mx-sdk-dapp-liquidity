import { AccountAddress } from './AccountAddress';
import { CopyButton } from './CopyButton';
import { MxLink } from './MxLink';

export const MvxAccountDisplay = ({
  accountExplorerUrl,
  accountAddress,
  username,
  showTag,
  TrimAddressComponent
}: {
  accountExplorerUrl: string;
  accountAddress?: string;
  username?: string;
  showTag?: boolean;
  TrimAddressComponent: (props: {
    text: string;
    color?: 'muted' | 'secondary' | string;
    className?: string;
  }) => JSX.Element;
}) => {
  return (
    <div className="liq-flex liq-gap-2">
      To
      <img
        src="https://cdn.prod.website-files.com/6597cc7be68d63ec0c8ce338/659fac9b8d96a7bdeced582c_X-Favicon-256.png"
        alt="MultiversX"
        className="liq-w-6"
      />
      {accountAddress && (
        <div className="liq-flex liq-items-center liq-justify-between liq-gap-2">
          <div className="liq-flex liq-max-w-[10rem] liq-items-center liq-gap-1">
            <MxLink
              to={`${accountExplorerUrl}`}
              target="_blank"
              showExternalIcon={false}
            >
              <AccountAddress
                address={accountAddress}
                username={username}
                showTag={showTag}
                TrimAddressComponent={TrimAddressComponent}
              />
            </MxLink>

            <CopyButton text={accountAddress} className="liq-text-sm" />
          </div>
        </div>
      )}
    </div>
  );
};

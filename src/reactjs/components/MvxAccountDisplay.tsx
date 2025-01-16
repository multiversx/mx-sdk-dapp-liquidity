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
    <div className="flex gap-2">
      To
      <img
        src="https://cdn.prod.website-files.com/6597cc7be68d63ec0c8ce338/659fac9b8d96a7bdeced582c_X-Favicon-256.png"
        alt="MultiversX"
        className="w-6"
      />
      {accountAddress && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex max-w-[10rem] items-center gap-1">
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

            <CopyButton text={accountAddress} className="text-sm" />
          </div>
        </div>
      )}
    </div>
  );
};

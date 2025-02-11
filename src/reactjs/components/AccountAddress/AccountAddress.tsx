import { mxClsx } from '../../utils/mxClsx';

export const AccountAddress = ({
  address,
  username,
  showTag = true,
  className = '',
  TrimAddressComponent
}: {
  address: string;
  username?: string;
  showTag?: boolean;
  className?: string;
  TrimAddressComponent: (props: {
    text: string;
    color?: 'muted' | 'secondary' | string;
    className?: string;
  }) => JSX.Element;
}) => {
  const heroTag = username ? `@${username.replace('.elrond', '')}` : undefined;

  return (
    <div
      className={mxClsx(
        'liq-flex liq-min-w-0 liq-flex-grow liq-overflow-hidden liq-leading-none liq-max-w-[10rem]',
        className
      )}
    >
      {heroTag && showTag ? (
        <div className="liq-truncate liq-text-left liq-text-neutral-100">
          {heroTag}
        </div>
      ) : (
        <TrimAddressComponent text={address} className="liq-text-neutral-100" />
      )}
    </div>
  );
};

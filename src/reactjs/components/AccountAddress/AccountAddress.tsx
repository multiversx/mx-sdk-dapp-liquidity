import { mxClsx } from '../../utils/mxClsx';

export const AccountAddress = ({
  address,
  username,
  showTag = true,
  className = ''
}: {
  address: string;
  username?: string;
  showTag?: boolean;
  className?: string;
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
        <div className="liq-truncate liq-text-left liq-text-neutral-100 uppercase">
          {heroTag}
        </div>
      ) : (
        <div className="liq-truncate liq-text-left liq-text-neutral-100 uppercase liq-flex liq-gap-1">
          <span>{address.slice(0, 4)}</span>
          <span>...</span>
          <span>{address.slice(-5)}</span>
        </div>
      )}
    </div>
  );
};

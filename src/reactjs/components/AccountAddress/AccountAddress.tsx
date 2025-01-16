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
        'flex min-w-0 flex-grow overflow-hidden leading-none',
        className
      )}
    >
      {heroTag && showTag ? (
        <div className="truncate text-left text-neutral-100">{heroTag}</div>
      ) : (
        <TrimAddressComponent text={address} />
      )}
    </div>
  );
};

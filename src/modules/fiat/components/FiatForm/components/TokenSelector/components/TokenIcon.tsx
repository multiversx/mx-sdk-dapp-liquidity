import { mxClsx } from 'reactjs';
import { TokenType } from 'types/token';

export type TokenIconSize =
  | 'xs'
  | '2xs'
  | 'sm'
  | '2sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl';

export const TokenIcon = ({
  token,
  size = 'lg',
  className = ''
}: {
  className?: string;
  size?: TokenIconSize;
  token?: TokenType;
}) => {
  return (
    <div
      className={mxClsx(
        'liq-flex-shrink-0 liq-overflow-hidden liq-rounded-full',
        {
          'liq-h-4 liq-w-4': size === 'xs',
          'liq-h-5 liq-w-5': size === '2xs',
          'liq-h-6 liq-w-6': size === 'sm',
          'liq-h-7 liq-w-7': size === '2sm',
          'liq-h-8 liq-w-8': size === 'md',
          'liq-h-10 liq-w-10': size === 'lg',
          'liq-h-12 liq-w-12': size === 'xl',
          'liq-h-14 liq-w-14': size === '2xl',
          'liq-h-16 liq-w-16': size === '3xl'
        },
        className
      )}
    >
      <div
        className={mxClsx(
          {
            'liq-h-4 liq-w-4': size === 'xs',
            'liq-h-5 liq-w-5': size === '2xs',
            'liq-h-6 liq-w-6': size === 'sm',
            'liq-h-7 liq-w-7': size === '2sm',
            'liq-h-8 liq-w-8': size === 'md',
            'liq-h-10 liq-w-10': size === 'lg',
            'liq-h-12 liq-w-12': size === 'xl',
            'liq-h-14 liq-w-14': size === '2xl',
            'liq-h-16 liq-w-16': size === '3xl'
          },
          className
        )}
      >
        <img
          src={token?.svgUrl}
          alt=""
          className="liq-asset-icon liq-sm liq-p-0"
        />
      </div>
    </div>
  );
};

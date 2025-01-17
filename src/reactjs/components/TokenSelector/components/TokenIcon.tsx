import { faDiamond } from '@fortawesome/free-solid-svg-icons/faDiamond';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useMemo } from 'react';
import { TokenType } from '../../../../types/token';
import DefaultIcon from '../../../assets/default.svg';
import { mxClsx } from '../../../utils/mxClsx';

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
  const getIconComponent = useCallback(
    (assetTicker?: string) => {
      if (!assetTicker || !token) {
        return <img src={DefaultIcon} alt="" />;
      }

      return token.svgUrl && token.svgUrl !== '' ? (
        <img
          src={token.svgUrl}
          alt={assetTicker.split('-')[0]}
          className="asset-icon sm p-0"
        />
      ) : (
        <img src={DefaultIcon} alt="" />
      );
    },
    [token]
  );

  const IconComponent = useMemo(
    () => getIconComponent(token?.symbol),
    [getIconComponent, token?.symbol]
  );

  return (
    <div
      className={mxClsx(
        'flex-shrink-0 overflow-hidden rounded-full',
        {
          'h-4 w-4': size === 'xs',
          'h-5 w-5': size === '2xs',
          'h-6 w-6': size === 'sm',
          'h-7 w-7': size === '2sm',
          'h-8 w-8': size === 'md',
          'h-10 w-10': size === 'lg',
          'h-12 w-12': size === 'xl',
          'h-14 w-14': size === '2xl',
          'h-16 w-16': size === '3xl'
        },
        className
      )}
    >
      <>
        {IconComponent ? (
          <div
            className={mxClsx(
              {
                'h-4 w-4': size === 'xs',
                'h-5 w-5': size === '2xs',
                'h-6 w-6': size === 'sm',
                'h-7 w-7': size === '2sm',
                'h-8 w-8': size === 'md',
                'h-10 w-10': size === 'lg',
                'h-12 w-12': size === 'xl',
                'h-14 w-14': size === '2xl',
                'h-16 w-16': size === '3xl'
              },
              className
            )}
          >
            {IconComponent}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-black p-1">
            <FontAwesomeIcon icon={faDiamond} className="text-neutral-500" />
          </div>
        )}
      </>
    </div>
  );
};

import { HTMLProps, Ref, forwardRef } from 'react';
import { mxClsx } from '../../utils/mxClsx';

export type MxCardSizeType = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type MxCardVariantType =
  | 'primary'
  | 'primary-300'
  | 'neutral-650'
  | 'neutral-750'
  | 'neutral-800'
  | 'neutral-850'
  | 'neutral-900'
  | 'transparent'
  | 'warning'
  | 'danger';

interface MxCardType extends HTMLProps<HTMLDivElement> {
  cardSize?: MxCardSizeType;
  variant?: MxCardVariantType;
}

export const MxCard = forwardRef(
  (props: MxCardType, ref: Ref<HTMLDivElement>) => {
    const {
      children,
      cardSize = 'md',
      className = '',
      variant = 'neutral-850',
      ...rest
    } = props;

    return (
      <div
        ref={ref}
        {...rest}
        className={mxClsx(
          `liq-rounded-2xl liq-transition-colors liq-duration-200`,
          {
            'liq-bg-primary': variant === 'primary',
            'liq-bg-primary-300 liq-bg-opacity-5': variant === 'primary-300'
          },
          {
            'liq-bg-neutral-650/50': variant === 'neutral-650',
            'liq-bg-neutral-750/50': variant === 'neutral-750',
            'liq-bg-neutral-800/50': variant === 'neutral-800',
            'liq-bg-neutral-850/50': variant === 'neutral-850',
            'liq-bg-neutral-900/50': variant === 'neutral-900'
          },
          {
            'liq-border liq-border-neutral-750 liq-bg-transparent':
              variant === 'transparent'
          },
          {
            'liq-bg-warning liq-bg-opacity-5': variant === 'warning',
            'liq-bg-danger liq-bg-opacity-5': variant === 'danger'
          },
          {
            'liq-p-1': cardSize === 'xs',
            'liq-px-4 liq-py-1': cardSize === 'sm',
            'liq-p-4': cardSize === 'md',
            'liq-p-5 lg:liq-p-6': cardSize === 'lg',
            'liq-p-5 md:liq-p-10': cardSize === 'xl'
          },
          className
        )}
      >
        {children}
      </div>
    );
  }
);

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
          `rounded-2xl transition-colors duration-200`,
          {
            'bg-primary': variant === 'primary',
            'bg-primary-300 bg-opacity-5': variant === 'primary-300'
          },
          {
            'bg-neutral-650/50': variant === 'neutral-650',
            'bg-neutral-750/50': variant === 'neutral-750',
            'bg-neutral-800/50': variant === 'neutral-800',
            'bg-neutral-850/50': variant === 'neutral-850',
            'bg-neutral-900/50': variant === 'neutral-900'
          },
          {
            'border border-neutral-750 bg-transparent':
              variant === 'transparent'
          },
          {
            'bg-warning bg-opacity-5': variant === 'warning',
            'bg-danger bg-opacity-5': variant === 'danger'
          },
          {
            'p-1': cardSize === 'xs',
            'px-4 py-1': cardSize === 'sm',
            'p-4': cardSize === 'md',
            'p-5 lg:p-6': cardSize === 'lg',
            'p-5 md:p-10': cardSize === 'xl'
          },
          className
        )}
      >
        {children}
      </div>
    );
  }
);

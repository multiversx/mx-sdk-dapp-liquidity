import { HTMLProps } from 'react';
import { mxClsx } from '../../utils/mxClsx';

export type MxButtonSizeType = 'xs' | 'sm' | 'md' | 'lg';
export type MxButtonVariantType =
  | 'primary'
  | 'primary-300'
  | 'primary-50'
  | 'success'
  | 'danger'
  | 'danger-600'
  | 'neutral-400'
  | 'neutral-600'
  | 'neutral-700'
  | 'neutral-750'
  | 'neutral-800'
  | 'neutral-850'
  | 'link-neutral-100'
  | 'link-neutral-200'
  | 'link-neutral-300'
  | 'link-neutral-400'
  | 'link-neutral-500'
  | 'link-primary-300'
  | 'transparent'
  | 'translucent';

interface MxButtonType extends HTMLProps<HTMLButtonElement> {
  isLoading?: boolean;
  isProcessing?: boolean;
  btnSize?: MxButtonSizeType;
  variant?: MxButtonVariantType;
  type?: HTMLButtonElement['type']; // typescript fix
}

export const MxButton = ({
  children,
  disabled,
  isLoading,
  isProcessing,
  className = '',
  btnSize = 'md',
  type = 'button',
  variant = 'primary',
  ...rest
}: MxButtonType) => {
  const disabledText = isLoading
    ? 'Loading...'
    : isProcessing
      ? 'Processing...'
      : undefined;

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || isLoading || isProcessing}
      className={mxClsx(
        // base style
        'focus-primary rounded-xl font-semibold transition-colors duration-200 disabled:opacity-50',
        // normal btn
        {
          'bg-primary text-primary-50 hover:enabled:bg-primary-700/80':
            variant === 'primary',
          'bg-primary-300 text-primary-950 hover:enabled:bg-primary-200':
            variant === 'primary-300',
          'bg-primary-50 text-primary-950 hover:enabled:bg-primary-200':
            variant === 'primary-50',
          'bg-success-700 text-success-50 hover:enabled:bg-success-600':
            variant === 'success',
          'bg-danger text-danger-50 hover:enabled:bg-danger-300':
            variant === 'danger',
          'bg-danger-600 text-danger-50 hover:enabled:bg-danger-500':
            variant === 'danger-600',
          'bg-neutral-400 text-neutral-50 hover:enabled:bg-neutral-300':
            variant === 'neutral-400',
          'bg-neutral-600 text-neutral-50 hover:enabled:bg-neutral-500':
            variant === 'neutral-600',

          'bg-neutral-700 text-neutral-50 hover:enabled:bg-neutral-600':
            variant === 'neutral-700',
          'bg-neutral-750 text-neutral-50 hover:enabled:bg-neutral-650':
            variant === 'neutral-750',
          'bg-neutral-800 text-neutral-50 hover:enabled:bg-neutral-700':
            variant === 'neutral-800',
          'bg-neutral-850 text-neutral-50 hover:enabled:bg-neutral-750':
            variant === 'neutral-850',
          'bg-white/5 text-neutral-50 hover:enabled:bg-white/10':
            variant === 'translucent'
        },
        // link btn
        {
          'text-neutral-100 hover:enabled:text-white':
            variant === 'link-neutral-100',
          'text-neutral-200 hover:enabled:text-white':
            variant === 'link-neutral-200',
          'text-neutral-300 hover:enabled:text-white':
            variant === 'link-neutral-300',
          'text-neutral-400 hover:enabled:text-white':
            variant === 'link-neutral-400',
          'text-neutral-500 hover:enabled:text-white':
            variant === 'link-neutral-500',
          'text-primary-300 hover:enabled:text-white':
            variant === 'link-primary-300'
        },
        {
          'border border-neutral-750 bg-transparent hover:enabled:bg-neutral-800':
            variant === 'transparent'
        },
        // size
        {
          'px-2 py-1 text-xs': btnSize === 'xs',
          'px-2 py-1': btnSize === 'sm',
          'px-4 py-2': btnSize === 'md',
          'px-8 py-3': btnSize === 'lg'
        },

        // external
        className
      )}
    >
      {disabledText && <span className="animate-pulse">{disabledText}</span>}
      {!disabledText && <>{children}</>}
    </button>
  );
};

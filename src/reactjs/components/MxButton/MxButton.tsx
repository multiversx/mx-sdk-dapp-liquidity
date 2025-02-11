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
        'focus-primary liq-rounded-xl liq-font-semibold liq-transition-colors liq-duration-200 disabled:liq-opacity-50',
        // normal btn
        {
          'liq-bg-primary liq-text-primary-50 hover:enabled:liq-bg-primary-700/80':
            variant === 'primary',
          'liq-bg-primary-300 liq-text-primary-950 hover:enabled:liq-bg-primary-200':
            variant === 'primary-300',
          'liq-bg-primary-50 liq-text-primary-950 hover:enabled:liq-bg-primary-200':
            variant === 'primary-50',
          'liq-bg-success-700 liq-text-success-50 hover:enabled:liq-bg-success-600':
            variant === 'success',
          'liq-bg-danger liq-text-danger-50 hover:enabled:liq-bg-danger-300':
            variant === 'danger',
          'liq-bg-danger-600 liq-text-danger-50 hover:enabled:liq-bg-danger-500':
            variant === 'danger-600',
          'liq-bg-neutral-400 liq-text-neutral-50 hover:enabled:liq-bg-neutral-300':
            variant === 'neutral-400',
          'liq-bg-neutral-600 liq-text-neutral-50 hover:enabled:liq-bg-neutral-500':
            variant === 'neutral-600',

          'liq-bg-neutral-700 liq-text-neutral-50 hover:enabled:liq-bg-neutral-600':
            variant === 'neutral-700',
          'liq-bg-neutral-750 liq-text-neutral-50 hover:enabled:liq-bg-neutral-650':
            variant === 'neutral-750',
          'liq-bg-neutral-800 liq-text-neutral-50 hover:enabled:liq-bg-neutral-700':
            variant === 'neutral-800',
          'liq-bg-neutral-850 liq-text-neutral-50 hover:enabled:liq-bg-neutral-750':
            variant === 'neutral-850',
          'liq-bg-white/5 liq-text-neutral-50 hover:enabled:liq-bg-white/10':
            variant === 'translucent'
        },
        // link btn
        {
          'liq-text-neutral-100 hover:enabled:liq-text-white':
            variant === 'link-neutral-100',
          'liq-text-neutral-200 hover:enabled:liq-text-white':
            variant === 'link-neutral-200',
          'liq-text-neutral-300 hover:enabled:liq-text-white':
            variant === 'link-neutral-300',
          'liq-text-neutral-400 hover:enabled:liq-text-white':
            variant === 'link-neutral-400',
          'liq-text-neutral-500 hover:enabled:liq-text-white':
            variant === 'link-neutral-500',
          'liq-text-primary-300 hover:enabled:liq-text-white':
            variant === 'link-primary-300'
        },
        {
          'liq-border liq-border-neutral-750 liq-bg-transparent hover:enabled:liq-bg-neutral-800':
            variant === 'transparent'
        },
        // size
        {
          'liq-px-2 liq-py-1 liq-text-xs': btnSize === 'xs',
          'liq-px-2 liq-py-1': btnSize === 'sm',
          'liq-px-4 liq-py-2': btnSize === 'md',
          'liq-px-8 liq-py-3': btnSize === 'lg'
        },

        // external
        className
      )}
    >
      {disabledText && (
        <span className="liq-animate-pulse">{disabledText}</span>
      )}
      {!disabledText && <>{children}</>}
    </button>
  );
};

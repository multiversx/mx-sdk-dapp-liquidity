import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons/faArrowUpRightFromSquare';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Ref, forwardRef } from 'react';
import { LinkProps, Link } from 'react-router-dom';
import { mxClsx } from '../../utils/mxClsx';

export type MxLinkVariantType =
  | 'primary-300'
  | 'green-300'
  | 'neutral-100'
  | 'neutral-200'
  | 'neutral-300'
  | 'neutral-400'
  | 'neutral-500'
  | 'neutral-750'
  | 'button-neutral-50'
  | 'button-neutral-600'
  | 'button-neutral-700'
  | 'button-neutral-750'
  | 'button-neutral-800'
  | 'button-neutral-850'
  | 'button-primary'
  | 'button-primary-300'
  | 'button-translucent';

interface MxLinkType extends LinkProps {
  disabled?: boolean;
  showExternalIcon?: boolean;
  variant?: MxLinkVariantType;
}

export const MxLink = forwardRef(
  (props: MxLinkType, ref: Ref<HTMLAnchorElement>) => {
    const {
      disabled,
      children,
      className,
      showExternalIcon = true,
      variant = 'neutral-100',
      ...rest
    } = props;
    const isExternal = Boolean(rest.target);
    const rel = isExternal ? 'noopener noreferrer nofollow' : undefined;

    return (
      <Link
        ref={ref}
        {...rest}
        {...(rel ? { rel } : {})}
        className={mxClsx(
          'focus-primary liq-rounded-xl liq-font-semibold liq-no-underline liq-transition-colors liq-duration-200',
          {
            'liq-text-primary-300 hover:liq-text-primary-200':
              variant === 'primary-300',
            'liq-text-green-300 hover:liq-text-green-200':
              variant === 'green-300',
            'liq-text-neutral-100 hover:liq-text-white':
              variant === 'neutral-100',
            'liq-text-neutral-200 hover:liq-text-white':
              variant === 'neutral-200',
            'liq-text-neutral-300 hover:liq-text-white':
              variant === 'neutral-300',
            'liq-text-neutral-400 hover:liq-text-white':
              variant === 'neutral-400',
            'liq-text-neutral-500 hover:liq-text-white':
              variant === 'neutral-500',
            'liq-text-neutral-750 hover:liq-text-white':
              variant === 'neutral-750'
          },
          // button
          {
            'liq-bg-neutral-600 liq-px-4 liq-py-2 liq-text-center hover:liq-bg-neutral-500':
              variant === 'button-neutral-600',
            'liq-bg-neutral-700 liq-px-4 liq-py-2 liq-text-center hover:liq-bg-[#3B3D48] hover:liq-bg-opacity-80':
              variant === 'button-neutral-700',
            'liq-bg-neutral-750 liq-px-4 liq-py-2 liq-text-center hover:liq-bg-neutral-650':
              variant === 'button-neutral-750',
            'liq-bg-neutral-800 liq-px-4 liq-py-2 liq-text-center hover:liq-bg-neutral-700':
              variant === 'button-neutral-800',
            'liq-bg-neutral-850 liq-px-4 liq-py-2 liq-text-center hover:liq-bg-neutral-800':
              variant === 'button-neutral-850',
            'liq-bg-primary liq-px-4 liq-py-2 liq-text-center hover:liq-bg-[#1E65E7] hover:liq-bg-opacity-80':
              variant === 'button-primary',
            'liq-bg-primary-300 liq-px-4 liq-py-2 liq-text-center liq-text-black hover:liq-bg-primary-200':
              variant === 'button-primary-300',
            'liq-bg-neutral-50 liq-px-4 liq-py-2 liq-text-center liq-text-black hover:liq-bg-opacity-80':
              variant === 'button-neutral-50',
            'liq-bg-white/5 liq-px-4 liq-py-2 liq-text-center liq-text-neutral-50 hover:liq-bg-white/10':
              variant === 'button-translucent'
          },
          { 'liq-flex liq-items-center': isExternal && showExternalIcon },
          { 'liq-pointer-events-none liq-opacity-50': disabled },
          className
        )}
      >
        {children}
        {isExternal && showExternalIcon && (
          <FontAwesomeIcon
            size="sm"
            icon={faArrowUpRightFromSquare}
            className="liq-ml-1"
          />
        )}
      </Link>
    );
  }
);

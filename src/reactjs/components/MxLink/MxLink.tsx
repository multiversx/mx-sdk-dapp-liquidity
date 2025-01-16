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
          'focus-primary rounded-xl font-semibold no-underline transition-colors duration-200',
          {
            'text-primary-300 hover:text-primary-200':
              variant === 'primary-300',
            'text-green-300 hover:text-green-200': variant === 'green-300',
            'text-neutral-100 hover:text-white': variant === 'neutral-100',
            'text-neutral-200 hover:text-white': variant === 'neutral-200',
            'text-neutral-300 hover:text-white': variant === 'neutral-300',
            'text-neutral-400 hover:text-white': variant === 'neutral-400',
            'text-neutral-500 hover:text-white': variant === 'neutral-500',
            'text-neutral-750 hover:text-white': variant === 'neutral-750'
          },
          // button
          {
            'bg-neutral-600 px-4 py-2 text-center hover:bg-neutral-500':
              variant === 'button-neutral-600',
            'bg-neutral-700 px-4 py-2 text-center hover:bg-[#3B3D48] hover:bg-opacity-80':
              variant === 'button-neutral-700',
            'bg-neutral-750 px-4 py-2 text-center hover:bg-neutral-650':
              variant === 'button-neutral-750',
            'bg-neutral-800 px-4 py-2 text-center hover:bg-neutral-700':
              variant === 'button-neutral-800',
            'bg-neutral-850 px-4 py-2 text-center hover:bg-neutral-800':
              variant === 'button-neutral-850',
            'bg-primary px-4 py-2 text-center hover:bg-[#1E65E7] hover:bg-opacity-80':
              variant === 'button-primary',
            'bg-primary-300 px-4 py-2 text-center text-black hover:bg-primary-200':
              variant === 'button-primary-300',
            'bg-neutral-50 px-4 py-2 text-center text-black hover:bg-opacity-80':
              variant === 'button-neutral-50',
            'bg-white/5 px-4 py-2 text-center text-neutral-50 hover:bg-white/10':
              variant === 'button-translucent'
          },
          { 'flex items-center': isExternal && showExternalIcon },
          { 'pointer-events-none opacity-50': disabled },
          className
        )}
      >
        {children}
        {isExternal && showExternalIcon && (
          <FontAwesomeIcon
            size="sm"
            icon={faArrowUpRightFromSquare}
            className="ml-1"
          />
        )}
      </Link>
    );
  }
);

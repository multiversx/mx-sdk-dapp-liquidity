import { forwardRef } from 'react';
import { mxClsx } from '../../../../utils/mxClsx';
import {
  MxTooltipVariantColorType,
  MxTooltipVariantType
} from '../../MxTooltip';

interface TooltipContainerProps {
  children: React.ReactNode;
  containerClassName: string;
  variant: MxTooltipVariantType;
  variantColor: MxTooltipVariantColorType;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const TooltipContainer = forwardRef<
  HTMLDivElement,
  TooltipContainerProps
>(({ children, variant, variantColor, containerClassName, onClick }, ref) => {
  return (
    <div
      role="tooltip"
      ref={ref}
      onClick={onClick}
      className={mxClsx(
        'focus-primary liq-relative liq-inline-block liq-max-w-fit liq-rounded-sm',
        {
          '': variant === 'default',
          'liq-border-b liq-underline': variant === 'underline',
          'liq-border-b liq-border-dashed': variant === 'dotted'
        },
        {
          'liq-border-neutral-200': variantColor === 'neutral-200',
          'liq-border-neutral-500': variantColor === 'neutral-500',
          'liq-border-primary-200 liq-text-primary-200':
            variantColor === 'primary-200',
          'liq-border-primary-300 liq-text-primary-300':
            variantColor === 'primary-300',
          'liq-border-primary-400 liq-text-primary-400':
            variantColor === 'primary-400'
        },
        containerClassName
      )}
    >
      {children}
    </div>
  );
});

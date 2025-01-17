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
        'focus-primary relative inline-block max-w-fit rounded-sm',
        {
          '': variant === 'default',
          'border-b underline': variant === 'underline',
          'border-b border-dashed': variant === 'dotted'
        },
        {
          'border-neutral-200': variantColor === 'neutral-200',
          'border-neutral-500': variantColor === 'neutral-500',
          'border-primary-200 text-primary-200': variantColor === 'primary-200',
          'border-primary-300 text-primary-300': variantColor === 'primary-300',
          'border-primary-400 text-primary-400': variantColor === 'primary-400'
        },
        containerClassName
      )}
    >
      {children}
    </div>
  );
});

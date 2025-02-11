import { CSSProperties, Dispatch, ReactNode, SetStateAction } from 'react';
import { mxClsx } from '../../../../utils/mxClsx';

interface TooltipContentProps {
  contentClassName: string;
  popperStyles: CSSProperties;
  popperAttributes?: {
    [key: string]: string;
  };
  children: ReactNode;
  setPopperEl: Dispatch<SetStateAction<HTMLDivElement | null>>;
}

export const TooltipContent = ({
  children,
  contentClassName,
  popperAttributes,
  popperStyles,
  setPopperEl
}: TooltipContentProps) => {
  return (
    <div
      role="tooltip"
      ref={setPopperEl}
      style={popperStyles}
      {...popperAttributes}
      className={mxClsx(
        'liq-z-20 liq-cursor-default liq-rounded-2xl liq-border liq-border-neutral-750 liq-bg-neutral-850 liq-p-4 liq-text-base liq-text-neutral-200',
        contentClassName
      )}
    >
      {children}
    </div>
  );
};

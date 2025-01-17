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
        'z-20 cursor-default rounded-2xl border border-neutral-750 bg-neutral-850 p-4 text-base text-neutral-200',
        contentClassName
      )}
    >
      {children}
    </div>
  );
};

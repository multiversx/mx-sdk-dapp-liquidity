import { ReactNode } from 'react';
import { MxCard } from './MxCard';
import { mxClsx } from '../utils/mxClsx';

export const EnterAmountCard = ({
  className,
  children
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <MxCard
      variant="neutral-750"
      className={mxClsx(
        'liq-flex liq-flex-col liq-gap-4 liq-outline liq-outline-transparent',
        className
      )}
    >
      {children}
    </MxCard>
  );
};

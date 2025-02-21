import { ReactNode } from 'react';
import { mxClsx } from '../../utils/mxClsx.ts';
import { MxCard } from '../base/MxCard';

export const AmountCard = ({
  className,
  children
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <MxCard
      cardSize="lg"
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

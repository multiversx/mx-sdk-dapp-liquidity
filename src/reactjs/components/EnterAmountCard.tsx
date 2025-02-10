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
      cardSize="lg"
      variant="neutral-750"
      className={mxClsx(
        'flex flex-col gap-4 outline outline-transparent',
        className
      )}
    >
      {children}
    </MxCard>
  );
};

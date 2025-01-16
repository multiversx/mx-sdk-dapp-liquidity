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
        'flex flex-col gap-4 outline outline-transparent focus-within:outline-neutral-700/75 hover:outline-neutral-700/55 hover:focus-within:outline-neutral-700/80',
        className
      )}
    >
      {children}
    </MxCard>
  );
};

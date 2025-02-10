import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { mxClsx } from '../../../utils/mxClsx';
import { MxButton } from '../../MxButton';
import { MxCard } from '../../MxCard';

export const SelectContainer = ({
  children,
  className,
  onClose
}: {
  className?: string;
  children?: ReactNode;
  onClose: () => void;
}) => {
  return (
    <MxCard
      className={mxClsx(
        'flex flex-col absolute left-0 top-0 order-1 mx-auto w-full gap-1 pt-12 lg:order-2 lg:max-w-[27.5rem] lg:pt-0 bg-neutral-850 z-50 p-2 pointer-events-auto',
        className
      )}
    >
      <div className={mxClsx('flex items-center justify-between px-2 pt-2')}>
        <div className="flex flex-1 items-center justify-center text-center text-lg">
          Select a token
        </div>
        <MxButton
          btnSize="md"
          className="border-none p-0"
          variant="link-neutral-500"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faClose} size="xl" />
        </MxButton>
      </div>

      <div className="flex flex-1 flex-col gap-1">{children}</div>
    </MxCard>
  );
};

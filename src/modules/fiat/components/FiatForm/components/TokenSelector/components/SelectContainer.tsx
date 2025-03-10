import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { MxButton, MxCard, mxClsx } from 'reactjs';

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
        'liq-flex liq-flex-col liq-absolute liq-left-0 liq-top-0 liq-order-1 liq-mx-auto liq-w-full liq-gap-1 liq-pt-12 lg:liq-order-2 lg:liq-max-w-[27.5rem] !liq-min-h-[26rem] !lg:liq-pt-0 !liq-bg-neutral-850 !liq-z-[15] !liq-p-2 !liq-pointer-events-auto',
        className
      )}
    >
      <div className={'liq-flex liq-items-center liq-justify-between'}>
        <div className="liq-flex liq-flex-1 liq-items-center liq-justify-center liq-text-center liq-text-lg">
          Select a token
        </div>
        <MxButton
          btnSize="md"
          className="liq-border-none !liq-px-2"
          variant="link-neutral-500"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faClose} size="xl" />
        </MxButton>
      </div>

      <div className="!liq-flex !liq-flex-1 !liq-flex-col !liq-gap-1">
        {children}
      </div>
    </MxCard>
  );
};

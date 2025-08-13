import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faRefresh } from '@fortawesome/free-solid-svg-icons/faRefresh';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { safeWindow } from '../../constants';
import { mxClsx } from '../../utils';
import { MxButton, MxCard } from '../base';

export const Error = ({
  error,
  className
}: {
  error?: ReactNode | string;
  className?: string;
}) => {
  const handleRetryClick = () => {
    safeWindow.location.reload();
  };

  return (
    <MxCard
      className={mxClsx(
        'liq-flex liq-flex-col liq-items-center liq-justify-center liq-gap-8 liq-px-8 liq-py-14',
        className
      )}
    >
      <div className="liq-flex liq-flex-col liq-gap-4 liq-text-center">
        <FontAwesomeIcon
          icon={faInfoCircle}
          size="3x"
          className="liq-bg-opacity-40 liq-text-white"
        />
        <span className="liq-font-medium liq-max-w-xs liq-text-xl liq-text-neutral-300">
          Unable to load data. Please wait a moment and try again.
        </span>

        {error && (
          <small className="liq-font-medium liq-max-w-xs liq-text-xl liq-text-neutral-500">
            {error}
          </small>
        )}
      </div>

      <MxButton
        variant="neutral-700"
        className="liq-flex liq-items-center liq-gap-3"
        onClick={handleRetryClick}
      >
        <FontAwesomeIcon icon={faRefresh} />
        <span className="liq-font-medium liq-text-white">Retry</span>
      </MxButton>
    </MxCard>
  );
};

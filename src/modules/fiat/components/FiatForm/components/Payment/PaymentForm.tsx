import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PaymentFrame } from './PaymentFrame.tsx';
import { MxCard, mxClsx, Error, MxButton } from '../../../../../../reactjs';
import { MxCircleLoader } from '../../../../../../reactjs/components/base/MxCircleLoader';

export const PaymentForm = ({
  frameContent,
  status,
  error,
  onStartOver
}: {
  frameContent: string;
  status: string | null;
  error: string | null;
  onStartOver?: () => void;
}) => {
  if (error) {
    return <Error error={error} />;
  }

  if (status === 'completed') {
    return (
      <MxCard
        className={mxClsx(
          'liq-flex liq-flex-col liq-items-center liq-justify-center liq-gap-8 liq-px-8 liq-py-14'
        )}
      >
        <div className="liq-flex liq-flex-col liq-gap-4 liq-text-center">
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="3x"
            className="liq-bg-opacity-40 liq-text-white"
          />
          <span className="liq-max-w-xs liq-text-xl liq-font-medium liq-text-neutral-300">
            Payment successful!
          </span>
        </div>

        <MxButton
          variant="neutral-700"
          className="liq-flex liq-items-center liq-gap-3"
          onClick={onStartOver}
        >
          <span className="liq-font-medium liq-text-white">
            Start new payment
          </span>
        </MxButton>
      </MxCard>
    );
  }

  if (status === 'failed') {
    return (
      <MxCard
        className={mxClsx(
          'liq-flex liq-flex-col liq-items-center liq-justify-center liq-gap-8 liq-px-8 liq-py-14'
        )}
      >
        <div className="flex flex-col gap-4 text-center">
          <FontAwesomeIcon
            icon={faInfoCircle}
            size="3x"
            className="bg-opacity-40 text-white"
          />
          <span className="max-w-xs text-xl font-medium text-neutral-300">
            Payment failed!
          </span>
        </div>

        <MxButton
          variant="neutral-700"
          className="flex items-center gap-3"
          onClick={onStartOver}
        >
          <span className="font-medium text-white">Try again</span>
        </MxButton>
      </MxCard>
    );
  }

  if (status === 'canceled') {
    return (
      <MxCard
        className={mxClsx(
          'flex flex-col items-center justify-center gap-8 px-8 py-14'
        )}
      >
        <div className="flex flex-col gap-4 text-center">
          <FontAwesomeIcon
            icon={faInfoCircle}
            size="3x"
            className="bg-opacity-40 text-white"
          />
          <span className="max-w-xs text-xl font-medium text-neutral-300">
            Payment canceled!
          </span>
        </div>

        <MxButton
          variant="neutral-700"
          className="flex items-center gap-3"
          onClick={onStartOver}
        >
          <span className="font-medium text-white">Try again</span>
        </MxButton>
      </MxCard>
    );
  }

  return (
    <div className="liq-w-full">
      {frameContent && <PaymentFrame htmlContent={frameContent} />}
      {!frameContent && (
        <div className="liq-flex payment-iframe liq-rounded-md liq-border liq-border-neutral-700">
          <MxCircleLoader />
        </div>
      )}
    </div>
  );
};

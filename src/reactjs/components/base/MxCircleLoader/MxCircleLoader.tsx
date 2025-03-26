import { mxClsx } from 'reactjs/utils/mxClsx';

export const MxCircleLoader = ({
  containerClassName = '',
  spinnerClassName = ''
}: {
  containerClassName?: string;
  spinnerClassName?: string;
}) => {
  return (
    <div
      className={mxClsx(
        'liq-flex liq-h-full liq-w-full liq-items-center liq-justify-center',
        containerClassName
      )}
    >
      <div
        className={mxClsx(
          'liq-loader liq-inline-block liq-h-10 liq-w-10 liq-animate-spin liq-rounded-full liq-border-4 liq-border-primary-400 liq-border-t-neutral-850',
          spinnerClassName
        )}
      ></div>
    </div>
  );
};

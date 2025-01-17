import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons/faArrowUpRightFromSquare';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContentProps } from 'react-toastify';
import { getApiURL } from '../../../helpers/getApiURL';
import { CopyButton } from '../CopyButton';

export const TransactionToast = ({
  data,
  TrimAddressComponent
}: ToastContentProps & {
  TrimAddressComponent: (props: {
    text: string;
    color?: 'muted' | 'secondary' | string;
    className?: string;
  }) => JSX.Element;
}) => {
  const hash = (data as { hash: string }).hash;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-zinc-300">Transaction sent</h3>
      <div className="flex w-full">
        <span className="m-w-[11rem] mr-1 whitespace-nowrap">
          <div className="mb-1"></div>
          <TrimAddressComponent
            className="flex items-center justify-center text-sm"
            text={hash}
          />
        </span>

        <CopyButton
          text={hash}
          className="flex items-center justify-center text-neutral-200"
        />

        <a
          href={`${getApiURL()}/status/${hash}`}
          target="_blank"
          className="ml-auto mr-0 flex items-center"
          rel="noreferrer"
        >
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            className="color-neutral-500"
          />
        </a>
      </div>
    </div>
  );
};

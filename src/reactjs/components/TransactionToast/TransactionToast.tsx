import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons/faArrowUpRightFromSquare';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContentProps } from 'react-toastify';
import { useWeb3App } from '../../hooks/useWeb3App';
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
  const hashes = (data as { hashes: string[] }).hashes;
  const { options } = useWeb3App();

  return (
    <div className="liq-flex liq-flex-col liq-gap-2">
      <h3 className="liq-text-sm liq-font-semibold liq-text-zinc-300">
        Transactions sent
      </h3>
      {hashes.map((hash) => (
        <div className="liq-flex liq-w-full" key={hash}>
          <span className="liq-m-w-[11rem] liq-mr-1 liq-whitespace-nowrap">
            <div className="liq-mb-1"></div>
            <TrimAddressComponent
              className="liq-flex liq-items-center liq-justify-center liq-text-sm"
              text={hash}
            />
          </span>

          <CopyButton
            text={hash}
            className="liq-flex liq-items-center liq-justify-center liq-text-neutral-200"
          />

          <a
            href={`${options.bridgeURL}/status/${hash}`}
            target="_blank"
            className="liq-ml-auto liq-mr-0 liq-flex liq-items-center"
            rel="noreferrer"
          >
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="liq-color-neutral-500"
            />
          </a>
        </div>
      ))}
    </div>
  );
};

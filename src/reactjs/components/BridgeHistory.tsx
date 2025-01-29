import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MxCard } from './MxCard';
import ArrowUpRight from '../assets/arrow-up-right.svg';
import { useGetHistoryQuery } from '../queries/useGetHistory.query';
import { mxClsx } from '../utils/mxClsx';

export const BridgeHistory = () => {
  const { data: transactions, isPending, error } = useGetHistoryQuery();

  console.log({ transactions, isPending, error });

  const className = mxClsx(`text-base lg:text-base p-2`, {
    'disabled animate-pulse': isPending
  });

  if (error) {
    return (
      <MxCard className={mxClsx('flex flex-col gap-1', className)}>
        Error: {error.message}
      </MxCard>
    );
  }

  return (
    <MxCard className={mxClsx('flex flex-col gap-1', className)}>
      <MxCard
        cardSize="lg"
        variant="neutral-750"
        className={mxClsx(
          'flex flex-col gap-4 outline outline-transparent focus-within:outline-neutral-700/75 hover:outline-neutral-700/55 hover:focus-within:outline-neutral-700/80',
          'pb-8 pt-6 hover:bg-neutral-700/50 sm:pb-6 lg:p-4'
        )}
      >
        <div className="flex justify-between gap-1">
          <div className="flex items-center gap-1 text-yellow-200">
            <FontAwesomeIcon
              icon={faClock}
              size="lg"
              className="flex items-center justify-center rounded-full text-yellow-400"
            />
            <span>Deposit</span>
            <img
              src="https://tools.multiversx.com/assets-cdn/devnet/tokens/USDC-350c4e/icon.svg"
              alt=""
              className="h-[1.5rem] w-[1.5rem]"
            />
            <span>498.00</span>
            <span>USDC</span>
            <span>from</span>
            <img
              src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='48'%20height='48'%20fill='none'%20viewBox='0%200%2048%2048'%3e%3cpath%20fill='%23F3BA2F'%20d='M14.6782%2020.1697L23.9997%2010.8486%2033.3262%2020.1746%2038.7501%2014.7507%2023.9997%200%209.25431%2014.7458%2014.6782%2020.1697zM10.8479%2023.9988L5.42408%2018.575.00000129498%2023.9991%205.42381%2029.4229%2010.8479%2023.9988zM14.6782%2027.8296L23.9997%2037.1507%2033.3258%2027.825%2038.7527%2033.2459%2038.7501%2033.2489%2023.9997%2047.9993%209.25394%2033.2539%209.24635%2033.2463%2014.6782%2027.8296zM42.5759%2029.4254L48%2024.0013%2042.5762%2018.5775%2037.1521%2024.0016%2042.5759%2029.4254z'/%3e%3cpath%20fill='%23F3BA2F'%20d='M29.5014%2023.9968H29.5036L23.9997%2018.4929L19.9323%2022.5604H19.9319L19.4648%2023.0278L18.5008%2023.9919L18.4932%2023.9995L18.5008%2024.0074L23.9997%2029.5064L29.5036%2024.0025L29.5063%2023.9995L29.5014%2023.9968Z'/%3e%3c/svg%3e"
              alt="bsc"
              className="z-10 flex h-[1.5rem] w-[1.5rem] p-1"
            />
          </div>
          <div className="flex items-center gap-1 ml-auto mr-0">
            <span>View </span>
            <img
              src={ArrowUpRight}
              alt=""
              className="flex items-center justify-center rounded-full text-neutral-200"
            />
          </div>
        </div>
      </MxCard>
      <MxCard
        cardSize="lg"
        variant="neutral-750"
        className={mxClsx(
          'flex flex-col gap-4 outline outline-transparent focus-within:outline-neutral-700/75 hover:outline-neutral-700/55 hover:focus-within:outline-neutral-700/80',
          'pb-8 pt-6 hover:bg-neutral-700/50 sm:pb-6'
        )}
      >
        <div className="flex justify-between gap-1">
          <div className="flex items-center gap-1 text-green-200">
            <FontAwesomeIcon
              icon={faCircleCheck}
              size="lg"
              className="flex items-center justify-center rounded-full text-green-400"
            />
            <span>Deposit</span>
            <img
              src="https://tools.multiversx.com/assets-cdn/devnet/tokens/USDC-350c4e/icon.svg"
              alt=""
              className="h-[1.5rem] w-[1.5rem]"
            />
            <span>498.00</span>
            <span>USDC</span>
            <span>from</span>
            <img
              src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='48'%20height='48'%20fill='none'%20viewBox='0%200%2048%2048'%3e%3cpath%20fill='%23F3BA2F'%20d='M14.6782%2020.1697L23.9997%2010.8486%2033.3262%2020.1746%2038.7501%2014.7507%2023.9997%200%209.25431%2014.7458%2014.6782%2020.1697zM10.8479%2023.9988L5.42408%2018.575.00000129498%2023.9991%205.42381%2029.4229%2010.8479%2023.9988zM14.6782%2027.8296L23.9997%2037.1507%2033.3258%2027.825%2038.7527%2033.2459%2038.7501%2033.2489%2023.9997%2047.9993%209.25394%2033.2539%209.24635%2033.2463%2014.6782%2027.8296zM42.5759%2029.4254L48%2024.0013%2042.5762%2018.5775%2037.1521%2024.0016%2042.5759%2029.4254z'/%3e%3cpath%20fill='%23F3BA2F'%20d='M29.5014%2023.9968H29.5036L23.9997%2018.4929L19.9323%2022.5604H19.9319L19.4648%2023.0278L18.5008%2023.9919L18.4932%2023.9995L18.5008%2024.0074L23.9997%2029.5064L29.5036%2024.0025L29.5063%2023.9995L29.5014%2023.9968Z'/%3e%3c/svg%3e"
              alt="bsc"
              className="z-10 flex h-[1.5rem] w-[1.5rem] p-1"
            />
          </div>
          <div className="flex items-center gap-1">
            <span>View</span>
            <img
              src={ArrowUpRight}
              alt=""
              className="flex items-center justify-center rounded-full text-neutral-200"
            />
          </div>
        </div>
      </MxCard>
      <MxCard
        cardSize="lg"
        variant="neutral-750"
        className={mxClsx(
          'flex flex-col gap-4 outline outline-transparent focus-within:outline-neutral-700/75 hover:outline-neutral-700/55 hover:focus-within:outline-neutral-700/80',
          'pb-8 pt-6 hover:bg-neutral-700/50 sm:pb-6'
        )}
      >
        <div className="flex justify-between gap-1">
          <div className="flex items-center gap-1 text-red-200">
            <FontAwesomeIcon
              icon={faCircleXmark}
              size="lg"
              className="flex items-center justify-center rounded-full text-red-400"
            />
            <span>Deposit</span>
            <img
              src="https://tools.multiversx.com/assets-cdn/devnet/tokens/USDC-350c4e/icon.svg"
              alt=""
              className="h-[1.5rem] w-[1.5rem]"
            />
            <span>498.00</span>
            <span>USDC</span>
            <span>from</span>
            <img
              src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='48'%20height='48'%20fill='none'%20viewBox='0%200%2048%2048'%3e%3cpath%20fill='%23F3BA2F'%20d='M14.6782%2020.1697L23.9997%2010.8486%2033.3262%2020.1746%2038.7501%2014.7507%2023.9997%200%209.25431%2014.7458%2014.6782%2020.1697zM10.8479%2023.9988L5.42408%2018.575.00000129498%2023.9991%205.42381%2029.4229%2010.8479%2023.9988zM14.6782%2027.8296L23.9997%2037.1507%2033.3258%2027.825%2038.7527%2033.2459%2038.7501%2033.2489%2023.9997%2047.9993%209.25394%2033.2539%209.24635%2033.2463%2014.6782%2027.8296zM42.5759%2029.4254L48%2024.0013%2042.5762%2018.5775%2037.1521%2024.0016%2042.5759%2029.4254z'/%3e%3cpath%20fill='%23F3BA2F'%20d='M29.5014%2023.9968H29.5036L23.9997%2018.4929L19.9323%2022.5604H19.9319L19.4648%2023.0278L18.5008%2023.9919L18.4932%2023.9995L18.5008%2024.0074L23.9997%2029.5064L29.5036%2024.0025L29.5063%2023.9995L29.5014%2023.9968Z'/%3e%3c/svg%3e"
              alt="bsc"
              className="z-10 flex h-[1.5rem] w-[1.5rem] p-1"
            />
          </div>
          <div className="flex items-center gap-1">
            <span>View</span>
            <img
              src={ArrowUpRight}
              alt=""
              className="flex items-center justify-center rounded-full text-neutral-200"
            />
          </div>
        </div>
      </MxCard>
    </MxCard>
  );
};

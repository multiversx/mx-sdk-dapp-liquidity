import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MxButton } from './MxButton';
import { MxCard } from './MxCard';
import { MxLink } from './MxLink';
import { ChainDTO } from '../../dto/Chain.dto';
import { TransactionDTO } from '../../dto/Transaction.dto';
import { TokenType } from '../../types/token';
import ArrowUpRight from '../assets/arrow-up-right.svg';
import { useFetchBridgeData } from '../hooks/useFetchBridgeData';
import { useGetHistoryQuery } from '../queries/useGetHistory.query';
import { formatAmount } from '../utils/formatAmount';
import { mxClsx } from '../utils/mxClsx';

export const BridgeHistory = ({
  mvxAddress,
  bridgeURL,
  mvxApiURL
}: {
  mvxAddress?: string;
  bridgeURL: string;
  mvxApiURL: string;
}) => {
  const { data, isLoading, isError } = useGetHistoryQuery();
  const navigate = useNavigate();

  const resolveTransactionIcon = useCallback((transaction: TransactionDTO) => {
    switch (transaction.status) {
      case 'success':
        return (
          <FontAwesomeIcon
            icon={faCircleCheck}
            size="lg"
            className="flex items-center justify-center rounded-full text-green-400"
          />
        );
      case 'failed':
        return (
          <FontAwesomeIcon
            icon={faCircleXmark}
            size="lg"
            className="flex items-center justify-center rounded-full text-red-400"
          />
        );
      default:
        return (
          <FontAwesomeIcon
            icon={faClock}
            size="lg"
            className="flex items-center justify-center rounded-full text-yellow-400"
          />
        );
    }
  }, []);

  const transactions = useMemo(
    () =>
      data?.map((transaction) => {
        return {
          ...transaction,
          tokenDestination: transaction.tokenDestination.toLowerCase(),
          tokenSource: transaction.tokenSource.toLowerCase(),
          sender: transaction.sender.toLowerCase(),
          statusIcon: resolveTransactionIcon(transaction)
        };
      }),
    [data, resolveTransactionIcon]
  );

  const {
    evmTokensWithBalances,
    mvxTokensWithBalances,
    chains,
    isTokensLoading: tokensLoading,
    isChainsLoading
  } = useFetchBridgeData({
    mvxAddress,
    mvxApiURL
  });

  const tokensMap = useMemo<Record<string, TokenType>>(() => {
    return [
      ...(evmTokensWithBalances ?? ([] as TokenType[])),
      ...(mvxTokensWithBalances ?? ([] as TokenType[]))
    ].reduce(
      (acc, token) => {
        acc[token.address.toLowerCase()] = token;
        return acc;
      },
      {} as Record<string, TokenType>
    );
  }, [evmTokensWithBalances, mvxTokensWithBalances]);

  const chainsMap = useMemo(() => {
    return (chains ?? []).reduce(
      (acc, chain) => {
        acc[chain.chainName.toLowerCase()] = chain;
        return acc;
      },
      {} as Record<string, ChainDTO>
    );
  }, [chains]);

  console.log({ transactions, isLoading, isError, tokensMap, chainsMap });

  const className = mxClsx(`min-h-96 max-h-96 text-base lg:text-base p-2`, {
    'disabled animate-pulse': isLoading || tokensLoading || isChainsLoading
  });

  if (isLoading && !transactions) {
    return <MxCard className={mxClsx('flex', className)} />;
  }

  if (isError && !transactions) {
    return (
      <MxCard className={mxClsx('flex flex-col gap-1', className)}>
        Something went wrong. Please try again later.
      </MxCard>
    );
  }

  return (
    <MxCard className={mxClsx('flex flex-col gap-1', className)}>
      <div
        className={mxClsx(
          'flex items-center gap-3 border-b border-neutral-750 p-2 font-medium leading-none'
        )}
      >
        <div className="flex items-center justify-center font-medium">
          History
        </div>
        <MxButton
          btnSize="md"
          className="ml-auto mr-0 border-none p-0"
          variant="link-neutral-500"
          onClick={() => {
            navigate(-1);
          }}
        >
          <FontAwesomeIcon icon={faClose} size="xl" />
        </MxButton>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-scroll">
        {transactions?.length === 0 && (
          <MxCard
            cardSize="lg"
            variant="transparent"
            className={
              'align-center flex h-full flex-col justify-center gap-4 border-0 pb-8 pt-6 sm:pb-6 lg:p-4'
            }
          >
            <div className="align-center flex flex-col justify-center gap-8">
              <div className="flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faClock}
                  size="6x"
                  className="rounded-full bg-primary-400 text-[#2b617a]"
                />
              </div>
              <div className={mxClsx('flex flex-col items-center')}>
                <div className="text-xl">No deposit yet</div>
                <div className="text-neutral-400">
                  Your deposit history will appear here
                </div>
              </div>
            </div>
          </MxCard>
        )}
        {transactions &&
          transactions?.length > 0 &&
          transactions.map((transaction) => {
            return (
              <MxCard
                key={transaction.depositTxHash}
                cardSize="lg"
                variant="neutral-750"
                className={mxClsx(
                  'flex flex-col gap-4 outline outline-transparent focus-within:outline-neutral-700/75 hover:outline-neutral-700/55 hover:focus-within:outline-neutral-700/80',
                  'pb-8 pt-6 hover:bg-neutral-700/50 sm:pb-6 lg:p-4'
                )}
              >
                <div className="align-center flex justify-between gap-1">
                  <div
                    className={mxClsx('flex items-center gap-1', {
                      'text-yellow-200': transaction.status === 'pending',
                      'text-green-200': transaction.status === 'success',
                      'text-red-200': transaction.status === 'failed'
                    })}
                  >
                    {transaction.statusIcon}
                    <span>
                      {transaction.destinationChain === 'msx'
                        ? 'Deposit'
                        : 'Transfer'}
                    </span>
                    <img
                      src={
                        transaction.destinationChain === 'msx'
                          ? tokensMap[transaction.tokenDestination]?.svgUrl
                          : tokensMap[transaction.tokenSource]?.svgUrl
                      }
                      alt=""
                      className="h-[1.5rem] w-[1.5rem]"
                    />
                    <span>
                      {formatAmount({
                        decimals: tokensMap[transaction.tokenSource]?.decimals,
                        amount: transaction.amountSource,
                        addCommas: false,
                        digits: 2
                      })}
                    </span>
                    <span>{tokensMap[transaction.tokenSource]?.name}</span>
                    <span>
                      {transaction.destinationChain === 'msx' ? 'From' : 'To'}
                    </span>
                    <img
                      src={
                        chainsMap[
                          transaction.destinationChain === 'msx'
                            ? transaction.sourceChain
                            : transaction.destinationChain
                        ]?.svgUrl ?? ''
                      }
                      alt=""
                      className="z-10 flex h-[1.5rem] w-[1.5rem] p-1"
                    />
                  </div>
                  <div className="ml-auto mr-0 flex items-center gap-1">
                    <MxLink
                      to={`${bridgeURL}/status/${transaction.depositTxHash}`}
                      target="_blank"
                      showExternalIcon={false}
                    >
                      View
                    </MxLink>
                    <img
                      src={ArrowUpRight}
                      alt=""
                      className="flex items-center justify-center rounded-full text-neutral-200"
                    />
                  </div>
                </div>
              </MxCard>
            );
          })}
      </div>
    </MxCard>
  );
};

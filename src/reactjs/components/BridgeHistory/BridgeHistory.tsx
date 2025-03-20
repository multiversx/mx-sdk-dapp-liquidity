import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useMemo } from 'react';
import { MVX_CHAIN_IDS } from '../../../constants';
import { ChainDTO } from '../../../dto/Chain.dto';
import { TransactionDTO } from '../../../dto/Transaction.dto';
import { ProviderType } from '../../../types/providerType.ts';
import { TokenType } from '../../../types/token';
import ArrowUpRight from '../../assets/arrow-up-right.svg';
import { useWeb3App } from '../../context/useWeb3App';
import { useFetchBridgeData } from '../../hooks/useFetchBridgeData';
import { useGetHistoryQuery } from '../../queries/useGetHistory.query';
import { formatAmount } from '../../utils/formatAmount';
import { mxClsx } from '../../utils/mxClsx';
import { MxButton } from '../base/MxButton';
import { MxCard } from '../base/MxCard';
import { MxLink } from '../base/MxLink';

export const BridgeHistory = ({
  mvxAddress,
  onClose
}: {
  mvxAddress?: string;
  onClose: () => void;
}) => {
  const { options } = useWeb3App();
  const { data, isLoading, isError } = useGetHistoryQuery();

  const resolveTransactionIcon = useCallback((transaction: TransactionDTO) => {
    switch (transaction.status) {
      case 'success':
        return (
          <FontAwesomeIcon
            icon={faCircleCheck}
            size="lg"
            className="liq-flex liq-items-center liq-justify-center liq-rounded-full liq-text-green-400"
          />
        );
      case 'failed':
        return (
          <FontAwesomeIcon
            icon={faCircleXmark}
            size="lg"
            className="liq-flex liq-items-center liq-justify-center liq-rounded-full liq-text-red-400"
          />
        );
      default:
        return (
          <FontAwesomeIcon
            icon={faClock}
            size="lg"
            className="liq-flex liq-items-center liq-justify-center liq-rounded-full liq-text-yellow-400"
          />
        );
    }
  }, []);

  const transactions = useMemo(
    () =>
      data?.map((transaction) => {
        return {
          ...transaction,
          tokenDestination: transaction.tokenOut.toLowerCase(),
          tokenSource: transaction.tokenIn.toLowerCase(),
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
    mvxApiURL: options.mvxApiURL
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
        acc[chain.chainId.toString()] = chain;
        return acc;
      },
      {} as Record<string, ChainDTO>
    );
  }, [chains]);

  const className = mxClsx(
    'liq-flex liq-flex-col liq-absolute liq-left-0 liq-top-0 liq-order-1 liq-mx-auto liq-w-full liq-gap-1 liq-pt-12 lg:liq-order-2 lg:liq-max-w-[27.5rem] !liq-min-h-[26rem] !liq-h-[26rem] !lg:liq-pt-0 !liq-bg-neutral-850 !liq-z-[16] !liq-p-2 !liq-pointer-events-auto',
    {
      '!liq-disabled !liq-animate-pulse':
        isLoading || tokensLoading || isChainsLoading
    }
  );

  if (isLoading && !transactions) {
    return <MxCard className={mxClsx('liq-flex', className)} />;
  }

  if (isError && !transactions) {
    return (
      <MxCard className={mxClsx('liq-flex liq-flex-col liq-gap-1', className)}>
        Something went wrong. Please try again later.
      </MxCard>
    );
  }

  return (
    <MxCard className={mxClsx('liq-flex liq-flex-col liq-gap-1', className)}>
      <div
        className={
          'liq-flex liq-items-center liq-justify-between liq-py-1 liq-mt-0.5'
        }
      >
        <div className="liq-flex liq-flex-1 liq-items-center liq-justify-center liq-text-center liq-text-lg">
          History
        </div>
        <MxButton
          btnSize="md"
          className="liq-border-none !liq-p-0 !liq-mr-2"
          variant="link-neutral-500"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faClose} size="xl" />
        </MxButton>
      </div>

      <div className="scrollbar-thin liq-flex liq-flex-1 liq-flex-col liq-gap-1 liq-overflow-y-scroll">
        {transactions?.length === 0 && (
          <MxCard
            cardSize="lg"
            variant="transparent"
            className={
              'liq-align-center liq-flex liq-h-full liq-flex-col liq-justify-center liq-gap-4 liq-border-0 !liq-pb-8 !liq-pt-6 !sm:liq-pb-6 !lg:liq-p-4'
            }
          >
            <div className="liq-align-center liq-flex liq-flex-col liq-justify-center liq-gap-8">
              <div className="liq-flex liq-items-center liq-justify-center">
                <FontAwesomeIcon
                  icon={faClock}
                  size="6x"
                  className="liq-rounded-full liq-bg-primary-400 liq-text-[#2b617a]"
                />
              </div>
              <div className={mxClsx('liq-flex liq-flex-col liq-items-center')}>
                <div className="liq-text-xl">No deposit yet</div>
                <div className="liq-text-neutral-400">
                  Your deposit history will appear here
                </div>
              </div>
            </div>
          </MxCard>
        )}
        {transactions &&
          transactions?.length > 0 &&
          transactions.map((transaction, index) => {
            return (
              <MxCard
                key={`${transaction.txHash}-${index}`}
                cardSize="lg"
                variant="neutral-750"
                className={
                  'liq-flex liq-flex-col liq-gap-4 !liq-outline liq-outline-transparent !liq-p-4 liq-border liq-border-neutral-750 liq-bg-neutral-850 hover:!liq-bg-neutral-700 !liq-rounded-lg'
                }
              >
                <div className="liq-align-center liq-flex liq-justify-between liq-gap-1">
                  <div
                    className={mxClsx('liq-flex liq-items-center liq-gap-1', {
                      'liq-text-yellow-200': transaction.status === 'pending',
                      'liq-text-green-200': transaction.status === 'success',
                      'liq-text-red-200': transaction.status === 'failed'
                    })}
                  >
                    {transaction.statusIcon}

                    {MVX_CHAIN_IDS.includes(Number(transaction.toChainId)) ? (
                      <>
                        <span>Deposit </span>
                        <span className="liq-whitespace-nowrap liq-overflow-hidden liq-text-ellipsis">
                          {formatAmount({
                            decimals:
                              tokensMap[transaction.tokenDestination]?.decimals,
                            amount: transaction.amountOut,
                            addCommas: false,
                            digits: 2
                          })}
                        </span>
                        <span className="liq-whitespace-nowrap">
                          {tokensMap[transaction.tokenDestination]?.symbol}
                        </span>
                        <img
                          src={tokensMap[transaction.tokenDestination]?.svgUrl}
                          alt=""
                          className="liq-h-[1.5rem] liq-w-[1.5rem]"
                        />
                        <span className="liq-whitespace-nowrap">from</span>
                        <span className="liq-whitespace-nowrap liq-overflow-hidden liq-text-ellipsis">
                          {formatAmount({
                            decimals:
                              tokensMap[transaction.tokenSource]?.decimals,
                            amount: transaction.amountIn,
                            addCommas: false,
                            digits: 2
                          })}
                        </span>
                        <span className="liq-whitespace-nowrap">
                          {tokensMap[transaction.tokenSource]?.symbol}
                        </span>
                        <div className="liq-flex liq-items-center liq-relative">
                          <div className="liq-flex-shrink-0 liq-overflow-hidden liq-rounded-full liq-h-8 liq-w-8 liq-flex liq-items-center liq-justify-center">
                            <div className="liq-h-8 liq-w-8 liq-flex liq-items-center liq-justify-center">
                              <img
                                src={tokensMap[transaction.tokenSource]?.svgUrl}
                                alt=""
                                className="liq-asset-icon liq-sm liq-p-0"
                              />
                            </div>
                          </div>
                          <img
                            src={chainsMap[transaction.fromChainId]?.svgUrl}
                            alt=""
                            className="liq-absolute liq-left-3 liq-bottom-[-2px] liq-chain-icon liq-sm liq-w-5 liq-h-5 liq-border-[3px] liq-border-neutral-850  liq-rounded-lg"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <span>Transfer </span>
                        <span className="liq-whitespace-nowrap liq-overflow-hidden liq-text-ellipsis">
                          {formatAmount({
                            decimals:
                              tokensMap[transaction.tokenSource]?.decimals,
                            amount: transaction.amountIn,
                            addCommas: false,
                            digits: 2
                          })}
                        </span>
                        <span className="liq-whitespace-nowrap">
                          {tokensMap[transaction.tokenSource]?.symbol}
                        </span>
                        <img
                          src={tokensMap[transaction.tokenSource]?.svgUrl}
                          alt=""
                          className="liq-h-[1.5rem] liq-w-[1.5rem]"
                        />
                        <span className="liq-whitespace-nowrap">to</span>
                        <span className="liq-whitespace-nowrap liq-overflow-hidden liq-text-ellipsis">
                          {formatAmount({
                            decimals:
                              tokensMap[transaction.tokenDestination]?.decimals,
                            amount: transaction.amountOut,
                            addCommas: false,
                            digits: 2
                          })}
                        </span>
                        <span className="liq-whitespace-nowrap">
                          {tokensMap[transaction.tokenDestination]?.symbol}
                        </span>
                        <div className="liq-flex liq-items-center liq-relative">
                          <div className="liq-flex-shrink-0 liq-overflow-hidden liq-rounded-full liq-h-8 liq-w-8 liq-flex liq-items-center liq-justify-center">
                            <div className="liq-h-8 liq-w-8 liq-flex liq-items-center liq-justify-center">
                              <img
                                src={
                                  tokensMap[transaction.tokenDestination]
                                    ?.svgUrl
                                }
                                alt=""
                                className="liq-asset-icon liq-sm liq-p-0"
                              />
                            </div>
                          </div>
                          <img
                            src={chainsMap[transaction.toChainId]?.svgUrl}
                            alt=""
                            className="liq-absolute liq-left-3 liq-bottom-[-2px] liq-chain-icon liq-sm liq-w-5 liq-h-5 liq-border-[3px] liq-border-neutral-850  liq-rounded-lg"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {transaction.provider === ProviderType.MultiversxBridge && (
                    <div className="liq-ml-auto liq-mr-0 liq-flex liq-items-center liq-gap-1">
                      <MxLink
                        to={`${options.bridgeURL}/status/${transaction.txHash}`}
                        target="_blank"
                        showExternalIcon={false}
                        className="liq-flex"
                      >
                        <div className="max-sm:liq-hidden">View</div>
                        <img
                          src={ArrowUpRight}
                          alt=""
                          className="liq-flex liq-items-center liq-justify-center liq-rounded-full liq-text-neutral-200"
                        />
                      </MxLink>
                    </div>
                  )}
                </div>
              </MxCard>
            );
          })}
      </div>
    </MxCard>
  );
};

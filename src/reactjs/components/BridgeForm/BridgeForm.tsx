import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { useAppKitNetwork } from '@reown/appkit/react';
import { getConnections, waitForTransactionReceipt } from '@wagmi/core';
import { AxiosError } from 'axios';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getApiURL } from '../../../helpers/getApiURL';
import { ChainType } from '../../../types/chainType';
import { ProviderType } from '../../../types/providerType';
import { TokenType } from '../../../types/token';
import { ServerTransaction } from '../../../types/transaction';
import { safeWindow } from '../../constants';
import { useWeb3App } from '../../context/useWeb3App';
import { useAccount } from '../../hooks/useAccount';
import {
  BridgeFormikValuesEnum,
  useBridgeFormik
} from '../../hooks/useBridgeFormik';
import { useFetchBridgeData } from '../../hooks/useFetchBridgeData';
import { useGetChainId } from '../../hooks/useGetChainId';
import { useSendTransactions } from '../../hooks/useSendTransactions';
import { useSignTransaction } from '../../hooks/useSignTransaction';
import { invalidateHistoryQuery } from '../../queries/useGetHistory.query';
import { useGetRateMutation } from '../../queries/useGetRate.mutation';
import { getCompletePathname } from '../../utils/getCompletePathname';
import {
  getInitialTokens,
  InitialTokensType
} from '../../utils/getInitialTokens';
import { mxClsx } from '../../utils/mxClsx';
import { AmountCard } from '../AmountCard';
import { AmountInput } from '../AmountInput';
import { MxButton } from '../base';
import { BridgeHistory } from '../BridgeHistory';
import {
  BridgeAccountDisplay,
  BridgeConnectButton,
  MvxAccountDisplay,
  MvxConnectButton
} from '../Connect';
import { TokenSelector } from '../TokenSelector';

interface BridgeFormProps {
  mvxChainId: string;
  mvxAddress?: string;
  username?: string;
  nativeAuthToken?: string;
  callbackRoute?: string;
  firstTokenIdentifier?: string;
  secondTokenIdentifier?: string;
  firstTokenAmount?: string;
  secondTokenAmount?: string;
  refetchTrigger?: number;
  showHistory?: boolean;
  forcedDestinationTokenSymbol?: string;
  onSuccessfullySentTransaction?: (txHashes?: string[]) => void;
  onFailedSentTransaction?: (message?: string) => void;
  onHistoryClose?: () => void;
  onMvxConnect: () => void;
  onMvxDisconnect?: () => void;
  onNavigate?: (url: string, options?: object) => void;
}

let fetchRateInterval: NodeJS.Timeout;

export const BridgeForm = ({
  mvxChainId,
  mvxAddress,
  username,
  nativeAuthToken,
  callbackRoute = '/',
  firstTokenIdentifier,
  secondTokenIdentifier,
  firstTokenAmount,
  secondTokenAmount,
  refetchTrigger,
  showHistory,
  forcedDestinationTokenSymbol,
  onSuccessfullySentTransaction,
  onFailedSentTransaction,
  onHistoryClose,
  onMvxConnect,
  onMvxDisconnect,
  onNavigate
}: BridgeFormProps) => {
  const ref = useRef(null);
  const initializedInitialTokensRef = useRef(false);
  const [isTokenSelectorVisible, setIsTokenSelectorVisible] = useState(false);
  const [pendingSigning, setPendingSigning] = useState(false);
  const [siginingTransactionsCount, setSigningTransactionsCount] =
    useState<number>(0);
  const account = useAccount();
  const { switchNetwork } = useAppKitNetwork();
  const { config, options, supportedChains: sdkChains } = useWeb3App();
  const chainId = useGetChainId();

  const {
    evmTokensWithBalances,
    mvxTokensWithBalances,
    isTokensLoading: tokensLoading,
    isLoadingEvmTokensBalances,
    isLoadingMvxTokensBalances,
    chains = [],
    isChainsLoading
  } = useFetchBridgeData({
    refetchTrigger,
    mvxAddress,
    mvxApiURL: options.mvxApiURL
  });

  const isTokensLoading =
    tokensLoading ||
    isLoadingEvmTokensBalances ||
    isLoadingMvxTokensBalances ||
    isChainsLoading;

  const activeChain = useMemo(() => {
    return sdkChains.find(
      (chain) => chain.id.toString() === chainId?.toString()
    );
  }, [chainId, sdkChains]);

  const mvxChain = useMemo(() => {
    return chains.find(
      (chain) => chain.chainId.toString() === mvxChainId.toString()
    );
  }, [chainId, chains]);

  const { evm, solana, bitcoin } = useSignTransaction();
  const sendTransactions = useSendTransactions();

  const {
    mutate: getRate,
    data: rate,
    isPending: isPendingRate,
    error: rateError
  } = useGetRateMutation();

  const rateValidationError =
    (rateError as AxiosError)?.response?.status === 400
      ? (rateError as AxiosError<{ message: string }>)?.response?.data.message
      : undefined;

  const [firstToken, setFirstToken] = useState<TokenType | undefined>();
  const [firstAmount, setFirstAmount] = useState(firstTokenAmount ?? '');
  const [secondToken, setSecondToken] = useState<TokenType | undefined>();
  const [secondAmount, setSecondAmount] = useState(secondTokenAmount ?? '');

  const bridgeAddress = account.address;
  const isAuthenticated = account.isConnected && Boolean(bridgeAddress);

  const fromOptions = useMemo(
    () =>
      (evmTokensWithBalances &&
        evmTokensWithBalances.map((token) => {
          return {
            ...token,
            identifier: token.address,
            ticker: token.symbol
          };
        })) ??
      [],
    [evmTokensWithBalances]
  );

  const getAvailableTokens = useCallback(
    (option: TokenType) => {
      if (forcedDestinationTokenSymbol) {
        const forcedToken = mvxTokensWithBalances?.find(
          (mvxToken) =>
            mvxToken.symbol.toLowerCase() ===
            forcedDestinationTokenSymbol.toLowerCase()
        );

        if (forcedToken) {
          return [forcedToken];
        }
        return [];
      }

      if (!option?.availableTokens) {
        return [];
      }

      const foundTokens: TokenType[] = [];

      for (const availableToken of option.availableTokens) {
        const foundToken = mvxTokensWithBalances?.find(
          (mvxToken) => mvxToken.address === availableToken.address
        );

        if (foundToken) {
          foundTokens.push(foundToken);
        }
      }

      return foundTokens;
    },
    [mvxTokensWithBalances]
  );

  const toOptions = useMemo(
    () =>
      (firstToken?.availableTokens &&
        getAvailableTokens(firstToken).map((token) => {
          return {
            ...token,
            identifier: token.address,
            ticker: token.symbol
          };
        })) ??
      [],
    [firstToken?.availableTokens]
  );

  const selectedChainOption = useMemo(
    () =>
      chains?.find(
        (option) => option.chainId.toString() === activeChain?.id.toString()
      ) ?? chains?.[0],
    [activeChain?.id, chains]
  );

  const getDefaultReceivingToken = useCallback(
    (values: TokenType[]) =>
      values.find((x) => x.symbol.toLowerCase().includes('usdc')) ??
      mvxTokensWithBalances?.find((x) =>
        x.symbol.toLowerCase().includes('usdc')
      ),
    [mvxTokensWithBalances]
  );

  const hasAmounts = firstAmount !== '' && secondAmount !== '';

  const fetchRateDebounced = useCallback(
    debounce(async (amount: string) => {
      if (
        !amount ||
        !account.address ||
        !firstToken?.address ||
        !secondToken?.address ||
        !selectedChainOption ||
        !chainId
      ) {
        return;
      }

      getRate({
        nativeAuthToken: nativeAuthToken ?? '',
        body: {
          tokenIn: firstToken.address,
          amountIn: amount,
          fromChainId: chainId.toString(),
          tokenOut: secondToken.address,
          toChainId: mvxChainId
        }
      });
    }, 500),
    [
      account.address,
      firstToken?.address,
      secondToken?.address,
      selectedChainOption
    ]
  );

  const handleOnChangeFirstAmount = useCallback((amount: string) => {
    setFirstAmount(() => amount);
    setLastChangedField(BridgeFormikValuesEnum.firstAmount);
  }, []);

  const handleOnChangeSecondAmount = useCallback((amount: string) => {
    setSecondAmount(() => amount);
    setLastChangedField(BridgeFormikValuesEnum.secondAmount);
  }, []);

  const handleHistoryClose = useCallback(() => {
    onHistoryClose?.();
  }, [onHistoryClose]);

  const handleOnFirstMaxBtnChange = useCallback(() => {
    const formattedBalance = formatAmount({
      decimals: firstToken?.decimals,
      input: firstToken?.balance ?? '0',
      addCommas: false,
      digits: 4
    });

    formik.setFieldValue('firstAmount', formattedBalance);
    handleOnChangeFirstAmount(formattedBalance);
  }, [firstToken?.balance, firstToken?.decimals, handleOnChangeFirstAmount]);

  const onSuccess = useCallback(
    async (txHashes: string[]) => {
      handleOnChangeFirstAmount('');
      handleOnChangeSecondAmount('');

      // Hack: this is needed to be called twice to invalidate the history query, otherwise the history won't update
      invalidateHistoryQuery();
      invalidateHistoryQuery();
      onSuccessfullySentTransaction?.(txHashes);
    },
    [
      handleOnChangeFirstAmount,
      handleOnChangeSecondAmount,
      onSuccessfullySentTransaction
    ]
  );

  const updateUrlParams = useCallback(
    ({ firstTokenId, secondTokenId }: InitialTokensType) => {
      if (isTokensLoading) {
        return;
      }

      const currentUrl = getCompletePathname();
      const searchParams = new URLSearchParams(safeWindow.location.search);

      if (firstTokenId) {
        searchParams.set('firstToken', firstTokenId);
      }

      if (secondTokenId) {
        searchParams.set('secondToken', secondTokenId);
      }

      const newUrl = `${callbackRoute}?${searchParams.toString()}`;

      if (currentUrl === newUrl) {
        return;
      }
      onNavigate?.(newUrl, { replace: true });
    },
    [callbackRoute, isTokensLoading, onNavigate]
  );

  const onChangeFirstSelect = useCallback(
    (option?: TokenType) => {
      if (!option) {
        return;
      }

      setFirstToken(() => option);
      updateUrlParams({ firstTokenId: option?.address });

      const availableTokens = getAvailableTokens(option);
      const secondOption =
        availableTokens.find(
          (x) =>
            x.symbol.toLowerCase() ===
            availableTokens?.[0]?.symbol.toLowerCase()
        ) ?? getDefaultReceivingToken(availableTokens);

      if (!secondOption) {
        return;
      }

      setSecondToken(() => secondOption);
      updateUrlParams({ secondTokenId: secondOption?.address });
    },
    [toOptions, updateUrlParams]
  );

  const onChangeSecondSelect = useCallback(
    (option?: TokenType) => {
      if (!option) {
        return;
      }

      setSecondToken(() => option);
      updateUrlParams({ secondTokenId: option?.address });

      const firstOption = fromOptions.find(
        (x) => x.symbol.toLowerCase() === option?.symbol.toLowerCase()
      );

      if (!firstOption) {
        return;
      }

      setFirstToken(() => firstOption);
      updateUrlParams({ firstTokenId: firstOption?.address });
    },
    [fromOptions, updateUrlParams]
  );

  useEffect(() => {
    if (selectedChainOption?.chainId !== firstToken?.chainId) {
      const selectedOption = fromOptions?.find(
        (option) => option.chainId.toString() === selectedChainOption?.chainId
      );

      if (!selectedOption) {
        return;
      }

      onChangeFirstSelect(selectedOption);
    }
  }, [selectedChainOption?.chainId]);

  const setInitialSelectedTokens = () => {
    if (isTokensLoading || initializedInitialTokensRef.current) {
      return;
    }

    const initialTokens = getInitialTokens({
      firstTokenId: firstTokenIdentifier,
      secondTokenId: secondTokenIdentifier
    });

    const firstOption =
      fromOptions?.find(
        ({ identifier }) => initialTokens?.firstTokenId === identifier
      ) ??
      fromOptions.find(
        (option) => option.chainId.toString() === activeChain?.id?.toString()
      ) ??
      fromOptions?.[0];

    const availableTokens = getAvailableTokens(firstOption);
    const secondOption =
      availableTokens?.find(
        ({ address }) =>
          address.toLowerCase() ===
          (firstOption?.symbol ?? initialTokens?.secondTokenId)?.toLowerCase()
      ) ??
      availableTokens.find(
        (x) => x.symbol.toLowerCase() === firstOption?.symbol.toLowerCase()
      ) ??
      getDefaultReceivingToken(availableTokens);

    const hasOptionsSelected =
      Boolean(firstToken) &&
      Boolean(secondToken) &&
      firstToken?.address?.toLowerCase() ===
        firstOption?.address?.toLowerCase() &&
      secondToken?.address?.toLowerCase() ===
        secondOption?.address?.toLowerCase();

    if (hasOptionsSelected) {
      return;
    }

    let initializedFirstToken = false;
    if (firstOption) {
      setFirstToken(firstOption);
      updateUrlParams({
        firstTokenId: firstOption?.address
      });

      const selectedOptionChain =
        sdkChains?.find(
          (chain) => chain.id.toString() === firstOption?.chainId.toString()
        ) ?? activeChain;

      if (selectedOptionChain) {
        switchNetwork(selectedOptionChain);
      }

      initializedFirstToken = true;
    }

    let initializedSecondToken = false;
    if (secondOption) {
      setSecondToken(secondOption);
      updateUrlParams({
        secondTokenId: secondOption?.address
      });
      initializedSecondToken = true;
    }

    initializedInitialTokensRef.current =
      initializedFirstToken && initializedSecondToken;
  };

  const onSubmit = useCallback(
    async ({
      transactions,
      provider
    }: {
      transactions: ServerTransaction[];
      provider: ProviderType;
    }) => {
      const signedTransactions: ServerTransaction[] = [];
      setPendingSigning(true);
      setSigningTransactionsCount(() => transactions.length);

      try {
        let txIndex = -1;
        for (const transaction of transactions) {
          ++txIndex;
          try {
            switch (selectedChainOption?.chainType) {
              case ChainType.evm:
                const hash = await evm.signTransaction({
                  ...transaction,
                  value: BigInt(transaction.value),
                  gas: BigInt(transaction.gasLimit),
                  account: bridgeAddress as `0x${string}`
                });

                if (!hash) {
                  break;
                }

                signedTransactions.push({
                  ...transaction,
                  txHash: hash
                });

                if (txIndex === transactions.length - 1 || !hash) {
                  break;
                }

                const transactionReceipt = await waitForTransactionReceipt(
                  config,
                  {
                    confirmations: 1,
                    hash: hash as `0x${string}`
                  }
                );

                console.info({
                  transactionReceipt,
                  hash
                });

                break;
              case ChainType.sol:
                if (!transaction.instructions || !transaction.feePayer) {
                  break;
                }

                const txHash = await solana.signTransaction({
                  feePayer: transaction.feePayer,
                  instructions: transaction.instructions
                });

                if (!txHash) {
                  break;
                }

                signedTransactions.push({
                  ...transaction,
                  txHash
                });
                break;

              case ChainType.btc:
                if (!transaction.bitcoinParams) {
                  console.error('No bitcoin params');
                  break;
                }

                const psbt = await bitcoin.signTransaction(
                  transaction.bitcoinParams
                );

                signedTransactions.push({
                  ...transaction,
                  txHash: psbt
                });
                break;
              default:
                toast.error('Provider not supported');
                setPendingSigning(false);
                return;
            }

            setSigningTransactionsCount(
              () => transactions.length - 1 - txIndex
            );
          } catch (e) {
            toast.dismiss();
            toast.error('Transaction aborted');
            onFailedSentTransaction?.('Transaction aborted');
            setPendingSigning(false);
            return;
          }
        }

        await sendTransactions({
          transactions: signedTransactions,
          provider,
          url: getApiURL() ?? '',
          token: nativeAuthToken ?? ''
        });

        const txHashes = signedTransactions.map((tx) => tx.txHash);
        onSuccess(txHashes);
        setPendingSigning(false);
      } catch (e) {
        console.error(e);
        toast.dismiss();
        toast.error('Transaction cancelled');
        onFailedSentTransaction?.('Transaction cancelled');
        setPendingSigning(false);
        setSigningTransactionsCount(0);
        resetSwapForm();
        handleOnChangeFirstAmount('');
        handleOnChangeSecondAmount('');
      }
    },
    [
      bridgeAddress,
      handleOnChangeFirstAmount,
      handleOnChangeSecondAmount,
      nativeAuthToken,
      onSuccess,
      sendTransactions,
      evm.signTransaction
    ]
  );

  const {
    formik,
    firstAmountError,
    secondAmountError,
    fromChainError,
    handleBlur,
    handleChange,
    handleSubmit,
    resetSwapForm,
    setLastChangedField
  } = useBridgeFormik({
    rate,
    nativeAuthToken,
    mvxAccountAddress: mvxAddress,
    firstToken,
    firstAmount,
    fromChainId: chainId?.toString(),
    toChainId: mvxChainId,
    secondToken,
    secondAmount,
    onSubmit
  });

  const hasError = Boolean(
    firstAmountError ||
      secondAmountError ||
      fromChainError ||
      rateValidationError
  );

  useEffect(() => {
    if (!firstAmount) {
      setSecondAmount('');
    }

    fetchRateDebounced(firstAmount);

    if (fetchRateInterval) {
      clearInterval(fetchRateInterval);
    }

    fetchRateInterval = setInterval(() => {
      fetchRateDebounced(firstAmount);
    }, 60 * 1000); // 1min

    return () => clearInterval(fetchRateInterval);
  }, [firstAmount, fetchRateDebounced]);

  useEffect(() => {
    if (!rate?.amountOut) {
      return;
    }

    formik.setFieldValue(BridgeFormikValuesEnum.secondAmount, rate.amountOut);
    setSecondAmount(rate.amountOut);
  }, [rate?.amountOut]);

  useEffect(() => {
    if (rateValidationError) {
      formik.setFieldValue(BridgeFormikValuesEnum.secondAmount, '0');
      setSecondAmount('0');
    }
  }, [rateValidationError]);

  useEffect(setInitialSelectedTokens, [isTokensLoading, fromOptions]);

  useEffect(() => {
    const selectedTokenOption = evmTokensWithBalances?.find(
      (x) => x.address === firstToken?.address
    );

    if (!selectedTokenOption) {
      return;
    }

    setFirstToken((prevState) => {
      if (!prevState) {
        return prevState;
      }

      return {
        ...prevState,
        balance: selectedTokenOption?.balance
      };
    });
  }, [evmTokensWithBalances, firstToken?.address]);

  useEffect(() => {
    const selectedTokenOption = mvxTokensWithBalances?.find(
      (x) => x.address === secondToken?.address
    );

    if (!selectedTokenOption) {
      return;
    }

    setSecondToken((prevState) => {
      if (!prevState) {
        return prevState;
      }

      return {
        ...prevState,
        balance: selectedTokenOption?.balance
      };
    });
  }, [mvxTokensWithBalances, secondToken?.address]);

  useEffect(() => {
    if (firstTokenAmount) {
      formik.setFieldValue(
        BridgeFormikValuesEnum.firstAmount,
        firstTokenAmount
      );
      handleOnChangeFirstAmount(firstTokenAmount);
    }
  }, []);

  useEffect(() => {
    if (secondTokenAmount) {
      formik.setFieldValue(
        BridgeFormikValuesEnum.secondAmount,
        secondTokenAmount
      );
      handleOnChangeSecondAmount(secondTokenAmount);
    }
  }, [secondTokenAmount]);

  return (
    <>
      <form
        ref={ref}
        noValidate
        className="liq-flex liq-flex-col liq-gap-1 liq-relative"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {showHistory && (
          <BridgeHistory mvxAddress={mvxAddress} onClose={handleHistoryClose} />
        )}
        <AmountCard
          className={mxClsx(
            'liq-pb-8 liq-pt-6 hover:liq-bg-neutral-700/50 sm:liq-pb-6',
            {
              'liq-pointer-events-none': isTokenSelectorVisible,
              'focus-within:liq-outline-neutral-700/75 hover:liq-outline-neutral-700/55 hover:focus-within:liq-outline-neutral-700/80':
                !isTokenSelectorVisible
            }
          )}
        >
          <div className="liq-flex liq-items-center liq-gap-1">
            <span>From</span>
            <BridgeAccountDisplay
              disabled={isPendingRate}
              activeChain={selectedChainOption}
            />
          </div>
          <div className="liq-flex liq-justify-between liq-gap-1">
            <AmountInput
              inputName="firstAmount"
              inputValue={formik.values.firstAmount ?? ''}
              amountError={
                firstAmount !== ''
                  ? rateValidationError ?? firstAmountError
                  : undefined
              }
              disabled={false}
              onInputDebounceChange={handleOnChangeFirstAmount}
              onInputChange={handleChange}
              onBlur={handleBlur}
            />
            <TokenSelector
              name={'firstToken'}
              disabled={isPendingRate}
              options={fromOptions}
              areOptionsLoading={isTokensLoading}
              isMvxSelector={false}
              color="neutral-850"
              onChange={onChangeFirstSelect}
              onBlur={handleBlur}
              onMaxBtnClick={handleOnFirstMaxBtnChange}
              selectedOption={firstToken}
              onTokenSelectorDisplay={(visible) =>
                setIsTokenSelectorVisible(visible)
              }
            />
          </div>
        </AmountCard>
        <AmountCard
          className={mxClsx(
            'liq-pb-8 liq-pt-6 hover:liq-bg-neutral-700/50 sm:liq-pb-6',
            {
              'liq-pointer-events-none': isTokenSelectorVisible
            }
          )}
        >
          <div className="liq-flex liq-items-center liq-gap-1">
            <span>To</span>
            <MvxAccountDisplay
              accountAddress={mvxAddress}
              chainIcon={mvxChain?.svgUrl ?? ''}
              username={username}
              accountExplorerUrl={`${options.mvxExplorerAddress}/accounts/${mvxAddress}`}
              showTag={true}
              onDisconnect={onMvxDisconnect}
              onConnect={onMvxConnect}
            />
          </div>
          <div className="liq-flex liq-justify-between liq-gap-1">
            <AmountInput
              inputName="secondAmount"
              inputValue={formik.values.secondAmount ?? ''}
              amountError={
                secondAmount !== ''
                  ? fromChainError ?? secondAmountError
                  : undefined
              }
              disabled={isPendingRate}
              onInputDebounceChange={handleOnChangeSecondAmount}
              onInputChange={handleChange}
              onBlur={handleBlur}
            />
            <TokenSelector
              name={'secondToken'}
              disabled={isPendingRate}
              omitDisableClass={true}
              options={toOptions}
              areOptionsLoading={isTokensLoading}
              isMvxSelector={true}
              color="neutral-850"
              onChange={onChangeSecondSelect}
              onBlur={handleBlur}
              selectedOption={secondToken}
            />
          </div>
        </AmountCard>
        <div className="liq-flex liq-items-center liq-justify-center">
          {!mvxAddress && (
            <MvxConnectButton
              mvxAccountAddress={mvxAddress}
              icon={mvxChain?.svgUrl}
              onClick={onMvxConnect}
            />
          )}
          {mvxAddress && !isAuthenticated && (
            <BridgeConnectButton
              className="liq-w-full liq-rounded-xl liq-bg-neutral-850/50 liq-px-8 liq-py-3 liq-font-semibold liq-text-primary-200 liq-transition-colors liq-duration-200 hover:enabled:liq-bg-primary-700/80 disabled:liq-opacity-50"
              disabled={isPendingRate}
              activeChain={selectedChainOption}
            />
          )}
          {mvxAddress && isAuthenticated && (
            <MxButton
              type="submit"
              variant="neutral-850"
              className="liq-w-full disabled:liq-bg-neutral-850/50 liq-py-3 hover:enabled:liq-bg-primary !liq-text-primary-200"
              disabled={
                !hasAmounts ||
                isPendingRate ||
                !mvxAddress ||
                !account.address ||
                hasError ||
                pendingSigning
              }
            >
              {hasAmounts && !pendingSigning && (
                <div className="liq-flex liq-justify-center liq-gap-2">
                  <div>Deposit on </div>
                  <img
                    src={mvxChain?.svgUrl ?? ''}
                    alt=""
                    className="liq-h-[1.5rem] liq-w-[1.5rem]"
                  />
                  <div>MultiversX</div>
                </div>
              )}
              {!hasAmounts && !pendingSigning && (
                <span className="liq-text-neutral-100">Enter amount</span>
              )}

              {pendingSigning && (
                <div className="liq-flex liq-justify-center liq-items-center liq-gap-2">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="liq-mx-1 liq-flex liq-items-center"
                  />
                  <div>Depositing on</div>
                  <img
                    src={mvxChain?.svgUrl ?? ''}
                    alt=""
                    className="liq-h-[1.5rem] liq-w-[1.5rem]"
                  />
                  <div>MultiversX</div>
                </div>
              )}
            </MxButton>
          )}
        </div>
        {account.address && siginingTransactionsCount > 0 && (
          <div className="liq-flex liq-items-center liq-justify-center liq-text-neutral-300 liq-text-sm">
            <div>
              You will be asked to sign {siginingTransactionsCount}{' '}
              {siginingTransactionsCount > 1 ? 'transactions' : 'transaction'}{' '}
              on{' '}
            </div>
            <img
              src={getConnections(config)[0]?.connector?.icon}
              alt=""
              className="liq-mx-1 liq-h-[1rem] liq-w-[1rem]"
            />
            <div>{getConnections(config)[0]?.connector?.name}</div>
          </div>
        )}
      </form>
    </>
  );
};

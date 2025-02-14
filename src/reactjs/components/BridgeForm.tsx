import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { getConnections, waitForTransactionReceipt } from '@wagmi/core';
import { AxiosError } from 'axios';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSwitchChain } from 'wagmi';
import { BridgeWalletConnection } from './BridgeWalletConnection';
import { BridgeConnectButton } from './Connect/BridgeConnectButton';
import { MvxConnectButton } from './Connect/MvxConnectButton';
import { EnterAmountCard } from './EnterAmountCard';
import { EnterAmountInput } from './EnterAmountInput';
import { MvxAccountDisplay } from './MvxAccountDisplay';
import { MxButton } from './MxButton';
import { TokenSelector } from './TokenSelector';
import { TransactionToast } from './TransactionToast/TransactionToast';
import { getApiURL } from '../../helpers/getApiURL';
import { OptionType } from '../../types/form';
import { TokenType } from '../../types/token';
import { ServerTransaction } from '../../types/transaction';
import { useAccount } from '../hooks/useAccount';
import { useBridgeFormik } from '../hooks/useBridgeFormik';
import { useFetchBridgeData } from '../hooks/useFetchBridgeData';
import { useGetChainId } from '../hooks/useGetChainId';
import { useSendTransactions } from '../hooks/useSendTransactions';
import { useSignTransaction } from '../hooks/useSignTransaction';
import { useWeb3App } from '../hooks/useWeb3App';
import { invalidateHistoryQuery } from '../queries/useGetHistory.query';
import { useGetRateMutation } from '../queries/useGetRate.mutation';
import { getCompletePathname } from '../utils/getCompletePathname';
import { getDefaultOption } from '../utils/getDefaultOption';
import { getInitialTokens, InitialTokensType } from '../utils/getInitialTokens';
import { mxClsx } from '../utils/mxClsx';

interface BridgeFormProps {
  mvxApiURL: string;
  mvxChainId: string;
  mvxAddress?: string;
  username?: string;
  nativeAuthToken?: string;
  callbackRoute?: string;
  explorerAddress: string;
  refetchTrigger?: number;
  TrimAddressComponent: (props: {
    text: string;
    color?: 'muted' | 'secondary' | string;
    className?: string;
  }) => JSX.Element;
  TransactionToastComponent: typeof TransactionToast;
  onSuccessfullySentTransaction?: (txHashes?: string[]) => void;
  onFailedSentTransaction?: (message?: string) => void;
  onMvxConnect: () => void;
  onMvxDisconnect?: () => void;
}

export const BridgeForm = ({
  mvxApiURL,
  mvxChainId,
  mvxAddress,
  username,
  nativeAuthToken,
  callbackRoute = '/',
  explorerAddress,
  refetchTrigger,
  TrimAddressComponent,
  TransactionToastComponent,
  onSuccessfullySentTransaction,
  onFailedSentTransaction,
  onMvxConnect,
  onMvxDisconnect
}: BridgeFormProps) => {
  const [isTokenSelectorVisible, setIsTokenSelectorVisible] = useState(false);
  const [pendingSigning, setPendingSigning] = useState(false);
  const [siginingTransactionsCount, setSigningTransactionsCount] =
    useState<number>(0);
  const navigate = useNavigate();
  const account = useAccount();
  const { chains: sdkChains } = useSwitchChain();
  const { config } = useWeb3App();

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
    mvxApiURL
  });

  const isTokensLoading =
    tokensLoading ||
    isLoadingEvmTokensBalances ||
    isLoadingMvxTokensBalances ||
    isChainsLoading;

  const activeChain = useMemo(() => {
    return sdkChains.find(
      (chain) => chain.id.toString() === chainId.toString()
    );
  }, [chainId, sdkChains]);

  const mvxChain = useMemo(() => {
    return chains.find(
      (chain) => chain.chainId.toString() === mvxChainId.toString()
    );
  }, [chainId, chains]);

  const { signTransaction } = useSignTransaction();
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

  const ref = useRef(null);

  const [firstToken, setFirstToken] = useState<OptionType | undefined>();
  const [firstAmount, setFirstAmount] = useState('');
  const [secondToken, setSecondToken] = useState<OptionType | undefined>();
  const [secondAmount, setSecondAmount] = useState('');

  const bridgeAddress = account.address;
  const isAuthenticated = account.isConnected && Boolean(bridgeAddress);

  // const fee = useMemo(() => {
  //   return rate?.fee ?? '';
  // }, [rate]);

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

  const toOptions = useMemo(
    () =>
      (mvxTokensWithBalances &&
        mvxTokensWithBalances.map((token) => {
          return {
            ...token,
            identifier: token.address,
            ticker: token.symbol
          };
        })) ??
      [],
    [mvxTokensWithBalances]
  );

  const firstSelectOptions =
    useMemo(
      () =>
        fromOptions?.filter(
          (option) => option.identifier !== secondToken?.token?.address
        ),
      [secondToken, fromOptions]
    ) ?? fromOptions?.[0];

  const secondSelectOptions = useMemo(
    () =>
      toOptions.filter(
        (option) => option.identifier !== firstToken?.token?.address
      ),
    [firstToken, toOptions]
  );

  const selectedChainOption = useMemo(
    () =>
      chains?.find((option) => option.chainId === activeChain?.id) ??
      chains?.[0],
    [activeChain?.id, chains]
  );

  const hasAmounts = firstAmount !== '' && secondAmount !== '';

  const fetchRateDebounced = useCallback(
    debounce(async (amount: string) => {
      if (
        !amount ||
        !account.address ||
        !firstToken ||
        !secondToken ||
        !selectedChainOption
      ) {
        return;
      }

      getRate({
        nativeAuthToken: nativeAuthToken ?? '',
        body: {
          tokenIn: firstToken?.token.address,
          amountIn: amount,
          fromChainId: chainId.toString(),
          tokenOut: secondToken.token.address,
          toChainId: mvxChainId
        }
      });
    }, 500),
    [account.address, firstToken, secondToken, selectedChainOption]
  );

  const handleOnChangeFirstAmount = useCallback((amount: string) => {
    setFirstAmount(() => amount);
  }, []);

  const handleOnChangeSecondAmount = useCallback((amount: string) => {
    setSecondAmount(() => amount);
  }, []);

  const handleOnFirstMaxBtnChange = useCallback(() => {
    const formattedBalance = formatAmount({
      decimals: firstToken?.token?.decimals,
      input: firstToken?.token?.balance ?? '0',
      addCommas: false,
      digits: 4
    });

    handleOnChangeFirstAmount(formattedBalance);
  }, [
    firstToken?.token?.balance,
    firstToken?.token?.decimals,
    handleOnChangeFirstAmount
  ]);

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
      if (isTokensLoading || !bridgeAddress) {
        return;
      }

      const currentUrl = getCompletePathname();
      const searchParams = new URLSearchParams(window.location.search);

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
      navigate(newUrl, { replace: true });
    },
    [bridgeAddress, callbackRoute, isTokensLoading, navigate]
  );

  const onChangeFirstSelect = useCallback(
    (option?: TokenType) => {
      const selectOption = getDefaultOption(option);

      if (!selectOption) {
        return;
      }

      setFirstToken(selectOption);
      updateUrlParams({ firstTokenId: selectOption?.value });

      const secondOption = getDefaultOption(
        toOptions.find((x) => x.name === selectOption?.token.name)
      );

      if (!secondOption) {
        return;
      }

      setSecondToken(secondOption);
      updateUrlParams({ secondTokenId: secondOption?.value });
    },
    [toOptions]
  );

  const onChangeSecondSelect = useCallback(
    (option?: TokenType) => {
      const selectOption = getDefaultOption(option);

      if (!selectOption) {
        return;
      }

      setSecondToken(selectOption);
      updateUrlParams({ secondTokenId: selectOption?.value });

      const firstOption = getDefaultOption(
        fromOptions.find((x) => x.name === selectOption?.token.name)
      );

      if (!firstOption) {
        return;
      }

      setFirstToken(firstOption);
      updateUrlParams({ firstTokenId: firstOption?.value });
    },
    [fromOptions]
  );

  const setInitialSelectedTokens = useCallback(() => {
    if (isTokensLoading) {
      return;
    }

    const initialTokens = getInitialTokens();

    const hasOptionsSelected = Boolean(firstToken) && Boolean(secondToken);

    const firstOption =
      getDefaultOption(
        fromOptions?.find(({ identifier }) =>
          [initialTokens?.firstTokenId].includes(identifier)
        )
      ) ?? getDefaultOption(fromOptions[0]);

    const secondOption =
      getDefaultOption(
        toOptions?.find(
          ({ address }) =>
            address ===
            (firstOption?.token.name ?? initialTokens?.secondTokenId)
        )
      ) ??
      getDefaultOption(
        toOptions.find((x) => x.name === firstOption?.token.name)
      );

    if (hasOptionsSelected) {
      return;
    }

    if (!firstOption || !secondOption) {
      return;
    }

    setFirstToken(firstOption);
    setSecondToken(secondOption);

    updateUrlParams({
      firstTokenId: firstOption?.value,
      secondTokenId: secondOption?.value
    });
  }, [
    bridgeAddress,
    firstToken,
    fromOptions,
    isTokensLoading,
    secondToken,
    toOptions
  ]);

  const onSubmit = useCallback(
    async (transactions: ServerTransaction[]) => {
      const signedTransactions: ServerTransaction[] = [];
      setPendingSigning(true);
      setSigningTransactionsCount(() => transactions.length);

      try {
        let txIndex = -1;
        for (const transaction of transactions) {
          ++txIndex;
          try {
            const txHash = await signTransaction({
              ...transaction,
              value: BigInt(transaction.value),
              gas: BigInt(transaction.gasLimit),
              account: bridgeAddress as `0x${string}`
            });

            signedTransactions.push({
              ...transaction,
              txHash
            });

            setSigningTransactionsCount((prevState) => prevState - 1);

            if (txIndex === transactions.length - 1) {
              continue;
            }

            const transactionReceipt = await waitForTransactionReceipt(config, {
              confirmations: 1,
              hash: txHash
            });

            console.log({
              transactionReceipt,
              hash: txHash
            });
          } catch (e) {
            toast.error('Transaction aborted');
            onFailedSentTransaction?.('Transaction aborted');
            setPendingSigning(false);
            return;
          }
        }

        await sendTransactions({
          transactions: signedTransactions,
          url: getApiURL() ?? '',
          token: nativeAuthToken ?? ''
        });

        const txHashes = signedTransactions.map((tx) => tx.txHash);
        onSuccess(txHashes);
        setPendingSigning(false);
      } catch (e) {
        console.error(e);
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
      TransactionToastComponent,
      TrimAddressComponent,
      bridgeAddress,
      handleOnChangeFirstAmount,
      handleOnChangeSecondAmount,
      nativeAuthToken,
      onSuccess,
      sendTransactions,
      signTransaction
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
    resetSwapForm
  } = useBridgeFormik({
    nativeAuthToken,
    mvxAccountAddress: mvxAddress,
    firstToken,
    firstAmount,
    fromChainId: chainId.toString(),
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
  }, [firstAmount, fetchRateDebounced]);

  useEffect(() => {
    return setSecondAmount(rate?.amountOut ?? '');
  }, [rate]);

  useEffect(() => {
    updateUrlParams({ firstTokenId: '', secondTokenId: '' });

    const persistedOption = fromOptions?.find(
      (option) => option.address === firstToken?.token?.address
    );

    const firstChainSpecificOption = fromOptions?.find(
      (option) => option.chainId.toString() === chainId.toString()
    );

    onChangeFirstSelect(
      persistedOption?.chainId.toString() === chainId.toString()
        ? persistedOption
        : firstChainSpecificOption
    );
  }, [chainId, fromOptions, onChangeFirstSelect, refetchTrigger]);

  useEffect(setInitialSelectedTokens, [setInitialSelectedTokens, chainId]);

  return (
    <>
      <form
        ref={ref}
        noValidate
        className="liq-flex liq-flex-col liq-gap-1 liq-relative"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <EnterAmountCard
          className={mxClsx(
            'liq-pb-8 liq-pt-6 hover:liq-bg-neutral-700/50 sm:liq-pb-6',
            {
              'liq-pointer-events-none': isTokenSelectorVisible,
              'focus-within:liq-outline-neutral-700/75 hover:liq-outline-neutral-700/55 hover:focus-within:liq-outline-neutral-700/80':
                !isTokenSelectorVisible
            }
          )}
        >
          <BridgeWalletConnection
            disabled={isPendingRate}
            activeChain={selectedChainOption}
            TrimAddressComponent={TrimAddressComponent}
          />
          <div className="liq-flex liq-justify-between liq-gap-1">
            <EnterAmountInput
              inputName="firstAmount"
              inputValue={formik.values.firstAmount ?? ''}
              amountError={
                firstAmount !== ''
                  ? rateValidationError ?? firstAmountError
                  : undefined
              }
              disabled={isPendingRate}
              onInputDebounceChange={handleOnChangeFirstAmount}
              onInputChange={handleChange}
              onBlur={handleBlur}
            />
            <TokenSelector
              name={'firstToken'}
              disabled={isPendingRate}
              options={firstSelectOptions}
              areOptionsLoading={isTokensLoading}
              color="neutral-850"
              onChange={onChangeFirstSelect}
              onBlur={handleBlur}
              onMaxBtnClick={handleOnFirstMaxBtnChange}
              selectedOption={firstToken?.token}
              onTokenSelectorDisplay={(visible) =>
                setIsTokenSelectorVisible(visible)
              }
            />
          </div>
        </EnterAmountCard>
        <EnterAmountCard
          className={mxClsx(
            'liq-pb-8 liq-pt-6 hover:liq-bg-neutral-700/50 sm:liq-pb-6',
            {
              'liq-pointer-events-none': isTokenSelectorVisible
            }
          )}
        >
          <MvxAccountDisplay
            accountAddress={mvxAddress}
            chainIcon={mvxChain?.svgUrl ?? ''}
            username={username}
            accountExplorerUrl={`${explorerAddress}/accounts/${mvxAddress}`}
            TrimAddressComponent={TrimAddressComponent}
            showTag={true}
            onDisconnect={onMvxDisconnect}
          />
          <div className="liq-flex liq-justify-between liq-gap-1">
            <EnterAmountInput
              inputName="secondAmount"
              inputValue={formik.values.secondAmount ?? ''}
              amountError={
                secondAmount !== ''
                  ? fromChainError ?? secondAmountError
                  : undefined
              }
              disabled={true}
              omitDisableClass={true}
              onInputDebounceChange={handleOnChangeSecondAmount}
            />
            <TokenSelector
              name={'secondToken'}
              disabled={true}
              omitDisableClass={true}
              options={secondSelectOptions}
              areOptionsLoading={isTokensLoading}
              color="neutral-850"
              onChange={onChangeSecondSelect}
              onBlur={handleBlur}
              selectedOption={secondToken?.token}
            />
          </div>
        </EnterAmountCard>
        {/*{fee && (*/}
        {/*  <div className="liq-my-2 liq-ml-2 liq-flex liq-justify-start liq-rounded-xl liq-border liq-border-neutral-700 liq-px-4 liq-py-2 liq-text-sm liq-text-neutral-600">*/}
        {/*    {fee && `Fee: ${fee}`}*/}
        {/*  </div>*/}
        {/*)}*/}
        <div className="liq-flex liq-items-center liq-justify-center">
          {!mvxAddress && (
            <MvxConnectButton
              mvxAccountAddress={mvxAddress}
              chain={mvxChain}
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
            // Deposit button
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

import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { useAppKitNetwork } from '@reown/appkit/react';
import { waitForTransactionReceipt } from '@wagmi/core';
import { AxiosError } from 'axios';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useBridgeTokenSelection } from './hooks/useBridgeTokenSelection';
import { MVX_CHAIN_IDS } from '../../../constants';
import { getApiURL } from '../../../helpers/getApiURL';
import { ChainType } from '../../../types/chainType';
import { ProviderType } from '../../../types/providerType';
import { BaseTransaction, ServerTransaction } from '../../../types/transaction';
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
import { ToggleDirection } from '../ToggleDirection/ToggleDirection';
import { TokenSelector } from '../TokenSelector';

interface BridgeFormProps {
  mvxChainId: string;
  mvxAddress?: string;
  username?: string;
  callbackRoute?: string;
  firstTokenIdentifier?: string;
  secondTokenIdentifier?: string;
  firstTokenAmount?: string;
  secondTokenAmount?: string;
  refetchTrigger?: number;
  showHistory?: boolean;
  forcedDestinationTokenSymbol?: string;
  direction: 'deposit' | 'withdraw';
  onSuccessfullySentTransaction?: (txHashes?: string[]) => void;
  onFailedSentTransaction?: (message?: string) => void;
  onHistoryClose?: () => void;
  onMvxConnect: () => void;
  onMvxDisconnect?: () => void;
  onNavigate?: (url: string, options?: object) => void;
  onChangeDirection: () => void;
}

let fetchRateInterval: ReturnType<typeof setInterval>;

export const Deposit = ({
  mvxChainId,
  mvxAddress,
  username,
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
  onNavigate,
  onChangeDirection
}: BridgeFormProps) => {
  const ref = useRef(null);
  const [isTokenSelectorVisible, setIsTokenSelectorVisible] = useState(false);
  const [pendingSigning, setPendingSigning] = useState(false);
  const [forceRefetchRate, setForceRefetchRate] = useState(1);
  const [siginingTransactionsCount, setSigningTransactionsCount] =
    useState<number>(0);
  const account = useAccount();
  const { switchNetwork } = useAppKitNetwork();
  const {
    config,
    options,
    supportedChains: sdkChains,
    nativeAuthToken,
    bridgeOnly
  } = useWeb3App();
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

  const handleSwitchNetwork = useCallback(
    (chain: { id: string | number }) => {
      const sdkChain = sdkChains.find(
        (c) => c.id.toString() === chain.id.toString()
      );
      if (sdkChain) {
        switchNetwork(sdkChain);
      }
    },
    [sdkChains, switchNetwork]
  );

  const {
    firstToken,
    secondToken,
    fromOptions,
    toOptions,
    selectedChainOption,
    onChangeFirstSelect,
    onChangeSecondSelect,
    handleChangeDirection: handleTokenChangeDirection
  } = useBridgeTokenSelection({
    chains,
    activeChain,
    sdkChains,
    switchNetwork: handleSwitchNetwork,
    fromTokens: evmTokensWithBalances,
    toTokens: mvxTokensWithBalances,
    firstTokenIdentifier,
    secondTokenIdentifier,
    forcedDestinationTokenSymbol,
    isTokensLoading,
    callbackRoute,
    onNavigate
  });

  const isFirstTokenMvx = useMemo(() => {
    return firstToken
      ? MVX_CHAIN_IDS.includes(firstToken.chainId.toString())
      : false;
  }, [firstToken?.chainId]);

  const isSecondTokenMvx = useMemo(() => {
    return secondToken
      ? MVX_CHAIN_IDS.includes(secondToken.chainId.toString())
      : false;
  }, [secondToken?.chainId]);

  const [firstAmount, setFirstAmount] = useState(firstTokenAmount ?? '');
  const [secondAmount, setSecondAmount] = useState(secondTokenAmount ?? '');

  const firstTokenChain = useMemo(() => {
    if (!firstToken) {
      return selectedChainOption;
    }
    return (
      chains.find(
        (chain) => chain.chainId.toString() === firstToken.chainId.toString()
      ) ?? selectedChainOption
    );
  }, [firstToken?.chainId, chains, selectedChainOption]);

  const bridgeAddress = account.address;
  const isAuthenticated = account.isConnected && Boolean(bridgeAddress);

  const hasAmounts = firstAmount !== '' && secondAmount !== '';

  const fetchRateDebounced = useCallback(
    debounce(async (amount: string) => {
      if (
        !amount ||
        !Number(amount) ||
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
  }, []);

  const handleOnChangeSecondAmount = useCallback((amount: string) => {
    setSecondAmount(() => amount);
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

  const handleChangeDirection = () => {
    handleTokenChangeDirection();
    onChangeDirection();
  };

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
                  ...(transaction as BaseTransaction),
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
                  instructions: transaction.instructions,
                  recentBlockhash: transaction.recentBlockhash
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
      selectedChainOption,
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
    resetSwapForm
  } = useBridgeFormik({
    rate,
    sender: account.address ?? '',
    receiver: mvxAddress ?? '',
    firstToken,
    firstAmount,
    fromChainId: chainId?.toString(),
    toChainId: mvxChainId,
    secondToken,
    secondAmount,
    setForceRefetchRate,
    onSubmit
  });

  const hasError = Boolean(
    firstAmountError ||
      secondAmountError ||
      fromChainError ||
      rateValidationError
  );

  const amountErrorFirstInput = useMemo(() => {
    return firstAmount !== ''
      ? rateValidationError ?? firstAmountError
      : undefined;
  }, [firstAmountError, firstAmount, rateValidationError]);

  const amountErrorSecondInput = useMemo(() => {
    return secondAmount !== ''
      ? fromChainError ?? secondAmountError
      : undefined;
  }, [fromChainError, secondAmountError, secondAmount]);

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
    }, 50 * 1000); // 50sec

    return () => clearInterval(fetchRateInterval);
  }, [firstAmount, forceRefetchRate, fetchRateDebounced]);

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
              activeChain={firstTokenChain}
            />
          </div>
          <div className="liq-flex liq-justify-between liq-gap-1">
            <AmountInput
              inputName="firstAmount"
              inputValue={formik.values.firstAmount}
              amountError={amountErrorFirstInput}
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
              isMvxSelector={isFirstTokenMvx}
              isDestination={false}
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
        <div className="liq-absolute liq-left-[6%] liq-top-[40%] -liq-mt-1 liq-z-10">
          {bridgeOnly && (
            <ToggleDirection onChangeDirection={handleChangeDirection} />
          )}
        </div>
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
              chainIcon={mvxChain?.pngUrl ?? ''}
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
              inputValue={formik.values.secondAmount}
              amountError={amountErrorSecondInput}
              disabled={false}
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
              isMvxSelector={isSecondTokenMvx}
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
              icon={mvxChain?.pngUrl ?? ''}
              onClick={onMvxConnect}
            />
          )}
          {mvxAddress && !isAuthenticated && (
            <BridgeConnectButton
              className="liq-w-full liq-rounded-xl liq-bg-neutral-850/50 liq-px-8 liq-py-3 liq-font-semibold liq-text-primary-200 liq-transition-colors liq-duration-200 hover:enabled:liq-bg-primary-700/80 disabled:liq-opacity-50"
              disabled={isPendingRate}
              activeChain={firstTokenChain}
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
                    src={mvxChain?.pngUrl ?? ''}
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
                    src={mvxChain?.pngUrl ?? ''}
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
              on your wallet
            </div>
          </div>
        )}
      </form>
    </>
  );
};

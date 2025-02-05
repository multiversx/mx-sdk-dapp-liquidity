import { faWallet } from '@fortawesome/free-solid-svg-icons/faWallet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSwitchChain } from 'wagmi';
import { BridgeWalletConnection } from './BridgeWalletConnection';
import { BridgeConnectButton } from './Connect/BridgeConnectButton';
import { DisplayAmount } from './DisplayAmount';
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
import { invalidateHistoryQuery } from '../queries/useGetHistory.query';
import { useGetRateMutation } from '../queries/useGetRate.mutation';
import { delay } from '../utils/delay';
import { getCompletePathname } from '../utils/getCompletePathname';
import { getDefaultOption } from '../utils/getDefaultOption';
import { getInitialTokens, InitialTokensType } from '../utils/getInitialTokens';

interface BridgeFormProps {
  mvxApiURL: string;
  mvxChainId: string;
  mvxAddress?: string;
  username?: string;
  nativeAuthToken?: string;
  callbackRoute?: string;
  showTokenPriceDetails?: boolean;
  explorerAddress: string;
  refetchTrigger?: number;
  TrimAddressComponent: (props: {
    text: string;
    color?: 'muted' | 'secondary' | string;
    className?: string;
  }) => JSX.Element;
  TransactionToastComponent: typeof TransactionToast;
  onSuccessfullySentTransaction?: (txHash?: string) => void;
  onFailedSentTransaction?: (message?: string) => void;
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
  onSuccessfullySentTransaction
}: BridgeFormProps) => {
  const [pendingSigning, setPendingSigning] = useState(false);
  const navigate = useNavigate();
  const account = useAccount();
  const { chains: sdkChains } = useSwitchChain();

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
  const isAuthenticated =
    account.status === 'connected' && Boolean(bridgeAddress);

  useEffect(() => {
    return setSecondAmount(rate?.amountOut ?? '');
  }, [rate]);

  const fee = useMemo(() => {
    return rate?.fee ?? '';
  }, [rate]);

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

  const fetchRate = useCallback(async () => {
    if (
      !firstToken ||
      !secondToken ||
      !firstAmount ||
      firstAmount === '0' ||
      !selectedChainOption
    ) {
      return;
    }

    getRate({
      nativeAuthToken: nativeAuthToken ?? '',
      body: {
        tokenIn: firstToken.token.address,
        amountIn: firstAmount,
        fromChainId: chainId.toString(),
        tokenOut: secondToken.token.address,
        toChainId: mvxChainId
      }
    });
  }, [
    firstToken,
    secondToken,
    firstAmount,
    selectedChainOption,
    getRate,
    nativeAuthToken
  ]);

  const handleOnChangeFirstAmount = useCallback((amount: string) => {
    setFirstAmount(() => amount);
  }, []);

  const handleOnChangeSecondAmount = useCallback((amount: string) => {
    setSecondAmount(amount);
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
    async (txHash: string) => {
      handleOnChangeFirstAmount('');
      handleOnChangeSecondAmount('');

      // TODO rework this when the API cache will be fixed
      invalidateHistoryQuery();
      await delay(2000);
      invalidateHistoryQuery();
      await delay(2000);
      invalidateHistoryQuery();
      onSuccessfullySentTransaction?.(txHash);
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
    [toOptions, updateUrlParams]
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
    [fromOptions, updateUrlParams]
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
    toOptions,
    updateUrlParams
  ]);

  const onSubmit = useCallback(
    async (transactions: ServerTransaction[]) => {
      setPendingSigning(true);
      const signedTransactions: ServerTransaction[] = [];

      try {
        for (const transaction of transactions) {
          try {
            const hash = await signTransaction({
              ...transaction,
              value: BigInt(transaction.value),
              gas: BigInt(transaction.gasLimit),
              account: bridgeAddress as `0x${string}`
            });

            signedTransactions.push({
              ...transaction,
              hash
            });
          } catch (e) {
            toast.error('Failed to sign transaction');
            setPendingSigning(false);
            throw e;
          }
        }

        const sentTransaction = await sendTransactions({
          transactions: signedTransactions,
          url: getApiURL() ?? '',
          token: nativeAuthToken ?? ''
        });

        toast.info(
          (props) => (
            <TransactionToastComponent
              {...props}
              TrimAddressComponent={TrimAddressComponent}
            />
          ),
          {
            data: {
              hash: sentTransaction?.data.transactions[0].hash ?? ''
            }
          }
        );
        onSuccess(sentTransaction?.data.transactions[0].hash ?? '');
        setPendingSigning(false);
      } catch (e) {
        console.error(e);
        toast.error('Transaction cancelled');
        setPendingSigning(false);
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
    firstAmountError,
    secondAmountError,
    fromChainError,
    handleBlur,
    handleSubmit
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
    fetchRate();
  }, [fetchRate]);

  useEffect(() => {
    setFirstToken(undefined);
    setSecondToken(undefined);
    updateUrlParams({ firstTokenId: '', secondTokenId: '' });
  }, [chainId]);

  useEffect(() => {
    const selectedOption = fromOptions?.find(
      (option) => option.address === firstToken?.token?.address
    );
    onChangeFirstSelect(selectedOption);
  }, [firstToken?.token?.address, fromOptions, refetchTrigger]);

  useEffect(setInitialSelectedTokens, [setInitialSelectedTokens, chainId]);

  return (
    <>
      <form
        ref={ref}
        noValidate
        className="flex flex-col gap-1"
        onSubmit={handleSubmit}
      >
        <EnterAmountCard className="pb-8 pt-6 hover:bg-neutral-700/50 sm:pb-6">
          <BridgeWalletConnection
            disabled={isPendingRate}
            activeChain={selectedChainOption}
            TrimAddressComponent={TrimAddressComponent}
          />
          <div className="flex justify-between gap-1">
            <EnterAmountInput
              inputName="firstAmount"
              inputValue={firstAmount}
              amountError={
                account.address && firstAmount !== ''
                  ? rateValidationError ?? firstAmountError
                  : undefined
              }
              disabled={isPendingRate}
              onInputDebounceChange={handleOnChangeFirstAmount}
              onBlur={handleBlur}
            />
            <div className="flex flex-col items-end justify-between gap-4">
              <TokenSelector
                name={'firstToken'}
                disabled={isPendingRate}
                options={firstSelectOptions}
                areOptionsLoading={isTokensLoading}
                color="neutral-850"
                onChange={onChangeFirstSelect}
                onBlur={handleBlur}
                selectedOption={firstToken?.token}
              />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faWallet}
                    className="text-neutral-300"
                  />
                  <DisplayAmount
                    decimals={firstToken?.token?.decimals}
                    amount={firstToken?.token?.balance ?? '0'}
                    className="font-medium text-neutral-100"
                  />
                </div>
                <MxButton
                  btnSize="xs"
                  variant="neutral-800"
                  disabled={hasAmounts || isPendingRate}
                  onClick={handleOnFirstMaxBtnChange}
                >
                  <span className="text-neutral-300">MAX</span>
                </MxButton>
              </div>
            </div>
          </div>
        </EnterAmountCard>
        <EnterAmountCard className="pb-8 pt-6 hover:bg-neutral-700/50 sm:pb-6">
          <MvxAccountDisplay
            accountAddress={mvxAddress}
            username={username}
            accountExplorerUrl={`${explorerAddress}/accounts/${mvxAddress}`}
            TrimAddressComponent={TrimAddressComponent}
            showTag={true}
          />
          <div className="flex justify-between gap-1">
            <EnterAmountInput
              inputName="secondAmount"
              inputValue={secondAmount}
              amountError={
                account.address && secondAmount !== ''
                  ? fromChainError ?? secondAmountError
                  : undefined
              }
              disabled={true}
              omitDisableClass={true}
              onInputDebounceChange={handleOnChangeSecondAmount}
              onBlur={handleBlur}
            />
            <div className="flex flex-col items-end justify-between gap-4">
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
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faWallet}
                    className="text-neutral-300"
                  />
                  <DisplayAmount
                    decimals={secondToken?.token?.decimals}
                    amount={secondToken?.token?.balance ?? '0'}
                    className="font-medium text-neutral-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </EnterAmountCard>
        {fee && (
          <div className="my-2 ml-2 flex justify-start rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-600">
            {fee && `Fee: ${fee}`}
          </div>
        )}
        <div className="flex items-center justify-center">
          {!isAuthenticated && (
            <BridgeConnectButton
              className="focus-primary w-full rounded-xl bg-neutral-850/50 px-8 py-3 font-semibold text-primary-200 transition-colors duration-200 hover:enabled:bg-primary-700/80 disabled:opacity-50"
              disabled={isPendingRate}
              activeChain={selectedChainOption}
            />
          )}
          {isAuthenticated && (
            <MxButton
              type="submit"
              variant="primary"
              className="w-full bg-neutral-850/50 py-3 font-medium text-primary-200"
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
                <div className="flex justify-center gap-2 text-neutral-100">
                  <div>Deposit on </div>
                  <img
                    src={mvxChain?.svgUrl ?? ''}
                    alt=""
                    className="h-[1.5rem] w-[1.5rem]"
                  />
                  <div>MultiversX</div>
                </div>
              )}
              {!hasAmounts && !pendingSigning && (
                <span className="text-neutral-100">Enter amount</span>
              )}

              {pendingSigning && (
                <div className="flex justify-center gap-2 text-neutral-100">
                  <div>Depositing on</div>
                  <img
                    src={mvxChain?.svgUrl ?? ''}
                    alt=""
                    className="h-[1.5rem] w-[1.5rem]"
                  />
                  <div>MultiversX</div>
                </div>
              )}
            </MxButton>
          )}
        </div>
      </form>
    </>
  );
};

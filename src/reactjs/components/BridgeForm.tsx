import { faWallet } from '@fortawesome/free-solid-svg-icons/faWallet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import { useFetchBridgeData } from '../hooks/useFetchBridgeData.ts';
import { useSendTransactions } from '../hooks/useSendTransactions';
import { useSignTransaction } from '../hooks/useSignTransaction.ts';
import { useWeb3App } from '../hooks/useWeb3App';
import { useGetRateMutation } from '../queries/useGetRate.mutation';
import { getCompletePathname } from '../utils/getCompletePathname';
import { getDefaultOption } from '../utils/getDefaultOption';
import { getInitialTokens, InitialTokensType } from '../utils/getInitialTokens';

interface BridgeFormProps {
  mvxAddress?: string;
  username?: string;
  nativeAuthToken?: string;
  callbackRoute?: string;
  showTokenPriceDetails?: boolean;
  explorerAddress: string;
  refetchTrigger?: boolean;
  TrimAddressComponent: (props: {
    text: string;
    color?: 'muted' | 'secondary' | string;
    className?: string;
  }) => JSX.Element;
  TransactionToastComponent: typeof TransactionToast;
}

export const BridgeForm = ({
  mvxAddress,
  username,
  nativeAuthToken,
  callbackRoute = '/',
  explorerAddress,
  refetchTrigger,
  TrimAddressComponent,
  TransactionToastComponent
}: BridgeFormProps) => {
  const navigate = useNavigate();
  const account = useAccount();
  const { chains: sdkChains } = useSwitchChain();

  const { appKit } = useWeb3App();
  const chainId = Number(
    account.caipAddress?.split(':')[1] ?? appKit.getChainId()
  );

  const {
    tokensWithBalances,
    mvxTokensWithBalances,
    isTokensLoading: tokensLoading,
    isLoadingTokensBalances,
    chains = [],
    isChainsLoading
  } = useFetchBridgeData({
    refetchTrigger
  });

  const isTokensLoading =
    tokensLoading || isLoadingTokensBalances || isChainsLoading;

  const activeChain = useMemo(() => {
    return sdkChains.find((chain) => chain.id === chainId);
  }, [chainId, sdkChains]);

  const { signTransaction } = useSignTransaction();
  const sendTransactions = useSendTransactions();

  const {
    mutate: getRate,
    data: rate,
    isPending: isPendingRate
  } = useGetRateMutation();

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
      (tokensWithBalances &&
        tokensWithBalances.map((token) => {
          return {
            ...token,
            identifier: token.address,
            ticker: token.symbol
          };
        })) ??
      [],
    [tokensWithBalances]
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

  const selectedChainOption = useMemo(
    () =>
      chains?.find((option) => option.chainId === activeChain?.id) ??
      chains?.[0],
    [activeChain?.id, chains]
  );

  const fetchRate = useCallback(() => {
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
        fromChain: selectedChainOption?.chainType,
        tokenOut: secondToken.token.address,
        toChain: 'mvx'
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

  const handleOnChangeFirstAmount = (amount: string) => {
    setFirstAmount(() => amount);
  };
  const handleOnChangeSecondAmount = (amount: string) => {
    setSecondAmount(amount);
  };

  const handleOnChangeFirstSelect = (option?: OptionType) => {
    if (!option) {
      return;
    }
    setFirstToken(option);
  };
  const handleOnChangeSecondSelect = (option?: OptionType) => {
    if (!option) {
      return;
    }
    setSecondToken(option);
  };

  const handleOnFirstMaxBtnChange = () => {
    handleOnChangeFirstAmount(firstToken?.token?.balance ?? '0');
  };

  const onSuccess = () => {
    handleOnChangeFirstAmount('');
    handleOnChangeSecondAmount('');
  };

  const onSubmit = async (transaction: ServerTransaction) => {
    console.log('Signing and sending transaction', { transaction });
    try {
      const hash = await signTransaction({
        ...transaction,
        value: BigInt(transaction.value),
        gas: BigInt(transaction.gasLimit),
        account: bridgeAddress as `0x${string}`
      });
      console.log({ hash });

      if (!hash) {
        console.error('Error signing transaction');
        return;
      }

      const sentTransaction = await sendTransactions({
        transactions: [
          {
            ...transaction,
            hash
          }
        ],
        url: getApiURL() ?? '',
        token: nativeAuthToken ?? ''
      });

      console.log('sentTransaction', sentTransaction.data);
      toast(
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
      onSuccess();
    } catch (e) {
      console.error(e);
    }
  };

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
    fromChain: selectedChainOption?.chainType,
    secondToken,
    secondAmount,
    onSubmit
  });

  const onChangeFirstSelect = (option?: TokenType) => {
    const selectOption = getDefaultOption(option);
    handleOnChangeFirstSelect(selectOption);

    if (!selectOption) {
      return;
    }

    updateUrlParams({ firstTokenId: selectOption?.value });
  };

  const onChangeSecondSelect = (option?: TokenType) => {
    const selectOption = getDefaultOption(option);
    handleOnChangeSecondSelect(selectOption);
    if (!selectOption) {
      return;
    }

    updateUrlParams({ secondTokenId: selectOption?.value });
  };

  const hasAmounts = firstAmount !== '' && secondAmount !== '';

  const setInitialSelectedTokens = () => {
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
          ({ identifier }) => identifier === initialTokens?.secondTokenId
        )
      ) ?? getDefaultOption(toOptions?.[0]);

    if (hasOptionsSelected) {
      return;
    }

    if (!firstOption || !secondOption) {
      return;
    }

    handleOnChangeFirstSelect(firstOption);
    handleOnChangeSecondSelect(secondOption);

    updateUrlParams({
      firstTokenId: firstOption?.value,
      secondTokenId: secondOption?.value
    });
  };

  useEffect(setInitialSelectedTokens, [isTokensLoading]);

  useEffect(() => {
    setFirstToken((prevState) => {
      if (!prevState) {
        return;
      }

      const token = fromOptions.find(
        (option) => option.identifier === prevState.token.address
      );

      return token ? { ...prevState, token } : prevState;
    });

    setSecondToken((prevState) => {
      if (!prevState) {
        return;
      }

      const token = toOptions.find(
        (option) => option.identifier === prevState.token.address
      );

      return token ? { ...prevState, token } : prevState;
    });
  }, [tokensWithBalances]);

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

  const updateUrlParams = ({
    firstTokenId,
    secondTokenId
  }: InitialTokensType) => {
    if (isTokensLoading) {
      return;
    }

    const currentUrl = getCompletePathname();
    const searchParams = new URLSearchParams(window.location.search);

    if (firstToken) {
      searchParams.set('firstToken', firstTokenId ?? firstToken?.token.address);
    }

    if (secondToken) {
      searchParams.set(
        'secondToken',
        secondTokenId ?? secondToken.token.address
      );
    }

    const newUrl = `${callbackRoute}?${searchParams.toString()}`;

    if (currentUrl === newUrl) {
      return;
    }
    navigate(newUrl, { replace: true });
  };

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

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
              amountError={firstAmountError}
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
              amountError={fromChainError ? fromChainError : secondAmountError}
              disabled={true}
              onInputDebounceChange={handleOnChangeSecondAmount}
              onBlur={handleBlur}
            />
            <div className="flex flex-col items-end justify-between gap-4">
              <TokenSelector
                name={'secondToken'}
                disabled={true}
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
                !hasAmounts || isPendingRate || !mvxAddress || !account.address
              }
            >
              <span className="text-neutral-100">Enter amount</span>
            </MxButton>
          )}
        </div>
      </form>
    </>
  );
};

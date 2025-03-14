import { faArrowUpRightDots } from '@fortawesome/free-solid-svg-icons/faArrowUpRightDots';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BridgeHistory, MxButton, MxCard, mxClsx } from 'reactjs';
import { TokenType } from 'types';
import { AmountInput } from './components/AmountInput';
import { TokenSelector } from './components/TokenSelector';
import { confirmFiatRate } from '../../../../api/confirmFiatRate.ts';
import { getApiURL } from '../../../../helpers';
import { ProviderType } from '../../../../types/providerType.ts';
import { useFiatData } from '../../hooks/useFiatData';
import { useGetRateMutation } from '../../queries/useGetRate.mutation';

interface FiatFormProps {
  mvxChainId: string;
  mvxAddress?: string;
  nativeAuthToken?: string;
  showHistory?: boolean;
  onHistoryClose?: () => void;
}

export const FiatForm = ({
  mvxChainId,
  mvxAddress,
  nativeAuthToken,
  showHistory,
  onHistoryClose
}: FiatFormProps) => {
  const ref = useRef(null);
  const [isTokenSelectorVisible, setIsTokenSelectorVisible] = useState(false);
  const [firstToken, setFirstToken] = useState<TokenType | undefined>();
  const [amount, setAmount] = useState('');
  const [conversionRate, setConversionRate] = useState(0);

  const {
    currencies,
    mvxTokens,
    isTokensLoading: tokensLoading
  } = useFiatData();

  const [selectedCurrency, setSelectedCurrency] = useState<
    TokenType | undefined
  >();

  const {
    mutate: getRate,
    data: rate,
    isPending: isPendingRate,
    error: rateError
  } = useGetRateMutation();

  const availableTokens = useMemo(() => {
    if (!selectedCurrency?.availableTokens) {
      return [];
    }

    const foundTokens: TokenType[] = [];

    for (const ticker of selectedCurrency.availableTokens) {
      const foundToken = mvxTokens?.find(
        (mvxToken) => mvxToken.address === ticker
      );

      if (foundToken) {
        foundTokens.push(foundToken);
      }
    }

    return foundTokens;
  }, [mvxTokens, selectedCurrency]);

  const fromOptions = useMemo(
    () =>
      (availableTokens &&
        availableTokens.map((token) => {
          return {
            ...token,
            identifier: token.address,
            ticker: token.symbol
          };
        })) ??
      [],
    [availableTokens]
  );

  console.log({
    fromOptions
  });

  const fetchRateDebounced = useCallback(
    debounce(async (value: string) => {
      if (!value || !firstToken?.address || !selectedCurrency) {
        return;
      }

      getRate({
        nativeAuthToken: nativeAuthToken ?? '',
        body: {
          tokenIn: selectedCurrency.address,
          amountIn: value,
          fromChainId: mvxChainId.toString(),
          tokenOut: firstToken.address,
          toChainId: mvxChainId
        }
      });
    }, 500),
    [firstToken?.address, firstToken?.chainId, selectedCurrency]
  );

  const onChangeFirstSelect = useCallback((option?: TokenType) => {
    if (!option) {
      return;
    }

    setFirstToken(() => option);
  }, []);

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await confirmFiatRate({
      url: getApiURL(),
      nativeAuthToken: nativeAuthToken ?? '',
      body: {
        tokenIn: selectedCurrency?.address ?? '',
        amountIn: amount?.toString() ?? '',
        fromChainId: mvxChainId.toString(),
        tokenOut: firstToken?.address ?? '',
        toChainId: mvxChainId.toString(),
        amountOut: rate?.amountOut ?? '',
        sender: mvxAddress ?? '',
        receiver: mvxAddress ?? '',
        fee: rate?.fee ?? '0',
        provider: rate?.provider ?? ProviderType.None,
        orderId: rate?.orderId ?? ''
      }
    });

    const responseData = data?.[0];

    if (!responseData) {
      return;
    }

    const paymentURL = responseData.additionalInfo.url;

    if (!paymentURL) {
      return;
    }

    axios.post(paymentURL, {
      checksum: responseData.additionalInfo.checksum,
      jsonRequest: responseData.additionalInfo.jsonRequest
    });
  };

  useEffect(() => {
    fetchRateDebounced(amount);
  }, [amount, fetchRateDebounced]);

  useEffect(() => {
    setConversionRate(Number(rate?.amountOut ?? '0') / Number(amount || '1'));
  }, [rate?.amountOut, amount]);

  useEffect(() => {
    console.log('currencies.length', {
      currencies
    });
    if (currencies?.length) {
      setSelectedCurrency(() => currencies?.[0]);
    }
  }, [currencies?.length]);

  useEffect(() => {
    setFirstToken(fromOptions?.[0]);
  }, [fromOptions]);

  return (
    <form
      ref={ref}
      noValidate
      className="liq-flex liq-flex-col liq-gap-1 liq-relative"
      autoComplete="off"
      onSubmit={handleOnSubmit}
    >
      {showHistory && (
        <BridgeHistory
          mvxAddress={mvxAddress}
          onClose={() => onHistoryClose?.()}
        />
      )}
      <MxCard
        cardSize="lg"
        variant="neutral-750"
        className={mxClsx(
          'liq-flex liq-flex-col liq-gap-4 liq-outline liq-outline-transparent',
          'liq-py-12 sm:liq-py-6',
          {
            'liq-pointer-events-none': isTokenSelectorVisible
          }
        )}
      >
        <div className="liq-flex liq-items-center liq-justify-center liq-gap-1">
          <TokenSelector
            name={'firstToken'}
            disabled={isPendingRate}
            options={fromOptions}
            areOptionsLoading={tokensLoading}
            color="neutral-850"
            onChange={onChangeFirstSelect}
            selectedOption={firstToken}
            onTokenSelectorDisplay={(visible) =>
              setIsTokenSelectorVisible(visible)
            }
          />
        </div>
        <div className="liq-flex liq-flex-col liq-justify-between liq-gap-1 liq-text-center">
          <AmountInput
            inputName="amount"
            inputValue={amount}
            disabled={false}
            onInputDebounceChange={handleAmountChange}
          />
          <p
            className={`liq-text-sm mt-2 ${rateError ? 'liq-text-danger' : 'liq-text-gray-400'}`}
          >
            ⇅
            {rateError
              ? 'Error fetching rate'
              : `${conversionRate.toFixed(4)} ${firstToken?.symbol}`}
          </p>
        </div>
        <div className="liq-flex liq-justify-center liq-gap-3 liq-mt-6">
          {['50', '100', '500'].map((value) => (
            <button
              key={value}
              className="liq-bg-neutral-750/50 hover:liq-bg-neutral-700/50 liq-px-4 liq-py-2 liq-rounded-lg liq-text-neutral-200 hover:liq-text-neutral-50"
              onClick={(e) => {
                e.preventDefault();
                handleAmountChange(value);
              }}
            >
              €{value}
            </button>
          ))}
        </div>
      </MxCard>
      <MxButton
        type="submit"
        variant="neutral-850"
        className="liq-w-full disabled:liq-bg-neutral-850/50 liq-py-3 hover:enabled:liq-bg-primary !liq-text-primary-200"
        disabled={isPendingRate || !mvxAddress || Boolean(rateError)}
      >
        {Boolean(amount) && (
          <div className="liq-flex liq-justify-center liq-gap-2">
            <div>Continue</div>
            <FontAwesomeIcon
              icon={faArrowUpRightDots}
              className="liq-mx-1 liq-flex liq-items-center liq-text-end"
            />
          </div>
        )}
        {!Boolean(amount) && (
          <span className="liq-text-neutral-100">Enter amount</span>
        )}
      </MxButton>
    </form>
  );
};

import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TokenType } from '../../../types/token';
import { useFiat } from '../../context/useFiat.ts';
import { useFiatData } from '../../hooks/useFiatData';
import { useGetRateMutation } from '../../queries/useGetRate.mutation';
import { mxClsx } from '../../utils/mxClsx';
import { AmountInput } from '../AmountInput';
import { MxCard } from '../base';
import { BridgeHistory } from '../BridgeHistory';
import { TokenSelector } from '../TokenSelector';

interface FiatFormProps {
  mvxChainId: string;
  mvxAddress?: string;
  nativeAuthToken?: string;
  refetchTrigger?: number;
  showHistory?: boolean;
  onHistoryClose?: () => void;
}

export const FiatForm = ({
  mvxChainId,
  mvxAddress,
  nativeAuthToken,
  refetchTrigger,
  showHistory,
  onHistoryClose
}: FiatFormProps) => {
  const ref = useRef(null);
  const [isTokenSelectorVisible, setIsTokenSelectorVisible] = useState(false);
  const [firstToken, setFirstToken] = useState<TokenType | undefined>();
  const [firstAmount, setFirstAmount] = useState('');
  const { options } = useFiat();

  const {
    currencies,
    mvxTokensWithBalances,
    isTokensLoading: tokensLoading
  } = useFiatData({
    refetchTrigger,
    mvxAddress,
    mvxApiURL: options.mvxApiURL
  });

  const [selectedCurrency, setSelectedCurrency] = useState<
    TokenType | undefined
  >(currencies?.[0]);

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
      const foundToken = mvxTokensWithBalances?.find(
        (mvxToken) => mvxToken.address === ticker
      );

      if (foundToken) {
        foundTokens.push(foundToken);
      }
    }

    return foundTokens;
  }, [mvxTokensWithBalances, selectedCurrency]);

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
    [currencies]
  );

  const fetchRateDebounced = useCallback(
    debounce(async (amount: string) => {
      if (!amount || !firstToken?.address || !selectedCurrency) {
        return;
      }

      getRate({
        nativeAuthToken: nativeAuthToken ?? '',
        body: {
          tokenIn: selectedCurrency.address,
          amountIn: amount,
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

  useEffect(() => {
    fetchRateDebounced(firstAmount);
  }, [firstAmount, fetchRateDebounced]);

  return (
    <form
      ref={ref}
      noValidate
      className="liq-flex liq-flex-col liq-gap-1 liq-relative"
      autoComplete="off"
      onSubmit={() => {}}
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
          'liq-pb-8 liq-pt-6 hover:liq-bg-neutral-700/50 sm:liq-pb-6',
          {
            'liq-pointer-events-none': isTokenSelectorVisible,
            'focus-within:liq-outline-neutral-700/75 hover:liq-outline-neutral-700/55 hover:focus-within:liq-outline-neutral-700/80':
              !isTokenSelectorVisible
          }
        )}
      >
        <div className="liq-flex liq-items-center liq-gap-1">
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
        <div className="liq-flex liq-justify-between liq-gap-1">
          <AmountInput
            inputName="firstAmount"
            inputValue={''}
            disabled={false}
          />
        </div>
        <div>Fee: {rate?.fee}</div>
      </MxCard>
    </form>
  );
};

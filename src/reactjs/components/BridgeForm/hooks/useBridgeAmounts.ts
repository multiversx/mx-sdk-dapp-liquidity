import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { useCallback, useEffect, useState } from 'react';
import { TokenType } from '../../../../types/token';
import { BridgeFormikValuesEnum } from '../../../hooks/useBridgeFormik';

interface UseBridgeAmountsProps {
  firstToken?: TokenType;
  firstTokenAmount?: string;
  secondTokenAmount?: string;
  rate?: { amountOut?: string };
  rateValidationError?: string;
  formikSetFieldValue: (field: string, value: string) => void;
}

export const useBridgeAmounts = ({
  firstToken,
  firstTokenAmount,
  secondTokenAmount,
  rate,
  rateValidationError,
  formikSetFieldValue
}: UseBridgeAmountsProps) => {
  const [firstAmount, setFirstAmount] = useState(firstTokenAmount ?? '');
  const [secondAmount, setSecondAmount] = useState(secondTokenAmount ?? '');

  const handleOnChangeFirstAmount = useCallback((amount: string) => {
    setFirstAmount(amount);
  }, []);

  const handleOnChangeSecondAmount = useCallback((amount: string) => {
    setSecondAmount(amount);
  }, []);

  const handleOnFirstMaxBtnChange = useCallback(() => {
    const formattedBalance = formatAmount({
      decimals: firstToken?.decimals,
      input: firstToken?.balance ?? '0',
      addCommas: false,
      digits: 4
    });

    formikSetFieldValue('firstAmount', formattedBalance);
    handleOnChangeFirstAmount(formattedBalance);
  }, [
    firstToken?.balance,
    firstToken?.decimals,
    formikSetFieldValue,
    handleOnChangeFirstAmount
  ]);

  const clearAmounts = useCallback(() => {
    handleOnChangeFirstAmount('');
    handleOnChangeSecondAmount('');
  }, [handleOnChangeFirstAmount, handleOnChangeSecondAmount]);

  // Update second amount when rate changes
  useEffect(() => {
    if (rate?.amountOut) {
      formikSetFieldValue(BridgeFormikValuesEnum.secondAmount, rate.amountOut);
      setSecondAmount(rate.amountOut);
    }
  }, [rate?.amountOut, formikSetFieldValue]);

  // Reset second amount on validation error
  useEffect(() => {
    if (rateValidationError) {
      formikSetFieldValue(BridgeFormikValuesEnum.secondAmount, '0');
      setSecondAmount('0');
    }
  }, [rateValidationError, formikSetFieldValue]);

  // Initialize amounts from props
  useEffect(() => {
    if (firstTokenAmount) {
      formikSetFieldValue(BridgeFormikValuesEnum.firstAmount, firstTokenAmount);
      handleOnChangeFirstAmount(firstTokenAmount);
    }
  }, [firstTokenAmount, formikSetFieldValue, handleOnChangeFirstAmount]);

  useEffect(() => {
    if (secondTokenAmount) {
      formikSetFieldValue(
        BridgeFormikValuesEnum.secondAmount,
        secondTokenAmount
      );
      handleOnChangeSecondAmount(secondTokenAmount);
    }
  }, [secondTokenAmount, formikSetFieldValue, handleOnChangeSecondAmount]);

  return {
    firstAmount,
    secondAmount,
    handleOnChangeFirstAmount,
    handleOnChangeSecondAmount,
    handleOnFirstMaxBtnChange,
    clearAmounts,
    hasAmounts: firstAmount !== '' && secondAmount !== ''
  };
};

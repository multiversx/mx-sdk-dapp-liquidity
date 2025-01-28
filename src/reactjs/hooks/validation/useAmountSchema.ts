import * as yup from 'yup';
import { useTestDecimals } from './useTestDecimals';
import { useTestHasEnoughFunds } from './useTestHasEnoughFunds';
import { useTestMaximum } from './useTestMaximum';
import { useTestMinimum } from './useTestMinimum';

export const useAmountSchema = () => {
  const testDecimals = useTestDecimals();
  const testMinimum = useTestMinimum();
  const testMaximum = useTestMaximum();
  const testHasEnoughFunds = useTestHasEnoughFunds();

  const testStartDot = (value?: string) => !value?.startsWith('.');
  const testEndDot = (value?: string) => !value?.endsWith('.');

  return yup
    .string()
    .required('Amount is a required field')
    .test('decimals', 'Too many decimals', testDecimals)
    .test('startDot', 'Amount must not start with dot', testStartDot)
    .test('endDot', 'Amount must not end with dot', testEndDot)
    .test('minimum', testMinimum)
    .test('maximum', testMaximum)
    .test('funds', testHasEnoughFunds);
};

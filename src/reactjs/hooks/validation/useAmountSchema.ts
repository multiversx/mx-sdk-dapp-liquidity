import * as yup from 'yup';
import { useTestHasEnoughFunds } from './useTestHasEnoughFunds';

export const useAmountSchema = () => {
  const testHasEnoughFunds = useTestHasEnoughFunds();

  const testStartDot = (value?: string) => !value?.startsWith('.');
  const testEndDot = (value?: string) => !value?.endsWith('.');

  return yup
    .string()
    .required('Amount is a required field')
    .test('startDot', 'Amount must not start with dot', testStartDot)
    .test('endDot', 'Amount must not end with dot', testEndDot)
    .test('funds', testHasEnoughFunds);
};

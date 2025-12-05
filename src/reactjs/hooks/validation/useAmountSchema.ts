import * as yup from 'yup';
import { useTestHasEnoughFunds } from './useTestHasEnoughFunds';
import { useTestIsConnected } from './useTestIsConnected';

export const useAmountSchema = ({
  isMvxConnected
}: {
  isMvxConnected: boolean;
}) => {
  const testHasEnoughFunds = useTestHasEnoughFunds();
  const testIsConnected = useTestIsConnected({ isMvxConnected });

  const testStartDot = (value?: string) => !value?.startsWith('.');
  const testEndDot = (value?: string) => !value?.endsWith('.');

  return yup
    .string()
    .required('Amount is a required field')
    .test('account', testIsConnected)
    .test('startDot', 'Amount must not start with dot', testStartDot)
    .test('endDot', 'Amount must not end with dot', testEndDot)
    .test('funds', testHasEnoughFunds);
};

import * as yup from 'yup';

export const useAmountSchema = () => {
  const testStartDot = (value?: string) => !value?.startsWith('.');
  const testEndDot = (value?: string) => !value?.endsWith('.');

  return yup
    .string()
    .required('Amount is a required field')
    .test('startDot', 'Amount must not start with dot', testStartDot)
    .test('endDot', 'Amount must not end with dot', testEndDot);
};

import { useCallback } from 'react';
import { TestContext } from 'yup';
import { OptionType } from '../../../types/form';
import { hasEnoughFunds } from '../../utils/hasEnoughFunds';
import { testNumber } from '../../utils/testNumber';

export const useTestHasEnoughFunds = () => {
  const shouldThrow = useCallback(
    <T extends string | undefined>(value: T, context: TestContext) => {
      if (!testNumber(value)) {
        return false;
      }

      const asset = context.parent.firstToken as OptionType;

      const balance = asset?.token?.balance ?? '0';
      const decimals = asset?.token?.decimals;

      const hasFunds = hasEnoughFunds({
        balance: balance ?? '0',
        amount: value ?? '0',
        decimals
      });

      return !hasFunds;
    },
    []
  );

  return useCallback(
    <T extends string | undefined>(value: T, context: TestContext) => {
      if (!shouldThrow(value, context)) {
        return true;
      }

      return context.createError({
        message: 'Not enough funds',
        path: context.path
      });
    },
    [shouldThrow]
  );
};

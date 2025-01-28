import { useCallback } from 'react';
import { TestContext } from 'yup';
import { OptionType } from '../../../types/form';
import { testNumber } from '../../utils/testNumber';

export const useTestMinimum = () => {
  const shouldThrow = useCallback(
    <T extends string | undefined>(value: T, context: TestContext) => {
      if (!testNumber(value)) {
        return false;
      }

      const asset = context.parent.firstToken as OptionType;

      return (
        parseFloat(value ?? '0') <
        parseFloat(asset?.token?.metadata.minBridgeAmount ?? '0')
      );
    },
    []
  );

  const getMessage = useCallback((context: TestContext) => {
    const asset = context.parent.firstToken as OptionType;
    const min = asset?.token?.metadata.minBridgeAmount ?? '0';
    const currency = asset?.token?.name ?? '';

    return `Must be greater than ${min} ${currency}`;
  }, []);

  return useCallback(
    <T extends string | undefined>(value: T, context: TestContext) => {
      if (!shouldThrow(value, context)) {
        return true;
      }

      return context.createError({
        message: getMessage(context),
        path: context.path
      });
    },
    [shouldThrow, getMessage]
  );
};

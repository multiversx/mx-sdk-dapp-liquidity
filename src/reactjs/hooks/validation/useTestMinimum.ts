import { useCallback } from 'react';
import { TestContext } from 'yup';
import { TokenType } from '../../../types/token';
import { testNumber } from '../../utils/testNumber';

export const useTestMinimum = () => {
  const shouldThrow = useCallback(
    <T extends string | undefined>(value: T, context: TestContext) => {
      if (!testNumber(value)) {
        return false;
      }

      const asset = context.parent.firstToken as TokenType;

      return (
        parseFloat(value ?? '0') <
        parseFloat(asset?.metadata.minBridgeAmount ?? '0')
      );
    },
    []
  );

  const getMessage = useCallback((context: TestContext) => {
    const asset = context.parent.firstToken as TokenType;
    const min = asset?.metadata.minBridgeAmount ?? '0';
    const currency = asset?.name ?? '';

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

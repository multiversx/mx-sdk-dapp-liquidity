import { useCallback } from 'react';
import { TestContext } from 'yup';
import { TokenType } from '../../../types/token.ts';
import { testNumber } from '../../utils/testNumber';

export const useTestMaximum = () => {
  const shouldThrow = useCallback(
    <T extends string | undefined>(value: T, context: TestContext) => {
      if (!testNumber(value)) {
        return false;
      }
      const asset = context.parent.firstToken as TokenType;

      return (
        parseFloat(value ?? '0') >
        parseFloat(asset?.metadata.maxBridgeAmount ?? '0')
      );
    },
    []
  );

  const getMessage = useCallback((context: TestContext) => {
    const asset = context.parent.firstToken as TokenType;
    const max = asset?.metadata.maxBridgeAmount ?? '0';
    const currency = asset?.name ?? '';

    return `Must be lower than ${max} ${currency}`;
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

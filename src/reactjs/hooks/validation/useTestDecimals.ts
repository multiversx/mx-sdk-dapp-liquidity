import { useCallback } from 'react';
import { TestContext } from 'yup';
import { MAX_INPUT_DECIMALS } from '../../constants/general';

export const useTestDecimals = () => {
  const shouldThrow = useCallback(<T extends string | undefined>(value: T) => {
    const actualDecimals = value?.split('.')[1].length ?? 0;
    return actualDecimals > MAX_INPUT_DECIMALS;
  }, []);

  return useCallback(
    <T extends string | undefined>(value: T, context: TestContext) => {
      if (!shouldThrow(value)) {
        return true;
      }

      return context.createError({
        message: 'Too many decimals',
        path: context.path
      });
    },
    [shouldThrow]
  );
};

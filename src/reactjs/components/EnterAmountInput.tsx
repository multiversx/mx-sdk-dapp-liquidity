import { AmountInput } from '@multiversx/sdk-dapp-form/UI/Fields/AmountSelect/components/AmountInput/AmountInput';
import { ChangeEvent, FocusEvent } from 'react';
import { mxClsx } from '../utils/mxClsx';

export const EnterAmountInput = ({
  inputName,
  inputValue,
  disabled,
  amountError,
  omitDisableClass = false,
  className,
  onBlur,
  onInputDebounceChange,
  onInputChange
}: {
  inputName: string;
  inputValue: string;
  disabled?: boolean;
  amountError?: string;
  omitDisableClass?: boolean;
  className?: string;
  onBlur: (e: FocusEvent<HTMLElement>) => void;
  onInputDebounceChange?: (amount: string) => void;
  onInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const restProps = {
    className: mxClsx(
      `dapp-form-input-wrapper amount-input text-base lg:text-base`,
      {
        'disabled animate-pulse':
          (disabled && !omitDisableClass) || inputValue === ''
      },
      className
    )
  };

  return (
    <div className="flex w-full flex-col justify-between test-dapp-liquidity">
      <AmountInput
        required
        name={inputName}
        value={inputValue}
        placeholder="0"
        disabled={disabled}
        handleBlur={onBlur}
        {...(onInputDebounceChange
          ? { onDebounceChange: onInputDebounceChange }
          : {})}
        handleChange={onInputChange ?? (() => null)}
        {...restProps}
      />
      <div className="flex min-h-[2rem] items-end">
        {amountError && (
          <div className="text-danger text-xs">{amountError}</div>
        )}
      </div>
    </div>
  );
};

import { ChangeEvent, FocusEvent } from 'react';
import { NumericFormat } from 'react-number-format';
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
  onBlur?: (e: FocusEvent<HTMLElement>) => void;
  onInputDebounceChange?: (amount: string) => void;
  onInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="liq-flex liq-w-full liq-flex-col liq-justify-between">
      <div className="liq-flex liq-text-base liq-max-w-none liq-w-full liq-bg-transparent liq-relative">
        <NumericFormat
          name={inputName}
          value={inputValue}
          placeholder="0"
          allowLeadingZeros={true}
          thousandSeparator=","
          allowNegative={false}
          className={mxClsx(
            'liq-text-3xl liq-leading-9 liq-min-h-12 liq-py-0 liq-w-full liq-h-full liq-border-none liq-font-medium liq-px-0 liq-outline-0 liq-bg-transparent',
            {
              'liq-disabled liq-animate-pulse': disabled && !omitDisableClass
            },
            className
          )}
          onChange={onInputChange}
          onValueChange={async ({ value }) => {
            onInputDebounceChange?.(value);
          }}
          onBlur={onBlur}
        />
      </div>
      <div className="liq-flex liq-min-h-[2rem] liq-items-end">
        {amountError && (
          <div className="liq-text-danger liq-text-xs">{amountError}</div>
        )}
      </div>
    </div>
  );
};

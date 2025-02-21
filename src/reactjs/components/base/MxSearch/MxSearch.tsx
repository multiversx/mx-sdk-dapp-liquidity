import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Ref, forwardRef, useEffect, useState } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { mxClsx } from '../../../utils/mxClsx';

interface MxSearchProps {
  placeholder?: string;
  iconsClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
  inputDefaultValue?: string;
  onChange: (value: string) => void;
}

export const MxSearch = forwardRef(
  (props: MxSearchProps, ref: Ref<HTMLInputElement>) => {
    const {
      iconsClassName = '',
      inputClassName = '',
      containerClassName = '',
      placeholder = 'Search by name or symbol',
      inputDefaultValue = '',
      onChange
    } = props;

    const [inputValue, setInputValue] = useState(inputDefaultValue);
    const onDebounceInputChange = useDebounce(inputValue, 200);

    const onClear = () => setInputValue('');

    useEffect(() => onChange(onDebounceInputChange), [onDebounceInputChange]);

    return (
      <div
        className={`liq-relative liq-flex liq-flex-1 liq-items-center  ${containerClassName}`}
      >
        <FontAwesomeIcon
          icon={faSearch}
          className={mxClsx(
            'liq-pointer-events-none liq-absolute liq-inset-4 liq-top-1/3 liq-h-4 liq-w-4 liq-items-center liq-text-neutral-300',
            iconsClassName
          )}
        />

        <input
          value={inputValue}
          onChange={(val) => setInputValue(val.target.value)}
          placeholder={placeholder}
          className={mxClsx(
            'focus-primary liq-text-medium placeholder:liq-font-medium liq-flex liq-w-full liq-gap-2 liq-rounded-xl liq-border liq-border-neutral-800 liq-bg-neutral-900 liq-px-11 liq-py-2 placeholder:liq-text-neutral-300',
            inputClassName
          )}
          tabIndex={1}
          ref={ref}
        />

        {Boolean(inputValue) && (
          <FontAwesomeIcon
            icon={faClose}
            onClick={onClear}
            className={mxClsx(
              'liq-absolute liq-inset-4 liq-left-auto liq-top-1/3 liq-h-4 liq-w-4 liq-cursor-pointer liq-items-center liq-text-neutral-300 liq-transition-colors liq-duration-200 hover:liq-text-neutral-400',
              iconsClassName
            )}
          />
        )}
      </div>
    );
  }
);

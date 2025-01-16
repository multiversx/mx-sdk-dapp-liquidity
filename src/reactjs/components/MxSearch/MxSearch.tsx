import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Ref, forwardRef, useEffect, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { mxClsx } from '../../utils/mxClsx';

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
        className={`relative flex flex-1 items-center  ${containerClassName}`}
      >
        <FontAwesomeIcon
          icon={faSearch}
          className={mxClsx(
            'pointer-events-none absolute inset-4 top-1/3 h-4 w-4 items-center text-neutral-300',
            iconsClassName
          )}
        />

        <input
          value={inputValue}
          onChange={(val) => setInputValue(val.target.value)}
          placeholder={placeholder}
          className={mxClsx(
            'focus-primary text-medium placeholder:font-medium flex w-full gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-11 py-2 placeholder:text-neutral-300',
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
              'absolute inset-4 left-auto top-1/3 h-4 w-4 cursor-pointer items-center text-neutral-300 transition-colors duration-200 hover:text-neutral-400',
              iconsClassName
            )}
          />
        )}
      </div>
    );
  }
);

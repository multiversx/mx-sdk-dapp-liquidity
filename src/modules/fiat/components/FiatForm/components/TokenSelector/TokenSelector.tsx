import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { mxClsx } from 'reactjs/utils/mxClsx';
import { TokenType } from 'types/token';
import { SelectContainer } from './components/SelectContainer';
import { SelectContent } from './components/SelectContent';
import { SelectedOption } from './components/SelectedOption';

export const TokenSelector = ({
  name,
  options = [],
  selectedOption,
  areOptionsLoading = false,
  className = '',
  disabled = false,
  color = 'neutral-750',
  onBlur,
  onChange,
  onTokenSelectorDisplay
}: {
  name: string;
  options: TokenType[];
  selectedOption?: TokenType;
  areOptionsLoading?: boolean;
  disabled?: boolean;
  className?: string;
  color?: 'neutral-750' | 'neutral-850';
  onChange: (option?: TokenType) => void;
  onBlur?: (e: React.FocusEvent<any, HTMLButtonElement>) => void;
  onTokenSelectorDisplay?: (visible: boolean) => void;
}) => {
  const [show, setShow] = useState(false);

  const handleOnClick = () => setShow(true);

  useEffect(() => {
    onTokenSelectorDisplay?.(show);
  }, [show]);

  if (areOptionsLoading) {
    return (
      <div
        className={mxClsx(
          'liq-h-12 liq-w-40 liq-animate-pulse',
          {
            'liq-rounded-xl': true,
            'liq-rounded-lg': true
          },
          {
            'liq-bg-neutral-100 liq-bg-opacity-[0.1] hover:liq-bg-opacity-[0.25]':
              color === 'neutral-750',
            'liq-bg-neutral-100 liq-bg-opacity-[0.05] hover:liq-bg-opacity-[0.15]':
              color === 'neutral-850'
          },
          className
        )}
      />
    );
  }

  return (
    <>
      {show && (
        <SelectContainer onClose={() => setShow(false)}>
          <SelectContent
            onSelect={(token) => {
              onChange(token);
              setShow(false);
            }}
            tokens={options}
            selectedToken={selectedOption}
          />
        </SelectContainer>
      )}

      {!show && (
        <div className="liq-flex liq-flex-col liq-items-end liq-justify-between liq-gap-4">
          <button
            name={name}
            type="button"
            role="combobox"
            className={mxClsx(
              'focus-primary liq-group liq-flex liq-cursor-pointer liq-items-center liq-gap-2 liq-transition-colors liq-duration-200 liq-relative',
              {
                'liq-rounded-lg liq-px-1 liq-py-1 liq-pr-3': true
              },
              {
                'liq-bg-neutral-750/50 hover:enabled:liq-bg-neutral-750':
                  color === 'neutral-750',
                'liq-bg-neutral-900/50 liq-outline liq-outline-1 liq-outline-neutral-700/20 hover:enabled:liq-bg-neutral-600/50 hover:enabled:liq-outline-neutral-600':
                  color === 'neutral-850'
              },
              {
                '!liq-cursor-not-allowed': disabled
              },
              className
            )}
            onBlur={onBlur}
            onClick={handleOnClick}
            disabled={disabled}
          >
            <SelectedOption value={selectedOption} />

            {!disabled && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className="liq-text-neutral-200 group-hover:liq-text-neutral-50"
              />
            )}
          </button>
        </div>
      )}
    </>
  );
};

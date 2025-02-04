import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo, useState } from 'react';
import { SelectedOption } from './components/SelectedOption';
import { SelectModal } from './components/SelectModal';
import { TokenType } from '../../../types/token';
import { MVX_CHAIN_IDS } from '../../constants/general.ts';
import { useGetChainsQuery } from '../../queries/useGetChains.query';
import { mxClsx } from '../../utils/mxClsx';

export const TokenSelector = ({
  name,
  options = [],
  selectedOption,
  areOptionsLoading = false,
  className = '',
  disabled = false,
  color = 'neutral-750',
  onBlur,
  onChange
}: {
  name: string;
  options: TokenType[];
  selectedOption?: TokenType;
  areOptionsLoading?: boolean;
  disabled?: boolean;
  className?: string;
  color?: 'neutral-750' | 'neutral-850';
  onChange: (option?: TokenType) => void;
  onBlur: (e: React.FocusEvent<any, HTMLButtonElement>) => void;
}) => {
  const [show, setShow] = useState(false);

  const { data, isLoading: areChainsLoading } = useGetChainsQuery();

  const chains = useMemo(() => {
    return (
      data?.filter(
        (chain) => !MVX_CHAIN_IDS.includes(Number(chain.chainId.toString()))
      ) ?? []
    );
  }, [data]);

  const handleOnClick = () => setShow(true);

  if (areOptionsLoading || areChainsLoading) {
    return (
      <div
        className={mxClsx(
          'h-12 w-40 animate-pulse',
          {
            'rounded-xl': true,
            'rounded-e-lg rounded-s-3xl': true
          },
          {
            'bg-neutral-100 bg-opacity-[0.1] hover:bg-opacity-[0.25]':
              color === 'neutral-750',
            'bg-neutral-100 bg-opacity-[0.05] hover:bg-opacity-[0.15]':
              color === 'neutral-850'
          },
          className
        )}
      />
    );
  }

  return (
    <>
      <SelectModal
        visible={show}
        onClose={() => setShow(false)}
        onSelect={onChange}
        tokens={options}
        chains={chains}
        areChainsLoading={areChainsLoading}
        selectedToken={selectedOption}
      />
      <button
        name={name}
        type="button"
        role="combobox"
        className={mxClsx(
          'focus-primary group flex cursor-pointer items-center gap-2 transition-colors duration-200 disabled:opacity-50',
          {
            'rounded-e-lg rounded-s-3xl px-1 py-1 pr-3': true
          },
          {
            'bg-neutral-750/50 hover:enabled:bg-neutral-750':
              color === 'neutral-750',
            'bg-neutral-900/50 outline outline-1 outline-neutral-700/20 hover:enabled:bg-neutral-600/50 hover:enabled:outline-neutral-600':
              color === 'neutral-850'
          },
          {
            'cursor-not-allowed': disabled
          },
          className
        )}
        onBlur={onBlur}
        onClick={handleOnClick}
        disabled={disabled}
      >
        <SelectedOption value={selectedOption} />

        <FontAwesomeIcon
          icon={faChevronDown}
          className="text-neutral-200 group-hover:text-neutral-50"
        />
      </button>
    </>
  );
};

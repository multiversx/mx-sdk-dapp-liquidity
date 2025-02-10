import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faWallet } from '@fortawesome/free-solid-svg-icons/faWallet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { SelectContainer } from './components/SelectContainer.tsx';
import { SelectContent } from './components/SelectContent.tsx';
import { SelectedOption } from './components/SelectedOption';
// import { SelectModal } from './components/SelectModal';
import { TokenType } from '../../../types/token';
import { MVX_CHAIN_IDS } from '../../constants/general';
import { useResolveTokenChain } from '../../hooks/useResolveTokenChain';
import { useGetChainsQuery } from '../../queries/useGetChains.query';
import { mxClsx } from '../../utils/mxClsx';
import { DisplayAmount } from '../DisplayAmount';
import { MxButton } from '../MxButton';

export const TokenSelector = ({
  name,
  options = [],
  selectedOption,
  areOptionsLoading = false,
  className = '',
  disabled = false,
  omitDisableClass = false,
  color = 'neutral-750',
  onBlur,
  onChange,
  onMaxBtnClick,
  onTokenSelectorDisplay
}: {
  name: string;
  options: TokenType[];
  selectedOption?: TokenType;
  areOptionsLoading?: boolean;
  disabled?: boolean;
  omitDisableClass?: boolean;
  className?: string;
  color?: 'neutral-750' | 'neutral-850';
  onChange: (option?: TokenType) => void;
  onBlur: (e: React.FocusEvent<any, HTMLButtonElement>) => void;
  onMaxBtnClick?: () => void;
  onTokenSelectorDisplay?: (visible: boolean) => void;
}) => {
  const [show, setShow] = useState(false);

  const { data, isLoading: areChainsLoading } = useGetChainsQuery();
  const { tokenChain, chainIcon } = useResolveTokenChain({
    token: selectedOption
  });

  const chains = useMemo(() => {
    return (
      data?.filter(
        (chain) => !MVX_CHAIN_IDS.includes(Number(chain.chainId.toString()))
      ) ?? []
    );
  }, [data]);

  const handleOnClick = () => setShow(true);

  useEffect(() => {
    onTokenSelectorDisplay?.(show);
  }, [show]);

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
      {/*<SelectModal*/}
      {/*  visible={show}*/}
      {/*  onClose={() => setShow(false)}*/}
      {/*  onSelect={onChange}*/}
      {/*  tokens={options}*/}
      {/*  chains={chains}*/}
      {/*  areChainsLoading={areChainsLoading}*/}
      {/*  selectedToken={selectedOption}*/}
      {/*/>*/}

      {show && (
        <SelectContainer onClose={() => setShow(false)}>
          <SelectContent
            onSelect={onChange}
            tokens={options}
            chains={chains}
            areChainsLoading={areChainsLoading}
            selectedToken={selectedOption}
          />
        </SelectContainer>
      )}

      {!show && (
        <div className="flex flex-col items-end justify-between gap-4">
          <button
            name={name}
            type="button"
            role="combobox"
            className={mxClsx(
              'focus-primary group flex cursor-pointer items-center gap-2 transition-colors duration-200 relative',
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
                'cursor-not-allowed disabled:opacity-50':
                  disabled && !omitDisableClass
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

            {chainIcon && (
              <img
                src={chainIcon}
                alt={tokenChain?.chainName}
                className="absolute left-5 bottom-0.5 chain-icon sm w-6 h-6"
              />
            )}
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faWallet} className="text-neutral-300" />
                <DisplayAmount
                  decimals={selectedOption?.decimals}
                  amount={selectedOption?.balance ?? '0'}
                  className="font-medium text-neutral-100"
                />
              </div>
              {onMaxBtnClick && (
                <MxButton
                  btnSize="xs"
                  variant="neutral-800"
                  disabled={disabled}
                  onClick={onMaxBtnClick}
                >
                  <span className="text-neutral-300">MAX</span>
                </MxButton>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

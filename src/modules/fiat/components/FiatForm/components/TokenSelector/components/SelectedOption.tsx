import { TokenType } from 'types/token';
import { TokenIcon } from './TokenIcon';
import { TokenSymbol } from './TokenSymbol';

export const SelectedOption = ({ value }: { value?: TokenType }) => {
  return (
    <>
      <TokenIcon
        size="lg"
        token={value}
        className="liq-flex liq-items-center liq-justify-center liq-relative"
      />

      <div className="liq-flex-1 liq-truncate liq-text-left">
        {value && (
          <div className="liq-flex liq-flex-col">
            <div className="liq-flex liq-items-center">
              <TokenSymbol
                token={value}
                className="liq-font-semibold liq-leading-none"
              />
            </div>
          </div>
        )}
        {!value && <div className="liq-text-neutral-500">Select token</div>}
      </div>
    </>
  );
};

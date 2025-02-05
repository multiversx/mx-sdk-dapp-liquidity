import { TokenIcon } from './TokenIcon';
import { TokenSymbol } from './TokenSymbol';
import { TokenType } from '../../../../types/token';

export const SelectedOption = ({ value }: { value?: TokenType }) => {
  return (
    <>
      <TokenIcon
        size="lg"
        token={value}
        className="flex items-center justify-center relative"
      />

      <div className="flex-1 truncate text-left">
        {value && (
          <div className="flex flex-col">
            <div className="flex items-center">
              <TokenSymbol
                token={value}
                className="font-semibold leading-none"
              />
            </div>
          </div>
        )}
        {!value && <div className="text-neutral-500">Select token</div>}
      </div>
    </>
  );
};

import { TokenType } from '../../../../types/token';
import { mxClsx } from '../../../utils/mxClsx';

interface TokenSymbolProps {
  className?: string;
  token: TokenType;
  wrapperClassName?: string;
}

export const TokenSymbol = ({
  token,
  className = '',
  wrapperClassName = ''
}: TokenSymbolProps) => {
  if (!token) {
    return <>...</>;
  }

  const { symbol } = token;

  return (
    <div
      className={mxClsx(
        'liq-flex liq-items-center liq-gap-2',
        wrapperClassName
      )}
    >
      <span className={className}>{symbol}</span>
    </div>
  );
};

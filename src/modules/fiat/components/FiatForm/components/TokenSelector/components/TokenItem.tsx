import { TokenType } from 'types';
import { TokenIcon } from './TokenIcon';

export const TokenItem = ({
  token,
  onClick,
  selected
}: {
  token: TokenType;
  onClick: (token: TokenType) => void;
  selected: boolean;
}) => {
  return (
    <div
      className={`token-item ${
        selected ? 'liq-selected' : ''
      } liq-flex liq-cursor-pointer liq-items-center liq-justify-between liq-rounded-lg liq-p-2 hover:liq-bg-neutral-700 liq-bg-neutral-850`}
      onClick={() => onClick(token)}
    >
      <div className="liq-flex liq-w-full liq-items-center liq-relative">
        <TokenIcon
          size="sm"
          token={token}
          className="liq-flex liq-items-center liq-justify-center"
        />
        <div className="liq-ml-2">
          <div className="liq-text-sm liq-font-bold">{token.symbol}</div>
          <div className="liq-text-xs liq-text-gray-400">{token.name}</div>
        </div>
      </div>
    </div>
  );
};

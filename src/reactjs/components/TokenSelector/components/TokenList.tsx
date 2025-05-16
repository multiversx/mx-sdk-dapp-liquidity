import { TokenItem } from './TokenItem';
import { TokenType } from '../../../../types/token';

export const TokenList = ({
  tokens,
  onSelect,
  selectedToken
}: {
  tokens: TokenType[];
  onSelect: (token: TokenType) => void;
  selectedToken?: TokenType;
}) => {
  return (
    <div className="token-list liq-flex liq-flex-col liq-gap-1">
      {tokens.map((token) => (
        <TokenItem
          key={`${token.address}-${token.chainId}`}
          token={token}
          onClick={onSelect}
          selected={selectedToken?.address === token.address}
        />
      ))}
    </div>
  );
};

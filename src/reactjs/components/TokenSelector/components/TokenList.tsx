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
    <div className="token-list flex flex-col gap-1 ml-2">
      {tokens.map((token) => (
        <TokenItem
          key={token.address}
          token={token}
          onClick={onSelect}
          selected={selectedToken?.address === token.address}
        />
      ))}
    </div>
  );
};

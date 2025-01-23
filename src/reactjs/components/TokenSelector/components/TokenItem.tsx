import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { TokenIcon } from './TokenIcon';
import { TokenType } from '../../../../types/token';

export const TokenItem = ({
  token,
  onClick,
  selected
}: {
  token: TokenType;
  onClick: (token: TokenType) => void;
  selected: boolean;
}) => {
  const formattedBalance = formatAmount({
    decimals: token.decimals,
    input: token.balance ?? '0',
    addCommas: true,
    digits: 4
  });

  console.log({ token, formattedBalance });

  return (
    <div
      className={`token-item ${
        selected ? 'selected' : ''
      } flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-neutral-700`}
      onClick={() => onClick(token)}
    >
      <div className="ml-2 flex w-full items-center">
        <TokenIcon
          size="xl"
          token={token}
          className="mx-2 flex items-center justify-center"
        />
        <div>
          <div className="text-sm font-bold">{token.symbol}</div>
          <div className="text-xs text-gray-400">{token.name}</div>
        </div>
        <div className="ml-auto mr-0 flex justify-end">
          <div className="text-sm font-bold">{formattedBalance}</div>
        </div>
      </div>
    </div>
  );
};

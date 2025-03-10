import { useEffect, useState } from 'react';
import { MxSearch } from 'reactjs';
import { TokenType } from 'types';
import { TokenList } from './TokenList';

export const SelectContent = ({
  onSelect,
  tokens = [],
  selectedToken
}: {
  onSelect: (token: TokenType) => void;
  tokens: TokenType[];
  selectedToken?: TokenType;
}) => {
  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [selected, setSelected] = useState(selectedToken);

  const handleSelect = (token: TokenType) => {
    setSelected(token);
    onSelect(token);
  };

  const handleSearch = (pattern: string) => {
    const filtered = tokens.filter((token) =>
      token.symbol.toLowerCase().includes(pattern.toLowerCase())
    );
    setFilteredTokens(filtered);
  };

  useEffect(() => {
    setFilteredTokens(tokens);
    setSelected(selectedToken);
  }, [selectedToken, tokens]);

  return (
    <div className="liq-relative liq-flex liq-max-w-full liq-flex-col liq-rounded-none liq-p-0 !liq-max-h-[22rem]">
      <div className="liq-flex liq-flex-col liq-gap-3 liq-rounded-t-2xl liq-p-2">
        <MxSearch
          inputClassName="!liq-bg-neutral-750 liq-border liq-border-neutral-750"
          placeholder="Search token"
          onChange={handleSearch}
        />
      </div>

      <div className="scrollbar-thin liq-flex liq-flex-col liq-gap-2 liq-overflow-y-scroll liq-border-t liq-border-neutral-750 liq-pb-3">
        <TokenList
          tokens={filteredTokens}
          onSelect={handleSelect}
          selectedToken={selected}
        />
      </div>
    </div>
  );
};

import { useEffect, useMemo, useState } from 'react';
import { ChainSelect } from './ChainSelect/ChainSelect';
import { TokenList } from './TokenList';
import { ChainDTO } from '../../../../dto/Chain.dto';
import { TokenType } from '../../../../types/token';
import { MxSearch } from '../../MxSearch';

export const SelectContent = ({
  onSelect,
  tokens = [],
  chains = [],
  areChainsLoading,
  selectedToken
}: {
  onSelect: (token: TokenType) => void;
  tokens: TokenType[];
  chains: ChainDTO[];
  areChainsLoading?: boolean;
  selectedToken?: TokenType;
}) => {
  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [selectedChainId, setSelectedChainId] = useState('0');
  const [selected, setSelected] = useState(selectedToken);

  const filteredTokensText = useMemo(() => {
    const selectedChain = chains.find(
      (chain) => chain.chainId.toString() === selectedChainId
    );

    if (!selectedChain) {
      return `Tokens on all networks (${tokens.length})`;
    }

    return `Tokens on ${selectedChain.chainName} (${filteredTokens.length})`;
  }, [chains, filteredTokens.length, selectedChainId, tokens.length]);

  const handleSelect = (token: TokenType) => {
    setSelected(token);
    onSelect(token);
  };

  useEffect(() => {
    setFilteredTokens(tokens);
    setSelected(selectedToken);
  }, [selectedToken, tokens]);

  const handleSearch = (pattern: string) => {
    const filtered = tokens.filter((token) =>
      token.symbol.toLowerCase().includes(pattern.toLowerCase())
    );
    setFilteredTokens(filtered);
  };

  useEffect(() => {
    if (selectedChainId === '0') {
      setFilteredTokens(tokens);
    } else {
      const filtered = tokens.filter(
        (token) => token.chainId.toString() === selectedChainId.toString()
      );
      setFilteredTokens(filtered);
    }
  }, [selectedChainId, tokens]);

  return (
    <div className="liq-relative liq-flex liq-max-w-full liq-flex-col liq-rounded-none liq-p-0 liq-max-h-[50vh]">
      <div className="liq-flex liq-flex-col liq-gap-3 liq-rounded-t-2xl liq-p-2">
        <div className="liq-flex liq-gap-2">
          <MxSearch
            inputClassName="!liq-bg-neutral-750 liq-border liq-border-neutral-750"
            placeholder="Search token"
            onChange={handleSearch}
          />
          <ChainSelect
            chains={chains}
            selectedChainId={selectedChainId}
            onChange={(chainId) => {
              setSelectedChainId(chainId);
            }}
            isLoading={areChainsLoading}
          />
        </div>
      </div>

      <div className="scrollbar-thin liq-flex liq-flex-col liq-gap-2 liq-overflow-y-scroll liq-border-t liq-border-neutral-750 liq-pb-3">
        <div className="liq-flex liq-text-left liq-text-neutral-300 liq-mt-4 liq-ml-2">
          {filteredTokensText}
        </div>
        <TokenList
          tokens={filteredTokens}
          onSelect={handleSelect}
          selectedToken={selected}
        />
      </div>
    </div>
  );
};

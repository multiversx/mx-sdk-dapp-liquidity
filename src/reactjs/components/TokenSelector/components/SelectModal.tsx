import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { TokenList } from './TokenList';
import { TokenType } from '../../../../types/token';
import { MxButton } from '../../MxButton';
import { MxModal } from '../../MxModal';
import { MxSearch } from '../../MxSearch';

export const SelectModal = ({
  visible,
  onClose,
  onSelect,
  tokens = [],
  selectedToken
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (token: TokenType) => void;
  tokens: TokenType[];
  selectedToken?: TokenType;
}) => {
  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [selected, setSelected] = useState(selectedToken);

  console.log({ filteredTokens });

  const handleSelect = (token: TokenType) => {
    setSelected(token);
    onSelect(token);
    onClose();
  };

  useEffect(() => {
    if (visible) {
      setFilteredTokens(tokens);
      setSelected(selectedToken);
    }
  }, [selectedToken, tokens, visible]);

  const handleSearch = (pattern: string) => {
    const filtered = tokens.filter((token) =>
      token.symbol.toLowerCase().includes(pattern.toLowerCase())
    );
    setFilteredTokens(filtered);
  };

  return (
    <MxModal
      show={visible}
      onClose={onClose}
      className="relative flex max-h-screen max-w-full flex-col rounded-none p-0 md:max-h-[80vh] md:w-[28rem] md:rounded-2xl"
    >
      <div className="flex flex-col gap-3 rounded-t-2xl border border-b-0 border-dashed border-primary border-opacity-40 p-6">
        <div className="absolute -ml-5 -mt-5 h-10 w-full origin-top bg-primary bg-opacity-80 opacity-20 blur-3xl" />
        <div className="flex items-center justify-between">
          <div>Select a token</div>
          <MxButton
            btnSize="md"
            variant="link-neutral-500"
            className="z-10 border-none px-0"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faClose} size="xl" />
          </MxButton>
        </div>

        <MxSearch
          inputClassName="bg-neutral-750 border border-neutral-750"
          onChange={handleSearch}
        />
      </div>

      <div className="scrollbar-thin flex flex-col gap-2 overflow-y-scroll border-t border-neutral-750 pb-3">
        <TokenList
          tokens={filteredTokens}
          onSelect={handleSelect}
          selectedToken={selected}
        />
      </div>
    </MxModal>
  );
};

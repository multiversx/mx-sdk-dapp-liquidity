import type { FormatOptionLabelContext } from 'react-select';
import { ChainOptionLabel } from './ChainOptionLabel';
import { SmallLoader } from '../../../../SmallLoader';
import { ChainSelectOptionType } from '../types/chainSelectOption';

export const FormatChainOptionLabel = (
  option: ChainSelectOptionType,
  { context }: { context: FormatOptionLabelContext }
) => {
  const { chain } = option;
  const inDropdown = context === 'menu';

  const args = {
    chain,
    inDropdown
  };

  if (option.value === 'loader') {
    return (
      <div className="liq-flex liq-justify-center liq-py-5">
        <SmallLoader show={true} />
      </div>
    );
  }

  return <ChainOptionLabel {...args} />;
};

import { Placement } from 'react-joyride';
import { mxClsx } from '../../../../utils/mxClsx';
import { MxTooltip } from '../../../base/MxTooltip';

interface PrecisedAmountProps {
  amount: string;
  digits: number;
  prefix: string;
  sufix: string;
  className?: string;
  shouldShowTooltip?: boolean;
  tooltipPlacement?: Placement;
}

export const MAX_DISPLAY_ZERO_DECIMALS = 5;

export const PrecisedAmount = ({
  amount,
  digits,
  className,
  prefix,
  sufix,
  tooltipPlacement,
  shouldShowTooltip = true,
  ...rest
}: PrecisedAmountProps) => {
  const valueParts = String(amount)?.split('.');
  const decimalArray = valueParts[1]?.split('') ?? [];
  const areAllDigitsZeroes = decimalArray?.every((digit) => digit === '0');

  const firstNonZeroIndex = decimalArray?.findIndex((digit) => digit !== '0');
  const nonZeroDecimalsArr = [];

  for (let i = firstNonZeroIndex; i <= decimalArray?.length - 1; i++) {
    if (nonZeroDecimalsArr.length < Math.max(digits, 2)) {
      nonZeroDecimalsArr.push(decimalArray[i]);
    }
  }

  if (firstNonZeroIndex > MAX_DISPLAY_ZERO_DECIMALS) {
    const nonZeroDecimals = nonZeroDecimalsArr?.join('');

    return (
      <MxTooltip
        placement={tooltipPlacement}
        buttonText={
          <span {...rest} className={mxClsx(className)}>
            {prefix}
            {valueParts[0]}
            .0
            <sub className={mxClsx(className, 'liq-text-[60%]')}>
              {firstNonZeroIndex - 2}
            </sub>
            0{nonZeroDecimals}
            {sufix}
          </span>
        }
        containerClassName="leading-none"
        hideTooltip={!shouldShowTooltip}
      >
        {amount}
      </MxTooltip>
    );
  }

  const hasDecimals = valueParts[1] && !areAllDigitsZeroes;

  return (
    <span {...rest} className={mxClsx(className)}>
      {prefix}
      {valueParts[0]}
      {hasDecimals && <>.{valueParts[1]}</>}
      {sufix}
    </span>
  );
};

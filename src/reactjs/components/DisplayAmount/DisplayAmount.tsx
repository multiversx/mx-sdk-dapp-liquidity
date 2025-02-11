import BigNumber from 'bignumber.js';
import { isString } from 'lodash';
import { HTMLProps } from 'react';
import type { Placement } from 'react-joyride';
import { AnimateNumber } from './components/AnimateNumber/AnimateNumber';
import { PrecisedAmount } from './components/PrecisedAmount/PrecisedAmount';
import { truncateAmount } from './utils';
import { formatAmount } from '../../utils/formatAmount';
import { getCleanStringAmount } from '../../utils/getCleanStringAmount';
import { isStringFloat } from '../../utils/isStringFloat';
import { mxClsx } from '../../utils/mxClsx';
import { roundAmount } from '../../utils/roundAmount';
import { MxTooltip } from '../MxTooltip';

export interface DisplayAmountProps extends HTMLProps<HTMLSpanElement> {
  sufix?: string;
  prefix?: string;
  digits?: number;
  decimals?: number;
  className?: string;
  amount: string | number;
  shouldAnimate?: boolean;
  shouldTruncate?: boolean;
  shouldBePrecised?: boolean;
  tooltipThreshold?: number;
  shouldShowTooltip?: boolean;
  style?: React.CSSProperties;
  tooltipPlacement?: Placement;
  showLastNonZeroDecimal?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

/* 
  CASE 1: <DisplayAmount amount={"12,34.56"} /> => "12,34.5600"
  CASE 2: <DisplayAmount amount={"123456"} /> => "123,456.0000"
  CASE 3: <DisplayAmount amount={"1447309532374228900000000000"} decimals={18} /> => 1447309532.3742
  CASE 4: <DisplayAmount amount={0.0023} /> => < 0.01 (with tooltip)
*/

export const DisplayAmount = ({
  amount,
  decimals,
  sufix = '',
  prefix = '',
  className = '',
  tooltipThreshold = 0,
  shouldAnimate = false,
  shouldTruncate = false,
  shouldBePrecised = true,
  tooltipPlacement = 'top',
  showLastNonZeroDecimal = true,
  digits = 4,
  shouldShowTooltip = true,
  ...rest
}: DisplayAmountProps) => {
  const stringAmount = isString(amount)
    ? getCleanStringAmount(amount).amountWithoutCommas
    : String(amount);

  const isValidStringAmount = isStringFloat(stringAmount);
  const isZero = new BigNumber(
    isValidStringAmount ? stringAmount : '0'
  ).isEqualTo(0);

  if (!isValidStringAmount || isZero) {
    return (
      <span {...rest} className={mxClsx(className)}>
        {prefix}
        {amount}
        {sufix}
      </span>
    );
  }

  const formattedAmount = decimals
    ? formatAmount({
        digits,
        decimals,
        addCommas: true,
        amount: stringAmount,
        showLastNonZeroDecimal
      })
    : roundAmount(stringAmount, digits, true);

  const bnAmount = new BigNumber(formattedAmount);
  const bnTooltipThreshold = new BigNumber(tooltipThreshold);

  const tooltipThresholdReached = bnAmount.isLessThan(bnTooltipThreshold);

  if (shouldBePrecised && new BigNumber(formattedAmount).isLessThan(1)) {
    return (
      <PrecisedAmount
        {...rest}
        sufix={sufix}
        prefix={prefix}
        digits={digits}
        className={className}
        amount={formattedAmount}
        shouldShowTooltip={shouldShowTooltip}
      />
    );
  }

  if (tooltipThresholdReached) {
    const prefixWhenTooltip = prefix.includes('<') ? prefix : '< ';

    return (
      <MxTooltip
        placement={tooltipPlacement}
        buttonText={
          <span {...rest} className={mxClsx('liq-max-w-fit', className)}>
            {prefixWhenTooltip}
            {tooltipThreshold}
            {sufix}
          </span>
        }
        hideTooltip={!shouldShowTooltip}
      >
        {formattedAmount}
      </MxTooltip>
    );
  }

  const truncatedAmount = shouldTruncate
    ? truncateAmount(formattedAmount)
    : formattedAmount;

  return (
    <span {...rest} className={mxClsx(className)}>
      {prefix}
      {shouldAnimate && !shouldTruncate ? (
        <AnimateNumber {...rest} amount={formattedAmount} />
      ) : (
        <>{truncatedAmount}</>
      )}
      {sufix}
    </span>
  );
};

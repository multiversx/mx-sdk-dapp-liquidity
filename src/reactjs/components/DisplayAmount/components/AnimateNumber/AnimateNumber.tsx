// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AnimatedNumber from 'animated-number-react';
import { useEffect, useState } from 'react';
import { getCleanStringAmount } from '../../../../utils/getCleanStringAmount';
import { roundAmount } from '../../../../utils/roundAmount';

interface AnimateNumberProps {
  amount: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const AnimateNumber = ({
  amount,
  onClick,
  ...rest
}: AnimateNumberProps) => {
  const [digits, setDigits] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);
  const [valueToAnimate, setValueToAnimate] = useState<number>();

  useEffect(() => {
    const { amountWithoutCommas, parts } = getCleanStringAmount(amount);

    setUpdateCount((existing) => existing + 1);
    setDigits(parts.length > 1 ? parts[1].length : 0);

    const parsedAmount = parseFloat(amountWithoutCommas);

    const isScientificNotation = parsedAmount.toString().includes('e');

    setValueToAnimate(isScientificNotation ? undefined : parsedAmount);
  }, [amount]);

  const formatValue = (val: number) => roundAmount(`${val}`, digits, true);

  if (!valueToAnimate) {
    return <>{amount}</>;
  }

  return (
    <AnimatedNumber
      value={valueToAnimate}
      duration={updateCount > 1 ? 300 : 0}
      formatValue={formatValue}
      onClick={onClick}
      {...rest}
    />
  );
};

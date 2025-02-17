import { ChainDTO } from '../../../dto/Chain.dto';
import { mxClsx } from '../../utils/mxClsx';
import { MxButton } from '../MxButton';

interface ConnectButtonProps {
  mvxAccountAddress?: string;
  chain?: ChainDTO;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MvxConnectButton = ({
  mvxAccountAddress,
  chain,
  disabled,
  className = '',
  onClick
}: ConnectButtonProps) => {
  if (mvxAccountAddress) {
    return null;
  }

  return (
    <MxButton
      type="button"
      variant="neutral-850"
      className={mxClsx(
        'liq-w-full liq-py-3 hover:enabled:liq-bg-primary !liq-text-primary-200',
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <div className="liq-flex liq-justify-center liq-gap-2">
        <div>Connect </div>
        <img
          src={chain?.svgUrl ?? ''}
          alt=""
          className="liq-h-[1.5rem] liq-w-[1.5rem]"
        />
        <div>MultiversX</div>
      </div>
    </MxButton>
  );
};

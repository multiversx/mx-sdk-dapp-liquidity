import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SmallLoader = ({
  show,
  color
}: {
  show: boolean;
  color?: string;
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="liq-d-flex">
      <FontAwesomeIcon
        icon={faSpinner}
        className={`liq-fa-spin liq-fast-spin ${color ? color : 'liq-text-primary'}`}
      />
    </div>
  );
};

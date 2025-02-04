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
    <div className="d-flex">
      <FontAwesomeIcon
        icon={faSpinner}
        className={`fa-spin fast-spin ${color ? color : 'text-primary'}`}
      />
    </div>
  );
};

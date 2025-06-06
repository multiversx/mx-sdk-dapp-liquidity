import HugImage from '../../assets/hug.svg';

export const ToggleDirection = ({
  onChangeDirection
}: {
  onChangeDirection: () => void;
}) => {
  const handleChangeDirection = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onChangeDirection();
  };

  return (
    <button className="inline-block" onClick={handleChangeDirection}>
      <img
        src={HugImage}
        alt={''}
        className="liq-h-6 liq-w-6 liq-text-neutral-100 liq-mx-auto liq-my-2"
      />
    </button>
  );
};

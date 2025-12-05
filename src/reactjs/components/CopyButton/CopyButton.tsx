import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { copyTextToClipboard } from './utils';
import { MxButton } from '../base/MxButton';

interface CopyButtonType {
  text: string;
  className?: string;
  'data-testid'?: string;
}

export const CopyButton = ({
  text,
  className = '',
  'data-testid': dataTestId
}: CopyButtonType) => {
  const [copyResult, setCopyResut] = React.useState({
    default: true,
    success: false
  });

  const handleOnClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const noSpaces = text ? text.trim() : text;
    setCopyResut({
      default: false,
      success: await copyTextToClipboard(noSpaces)
    });

    setTimeout(() => {
      setCopyResut({
        default: true,
        success: false
      });
    }, 1000);
  };

  return (
    <MxButton
      btnSize="sm"
      className={className}
      variant="link-neutral-500"
      onClick={handleOnClick}
      data-testid={dataTestId}
    >
      {copyResult.default || !copyResult.success ? (
        <FontAwesomeIcon icon={faCopy} />
      ) : (
        <FontAwesomeIcon icon={faCheck} />
      )}
    </MxButton>
  );
};

import { ReactNode, useEffect, useRef } from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import { Placement } from 'react-joyride';
import { Timeout } from 'react-number-format/types/types';
import { usePopper } from 'react-popper';
import { TooltipContainer, TooltipContent } from './components';
import { mxClsx } from '../../../utils/mxClsx';
import { MxSlideover } from '../MxSlideover';

export type MxTooltipVariantType = 'default' | 'underline' | 'dotted';
export type MxTooltipVariantColorType =
  | 'neutral-200'
  | 'neutral-500'
  | 'primary-200'
  | 'primary-300'
  | 'primary-400';

interface MxTooltipProps {
  offsetX?: number;
  offsetY?: number;
  hideDelayMs?: number;
  children?: ReactNode;
  buttonText: ReactNode;
  placement?: Placement;
  hideTooltip?: boolean;
  contentClassName?: string;
  containerClassName?: string;
  shouldStopPropagation?: boolean;
  variant?: MxTooltipVariantType;
  variantColor?: MxTooltipVariantColorType;
  portalId?: string;
  isSlideoverOnMobile?: boolean;
}

export const MxTooltip = ({
  children,
  buttonText,
  hideTooltip,
  offsetX = 0,
  offsetY = 10,
  hideDelayMs = 10,
  placement = 'top',
  variant = 'default',
  contentClassName = '',
  containerClassName = '',
  shouldStopPropagation = true,
  variantColor = 'neutral-500',
  portalId,
  isSlideoverOnMobile = false
}: MxTooltipProps) => {
  const [isHover, setIsHover] = useState(false);
  const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
  const [referenceEl, setReferenceEl] = useState<HTMLDivElement | null>(null);
  const [showSlideOver, setShowSlideOver] = useState(false);

  const isMobile = window.innerWidth < 768;

  const { styles, attributes } = usePopper(referenceEl, popperEl, {
    placement,
    modifiers: [
      {
        name: 'preventOverflow',
        options: {
          boundary: 'clippingParents'
        }
      }, // flips the tooltip if it does not fit
      { name: 'eventListeners', enabled: isHover }, // prevent popper from updating when the tooltip is not shown
      { name: 'offset', options: { offset: [offsetX, offsetY] } }
    ]
  });

  const showEvents = ['mouseenter', 'focus'];
  const hideEvents = ['mouseleave', 'blur'];
  const hideTimeoutRef = useRef<Timeout>();

  const show = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setIsHover(true);
  };

  const hide = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsHover(false);
    }, hideDelayMs);
  };

  // cleanup on page leave
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    showEvents.forEach((event) => popperEl?.addEventListener(event, show));
    hideEvents.forEach((event) => popperEl?.addEventListener(event, hide));

    return () => {
      showEvents.forEach((event) => popperEl?.removeEventListener(event, show));
      hideEvents.forEach((event) => popperEl?.removeEventListener(event, hide));
    };
  }, [popperEl]);

  useEffect(() => {
    showEvents.forEach((event) => referenceEl?.addEventListener(event, show));
    hideEvents.forEach((event) => referenceEl?.addEventListener(event, hide));

    return () => {
      showEvents.forEach((event) =>
        referenceEl?.removeEventListener(event, show)
      );
      hideEvents.forEach((event) =>
        referenceEl?.removeEventListener(event, hide)
      );
    };
  }, [referenceEl]);

  const handleOnClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isSlideoverOnMobile && isMobile) {
      setShowSlideOver(true);
    }

    if (!shouldStopPropagation) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  };

  const portalRoot = portalId ? document.getElementById(portalId) : null;

  if (hideTooltip) {
    return buttonText;
  }

  if (isSlideoverOnMobile && isMobile) {
    return (
      <TooltipContainer
        containerClassName={containerClassName}
        variant={variant}
        variantColor={variantColor}
        onClick={handleOnClick}
        ref={setReferenceEl}
      >
        {buttonText}
        <MxSlideover
          onClose={() => setShowSlideOver(false)}
          show={showSlideOver}
          children={children}
        />
      </TooltipContainer>
    );
  }

  return (
    <TooltipContainer
      containerClassName={containerClassName}
      variant={variant}
      variantColor={variantColor}
      onClick={handleOnClick}
      ref={setReferenceEl}
    >
      {buttonText}

      {isHover &&
        (portalId ? (
          ReactDOM.createPortal(
            <TooltipContent
              children={children}
              contentClassName={mxClsx('liq-text-center', contentClassName)}
              popperAttributes={attributes.popper}
              popperStyles={styles.popper}
              setPopperEl={setPopperEl}
            />,
            portalRoot ?? document.body // Fixes z-index - overflow issue on tooltips
          )
        ) : (
          <TooltipContent
            children={children}
            contentClassName={contentClassName}
            popperAttributes={attributes.popper}
            popperStyles={styles.popper}
            setPopperEl={setPopperEl}
          />
        ))}
    </TooltipContainer>
  );
};

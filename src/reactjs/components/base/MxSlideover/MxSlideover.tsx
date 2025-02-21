import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { mxClsx } from '../../../utils/mxClsx';
import { MxButton } from '../MxButton';

export type MxSlideoverSizeType = 'h-full' | 'h-60' | 'h-40' | 'h-20';

export const MxSlideover = ({
  show,
  children,
  size,
  className = '',
  onClose
}: {
  show: boolean;
  className?: string;
  children: ReactNode;
  size?: MxSlideoverSizeType;
  onClose: () => void;
}) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="liq-relative liq-z-30" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="liq-ease-in-out liq-duration-150"
          enterFrom="liq-opacity-0"
          enterTo="liq-opacity-100"
          leave="liq-ease-in-out liq-duration-150"
          leaveFrom="liq-opacity-100"
          leaveTo="liq-opacity-0"
        >
          <div className="liq-fixed liq-inset-0 liq-bg-neutral-400 liq-bg-opacity-25 liq-backdrop-blur-sm liq- liq-backdrop-filter liq-transition-opacity" />
        </Transition.Child>

        <div className="liq-fixed liq-inset-0 liq-overflow-hidden">
          <div className="liq-absolute liq-inset-0 liq-overflow-hidden">
            <div className="liq-pointer-events-none liq-fixed liq-inset-y-0 liq-right-0 liq-flex liq-max-w-full liq-p-2">
              <Transition.Child
                as={Fragment}
                enter="liq-transform liq-transition liq-ease-in-out liq-duration-150"
                leave="liq-transform liq-transition liq-ease-in-out liq-duration-150"
                // enter
                enterFrom="liq-translate-y-full lg:liq-translate-y-0 lg:liq-translate-x-full"
                enterTo="liq-translate-y-0 lg:liq-translate-x-0"
                // leave
                leaveFrom="liq-translate-y-0 lg:liq-translate-x-0"
                leaveTo="liq-translate-y-full lg:liq-translate-y-0 lg:liq-translate-x-full"
              >
                <Dialog.Panel className="liq-pointer-events-auto liq-relative liq-flex liq-w-screen liq-lg:max-w-md">
                  <div
                    className={mxClsx(
                      'liq-relative liq-flex liq-flex-1 liq-flex-col liq-self-end liq-rounded-3xl liq-bg-neutral-850 liq-p-2 liq-shadow-2xl',
                      {
                        'liq-h-full md:liq-rounded-3xl': size === 'h-full',
                        'liq-h-3/5': size === 'h-60',
                        'liq-h-2/5': size === 'h-40',
                        'liq-h-1/5': size === 'h-20'
                      },
                      className
                    )}
                  >
                    <MxButton
                      variant="transparent"
                      onClick={onClose}
                      className="liq-absolute liq-top-12 liq-right-4 liq-z-30 liq-flex liq-h-10 liq-w-10 liq-items-center liq-justify-center liq-rounded-full liq-border-none liq-bg-neutral-850"
                    >
                      <FontAwesomeIcon
                        icon={faClose}
                        className="liq-h-5 liq-w-5 liq-text-neutral-500"
                      />
                    </MxButton>
                    <div className="scrollbar-thin liq-overflow-y-scroll">
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

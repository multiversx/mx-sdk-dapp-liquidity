import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { mxClsx } from '../../utils/mxClsx';
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
      <Dialog as="div" className="relative z-30" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-400 bg-opacity-25 backdrop-blur-sm  backdrop-filter transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full p-2">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-150"
                leave="transform transition ease-in-out duration-150"
                // enter
                enterFrom="translate-y-full lg:translate-y-0 lg:translate-x-full"
                enterTo="translate-y-0 lg:translate-x-0"
                // leave
                leaveFrom="translate-y-0 lg:translate-x-0"
                leaveTo="translate-y-full lg:translate-y-0 lg:translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative flex w-screen lg:max-w-md">
                  <div
                    className={mxClsx(
                      'relative flex flex-1 flex-col self-end rounded-3xl bg-neutral-850 p-2 shadow-2xl',
                      {
                        'h-full md:rounded-3xl': size === 'h-full',
                        'h-3/5': size === 'h-60',
                        'h-2/5': size === 'h-40',
                        'h-1/5': size === 'h-20'
                      },
                      className
                    )}
                  >
                    <MxButton
                      variant="transparent"
                      onClick={onClose}
                      className="absolute -top-12 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border-none bg-neutral-850"
                    >
                      <FontAwesomeIcon
                        icon={faClose}
                        className="h-5 w-5 text-neutral-500"
                      />
                    </MxButton>
                    <div className="scrollbar-thin overflow-y-scroll">
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

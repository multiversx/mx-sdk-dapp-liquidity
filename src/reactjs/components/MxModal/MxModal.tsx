import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { mxClsx } from '../../utils/mxClsx';
import { MxSlideover } from '../MxSlideover';

interface MxModalProps {
  show: boolean;
  children?: ReactNode;
  onClose: () => void;
  className?: string;
  overlayClassName?: string;
  isSlideOverOnMobile?: boolean;
}

export const MxModal = ({
  show,
  children,
  onClose,
  className = '',
  overlayClassName = '',
  isSlideOverOnMobile = false
}: MxModalProps) => {
  if (isSlideOverOnMobile && window.innerWidth < 768) {
    return <MxSlideover onClose={onClose} show={show} children={children} />;
  }

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={mxClsx(
              'fixed inset-0 bg-black bg-opacity-50',
              overlayClassName
            )}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={mxClsx(
                  'w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-800 p-10 text-left align-middle shadow-xl transition-all',
                  className
                )}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

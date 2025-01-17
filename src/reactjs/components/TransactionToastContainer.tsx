import { Bounce, ToastContainer, ToastContainerProps } from 'react-toastify';

export const TransactionToastContainer = (props: ToastContainerProps) => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={10000}
      hideProgressBar={true}
      closeOnClick={false}
      rtl={false}
      draggable={false}
      transition={Bounce}
      {...props}
    />
  );
};

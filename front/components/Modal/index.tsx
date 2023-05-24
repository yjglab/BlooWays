import React, { FC, PropsWithChildren, useCallback } from 'react';

interface ModalProps {
  show: boolean;
  onCloseModal: () => void;
}

const Modal: FC<PropsWithChildren<ModalProps>> = ({ show, children, onCloseModal }) => {
  const stopPropagation = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    <div className='fixed text-center left-0 bottom-0 top-0 right-0 z-50' onClick={onCloseModal}>
      <div className='mt-20 inline-block w-36 bg-slate-300 p-4' onClick={stopPropagation}>
        <button className='absolute right-2' onClick={onCloseModal}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

import React, { FC, PropsWithChildren, useCallback } from 'react';

interface MenuProps {
  show: boolean;
  onCloseModal: () => void;
  closeButton?: boolean;
}

const Menu: FC<PropsWithChildren<MenuProps>> = ({ closeButton, show, children, onCloseModal }) => {
  const stopPropagation = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    <div className='fixed top-0 right-0 left-0 bottom-0 z-50' onClick={onCloseModal}>
      <div onClick={stopPropagation} className='top-4 absolute inline-block rounded-md'>
        {closeButton && (
          <button className='absolute right-3 top-2' onClick={onCloseModal}>
            &times;
          </button>
        )}
        {children}
      </div>
    </div>
  );
};
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;

import React, { FC, PropsWithChildren, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface DropMenuProps {
  menuTitle: string | undefined;
  chevron: boolean;
  direction: string;
}
const DropMenu: FC<PropsWithChildren<DropMenuProps>> = ({ children, menuTitle, chevron, direction }) => {
  return (
    <div className='z-10 text-right'>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button className='inline-flex w-full justify-center rounded-md  py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
            <span className='text-slate-700'>{menuTitle}</span>
            {chevron && (
              <ChevronDownIcon
                className='ml-2 -mr-1 h-5 w-5 text-amber-500 hover:text-amber-600'
                aria-hidden='true'
              />
            )}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items
            className={`absolute ${
              direction === 'right' ? 'right-0' : 'left-0'
            } mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            <div className='px-1 py-1 '>{children}</div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default DropMenu;

import React, { FC, useCallback } from 'react';
// import { useParams } from 'react-router';
// import { NavLink, useLocation } from 'react-router-dom';
import { Fragment, useState } from 'react';
import { Dialog, Menu, Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { logoUrl } from '@functions/global';
import useSWR from 'swr';
import ApiFetcher from '@functions/ApiFetcher';
import { User } from '@typings/types';
import Avvvatars from 'avvvatars-react';
import { Link } from 'react-router-dom';
import DropMenu from '@components/DropMenu';
import axios from 'axios';
import { toast } from 'react-toastify';

const navigation = {
  categories: [],
  pages: [
    { name: '홈', href: '#' },
    { name: '스토어', href: '#' },
  ],
};

const NavBar: FC = () => {
  const { data: userData, mutate: revalidateUser } = useSWR<User | false>('/api/users', ApiFetcher);
  const [open, setOpen] = useState(false);
  const onSignOut = useCallback(() => {
    axios
      .post('/api/users/signout')
      .then(() => {
        revalidateUser();
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, [revalidateUser]);

  return (
    <div id='navbar' className='fixed top-0 w-full z-40 bg-white shadow-lg shadow-slate-300/30'>
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative lg:hidden' onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 z-40 flex justify-end'>
            <Transition.Child
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='translate-x-full'
            >
              <Dialog.Panel className='relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl'>
                <div className='flex px-6 py-3  item-center justify-end'>
                  <button
                    type='button'
                    className='-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400'
                    onClick={() => setOpen(false)}
                  >
                    <span className='sr-only'>Close menu</span>
                    <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>

                {/* Links */}
                <div className='space-y-6  px-4 py-6'>
                  {navigation.pages.map((page) => (
                    <div key={page.name} className='flow-root'>
                      <a href={page.href} className='-m-2 block p-2 font-medium text-gray-900'>
                        {page.name}
                      </a>
                    </div>
                  ))}
                </div>

                <div className='space-y-6  px-4 py-6'>
                  <div className='flow-root'>
                    <Link to='/signin' className='-m-2 block p-2 font-medium text-gray-900'>
                      로그인
                    </Link>
                  </div>
                  <div className='flow-root'>
                    <Link to='signup' className='-m-2 block p-2 font-medium text-gray-900'>
                      멤버가입
                    </Link>
                  </div>
                </div>

                <div className=' px-4 py-6'>
                  <a href='#' className='-m-2 flex items-center p-2'>
                    <img
                      src='https://tailwindui.com/img/flags/flag-canada.svg'
                      alt=''
                      className='block h-auto w-5 flex-shrink-0'
                    />
                    <span className='ml-3 block text-base font-medium text-gray-900'>CAD</span>
                    <span className='sr-only'>, change currency</span>
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className='relative bg-white'>
        <nav aria-label='Top' className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className=' relative'>
            <div className='flex w-full h-14 items-center relative'>
              {/* Logo */}
              <div className='flex ml-2'>
                <Link className='flex items-center' to='/'>
                  <span className='sr-only'>BlooWays</span>
                  <img className='h-8 w-auto' src={logoUrl} alt='' />
                  <span className='ml-0.5 text-amber-500 font-bold text-lg'>BlooWays</span>
                </Link>
              </div>

              {/* Flyout menus */}
              <Popover.Group className='hidden lg:ml-8 lg:block lg:self-stretch'>
                <div className='flex h-full space-x-8'>
                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className='flex items-center text-sm font-medium text-gray-700 hover:text-gray-800'
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </Popover.Group>
              <button
                type='button'
                className='rounded-md bg-white p-2 text-gray-400 lg:hidden absolute right-0'
                onClick={() => setOpen(true)}
              >
                <span className='sr-only'>Open menu</span>
                <Bars3Icon className='h-6 w-6' aria-hidden='true' />
              </button>
              <div className='ml-auto flex items-center'>
                {!userData && (
                  <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>
                    <Link to='/signin' className='text-sm font-medium text-gray-700 hover:text-gray-800'>
                      로그인
                    </Link>
                    <span className='h-6 w-px bg-gray-200' aria-hidden='true' />
                    <Link to='/signup' className='text-sm font-medium text-gray-700 hover:text-gray-800'>
                      멤버가입
                    </Link>
                  </div>
                )}

                <div className='hidden lg:ml-8 lg:flex '>
                  {userData && (
                    <button
                      type='button'
                      className=' z-40 flex items-center text-gray-700 hover:text-gray-800'
                    >
                      <Avvvatars size={32} shadow={true} style='shape' value={userData.email} />
                      <div className='w-2'></div>
                      <DropMenu menuTitle={userData.username} chevron={false} direction='right'>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={onSignOut}
                              className={`${
                                active ? 'bg-amber-500 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              로그아웃
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={onSignOut}
                              className={`${
                                active ? 'bg-amber-500 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              로그아웃
                            </button>
                          )}
                        </Menu.Item>
                      </DropMenu>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;

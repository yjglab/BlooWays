import React, { FC, useCallback } from 'react';
// import { useParams } from 'react-router';
// import { NavLink, useLocation } from 'react-router-dom';
import { Fragment, useState } from 'react';
import { Dialog, Menu, Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { bloosLogoBUrl, logoUrl, toastConfig } from '@functions/global';
import useSWR from 'swr';
import ApiFetcher from '@functions/ApiFetcher';
import { User } from '@typings/types';
import Avvvatars from 'avvvatars-react';
import { Link } from 'react-router-dom';
import DropMenu from '@components/DropMenu';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Modal from '@components/Modal';

const navigation = {
  categories: [],
  pages: [
    { name: '홈', href: '/' },
    { name: '버전 정보', href: '/version-release' },
  ],
};

const NavBar: FC = () => {
  const { data: userData, mutate: revalidateUser } = useSWR<User | false>('/api/users', ApiFetcher);
  const [open, setOpen] = useState(false);
  const [showUpdateUsernameModal, setShowUpdateUsernameModal] = useState(false);
  const onSignOut = useCallback(() => {
    axios
      .post('/api/users/signout')
      .then(() => {
        revalidateUser();
        setOpen(false);
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, [revalidateUser]);
  interface UpdateUsernameValues {
    newUsername: string;
  }
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<UpdateUsernameValues>();
  const onUpdateUsername = useCallback(
    (formData) => {
      const { newUsername } = formData;

      if (!newUsername || !newUsername.trim()) {
        return toast.error('사용자명을 입력해주세요', toastConfig);
      }
      if (newUsername.length > 16) {
        return toast.error('16자 이내의 사용자명을 입력해주세요.', toastConfig);
      }
      axios
        .patch('/api/users/username', {
          email: userData && userData.email,
          username: newUsername,
        })
        .then(() => {
          revalidateUser();
          setShowUpdateUsernameModal(false);
          return toast.success('사용자명을 변경했습니다.', toastConfig);
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, toastConfig);
        });
    },
    [revalidateUser, userData],
  );
  const onClickUpdateUsername = useCallback(() => {
    setShowUpdateUsernameModal(true);
    userData && setValue('newUsername', userData.username);
  }, [setValue, userData]);
  const onCloseModal = useCallback(() => {
    setShowUpdateUsernameModal(false);
  }, []);
  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div id='navbar' className='fixed top-0 w-full z-50 bg-white shadow-lg shadow-slate-300/30'>
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative md:hidden' onClose={setOpen}>
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
                    className='-m-2 inline-flex items-center justify-center rounded-md p-2 text-slate-400'
                    onClick={() => setOpen(false)}
                  >
                    <span className='sr-only'>Close menu</span>
                    <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>

                {/* Links */}
                <div className='space-y-6  px-4 py-6'>
                  {navigation.pages.map((page) => (
                    <div onClick={onClose} key={page.name} className='flow-root'>
                      <Link to={page.href} className='-m-2 block p-2 font-medium text-slate-800'>
                        {page.name}
                      </Link>
                    </div>
                  ))}
                </div>
                <div className='h-[2px] w-full px-3 bg-slate-100'></div>
                {userData ? (
                  <>
                    <div className='text-left space-y-6 text-slate-400/80 px-4 pt-4'>{userData.email}</div>
                    <button onClick={onClose} type='button' className='text-left space-y-6 mt-3 px-4 py-3'>
                      <Link
                        // to={`/blooway/${userData.username}/area/전체`}
                        to={`/blooway/all/area/전체`}
                        className='-m-2 block p-2 font-medium text-slate-800'
                      >
                        나의 블루웨이
                      </Link>
                    </button>
                    <button onClick={onSignOut} className='text-left space-y-6  px-4 py-3'>
                      로그아웃
                    </button>
                  </>
                ) : (
                  <div className='space-y-6  px-4 py-6'>
                    <button onClick={onClose} className='flow-root text-left w-full'>
                      <Link to='/signin' className='-m-2 block p-2 font-medium text-slate-800'>
                        로그인
                      </Link>
                    </button>
                    <button onClick={onClose} className='flow-root text-left w-full'>
                      <Link to='signup' className='-m-2 block p-2 font-medium text-slate-800'>
                        멤버가입
                      </Link>
                    </button>
                  </div>
                )}
                <div className='absolute bottom-5 mt-2 px-4 py-6 w-full'>
                  <div className='flex w-36 items-center left-0 right-0 mx-auto'>
                    <div className='w-7 h-7'>
                      <img className='h-7 w-auto' src={logoUrl} />
                    </div>
                    <span className='text-[20px] font-bold ml-0.5 text-amber-500'>BlooWays</span>
                  </div>
                  <p className='mt-4 text-center text-sm leading-6 text-slate-500'>
                    © 2023 yjglab. All rights reserved.
                  </p>
                  <div className='gap-4 flex w-full mt-2 opacity-80 justify-center items-center left-0 right-0 mx-auto'>
                    <a href='https://bloobolt.com'>
                      <img className='h-5 w-auto' src={bloosLogoBUrl} />
                    </a>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className='relative bg-white'>
        <nav aria-label='Top' className='mx-auto max-w-7xl px-4 sm:px-6 md:px-8'>
          <div className='relative'>
            {/* height */}
            <div className='flex w-full h-12 md:h-14 items-center relative'>
              {/* Logo */}
              <div className='flex ml-2'>
                <Link className='flex items-center' to='/'>
                  <span className='sr-only'>BlooWays</span>
                  <img className='h-7 w-auto' src={logoUrl} alt='' />
                  <span className='ml-0.5 text-amber-500 font-bold text-lg'>BlooWays</span>
                </Link>
              </div>

              {/* Flyout menus */}
              <Popover.Group className='hidden md:ml-8 md:block md:self-stretch'>
                <div className='flex h-full space-x-8'>
                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.href}
                      className='flex items-center text-sm font-medium text-slate-800 hover:text-slate-900'
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </Popover.Group>
              <button
                type='button'
                className='rounded-md bg-white p-2 text-slate-400 md:hidden absolute right-0'
                onClick={() => setOpen(true)}
              >
                <span className='sr-only'>Open menu</span>
                <Bars3Icon className='h-6 w-6' aria-hidden='true' />
              </button>
              <div className='ml-auto flex items-center'>
                {!userData && (
                  <div className='hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-6'>
                    <Link to='/signin' className='text-sm font-medium text-slate-800 hover:text-slate-900'>
                      로그인
                    </Link>
                    <span className='h-6 w-px bg-slate-200' aria-hidden='true' />
                    <Link to='/signup' className='text-sm font-medium text-slate-800 hover:text-slate-900'>
                      멤버가입
                    </Link>
                  </div>
                )}

                <div className='hidden md:ml-8 md:flex '>
                  {userData && (
                    <div className=' z-40 flex items-center text-slate-800 hover:text-slate-900'>
                      <Avvvatars size={32} shadow={true} style='shape' value={userData.email} />
                      <div className='w-2'></div>
                      <DropMenu menuTitle={userData.username} chevron={false} direction='right'>
                        <Menu.Item>
                          {({ active }) => (
                            <Link to={`/blooway/all/area/전체`}>
                              <button
                                type='button'
                                className={`${
                                  active ? 'bg-amber-500 text-white' : 'text-slate-800'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                전체 블루웨이
                              </button>{' '}
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link to={`/blooway/${userData.username}/area/전체`}>
                              <button
                                type='button'
                                className={`${
                                  active ? 'bg-amber-500 text-white' : 'text-slate-800'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              >
                                나의 블루웨이
                              </button>{' '}
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={onClickUpdateUsername}
                              className={`${
                                active ? 'bg-amber-500 text-white' : 'text-slate-800'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              사용자명 변경
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={onSignOut}
                              className={`${
                                active ? 'bg-amber-500 text-white' : 'text-slate-800'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              로그아웃
                            </button>
                          )}
                        </Menu.Item>
                      </DropMenu>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <Modal
        modalType={0}
        modalTitle='사용자명 변경하기'
        show={showUpdateUsernameModal}
        onCloseModal={onCloseModal}
      >
        <form id='create-blooway-modal' className='w-full' onSubmit={handleSubmit(onUpdateUsername)}>
          <div className='w-full my-4'>
            <div>
              <span>새로운 사용자명</span>
              <input
                id='newUsername'
                type='text'
                className='mt-2 relative block w-full appearance-none rounded-md  border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
                placeholder='사용자명 (4-16자)'
                {...register('newUsername', {
                  minLength: 4,
                })}
              />
            </div>
          </div>
          <div className='flex justify-center'>
            <button
              disabled={isSubmitting}
              type='submit'
              className='inline-flex justify-center rounded-md border border-transparent bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2'
            >
              변경하기
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NavBar;

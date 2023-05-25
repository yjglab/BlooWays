import AddAreaModal from '@components/AddAreaModal';
import InviteBloowayModal from '@components/InviteBloowayModal';
import DropMenu from '@components/DropMenu';
import Modal from '@components/Modal';
import ApiFetcher from '@functions/ApiFetcher';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import useSocket from '@hooks/useSocket';
import AreaPage from '@pages/AreaPage';
import PrivatePage from '@pages/PrivatePage';
import { Area, User } from '@typings/types';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
// import { Link, Redirect, Route } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Menu } from '@headlessui/react';
import SideBar from '@components/SideBar';

const Blooway = () => {
  const params = useParams<{ blooway?: string }>();
  const { blooway } = params;
  const [socket, disconnectSocket] = useSocket(blooway);
  const { data: userData, mutate: revalidateUser } = useSWR<User | false>('/api/users', ApiFetcher);
  const { data: areaData } = useSWR<Area[]>(userData ? `/api/blooways/${blooway}/areas` : null, ApiFetcher);
  const [showCreateBloowayModal, setShowCreateBloowayModal] = useState(false);
  const [showInviteBloowayModal, setShowInviteBloowayModal] = useState(false);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  interface CreateBloowayValues {
    bloowayName: string;
    bloowayLink: string;
  }
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<CreateBloowayValues>();

  const onCreateBlooway: SubmitHandler<CreateBloowayValues> = useCallback(
    (formData) => {
      const { bloowayName, bloowayLink } = formData;
      if (!bloowayName || !bloowayName.trim()) {
        return toast.error('블루웨이 이름을 입력해주세요', { position: 'bottom-center' });
      }
      if (!bloowayLink || !bloowayLink.trim()) {
        return toast.error('키워드 링크를 입력해주세요', { position: 'bottom-center' });
      }
      axios
        .post('/api/blooways', {
          blooway: bloowayName,
          link: bloowayLink,
        })
        .then(() => {
          revalidateUser();
          setShowCreateBloowayModal(false);
          setValue('bloowayName', '');
          setValue('bloowayLink', '');
        })
        .catch((error) => {
          console.dir(error);
          setErrorMessage(error.response?.data);
        });
    },
    [revalidateUser, setValue],
  );

  const onClickCreateBlooway = useCallback(() => {
    setShowCreateBloowayModal(true);
  }, []);

  const onClickAddArea = useCallback(() => {
    setShowAddAreaModal(true);
  }, []);

  const onClickInviteBlooway = useCallback(() => {
    setShowInviteBloowayModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateBloowayModal(false);
    setShowAddAreaModal(false);
    setShowInviteBloowayModal(false);
  }, []);

  useEffect(() => {
    return () => {
      console.info('disconnect socket', blooway);
      disconnectSocket();
    };
  }, [disconnectSocket, blooway]);
  useEffect(() => {
    if (areaData && userData) {
      console.info('로그인시도', socket);
      socket?.emit('signin', { id: userData?.id, areas: areaData.map((v) => v.id) });
    }
  }, [socket, userData, areaData]);

  if (userData === false) {
    return <Redirect to='/signin' />;
  }

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-slate-700'>
      <div className='pt-2.5 h-9 border-b-amber-500 border-b p-2 justify-between text-base font-semibold flex items-center'>
        <div className='flex items-center'>
          <DropMenu
            menuTitle={userData?.Blooways.find((v) => v.link === blooway)?.name}
            chevron={true}
            direction='left'
          >
            <Menu.Item>
              {({ active }) => (
                <button
                  type='button'
                  onClick={onClickCreateBlooway}
                  className={`${
                    active ? 'bg-amber-500 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  새 블루웨이 생성
                </button>
              )}
            </Menu.Item>
            <div className='h-[1.5px] w-full px-4 my-1.5 bg-slate-200'></div>
            {userData?.Blooways.map((blooway) => {
              return (
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to={`/blooway/${blooway.link}/area/전체`}
                      className={`${
                        active ? 'bg-amber-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      {blooway.name}
                    </Link>
                  )}
                </Menu.Item>
              );
            })}
          </DropMenu>
          {userData?.username === blooway && (
            <span className='ml-2 inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10'>
              Default
            </span>
          )}
        </div>
        <DropMenu menuTitle='블루웨이 옵션' chevron={true} direction='right'>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onClickInviteBlooway}
                className={`${
                  active ? 'bg-amber-500 text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                새 멤버 초대
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onClickAddArea}
                className={`${
                  active ? 'bg-amber-500 text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                새 에리어 생성
              </button>
            )}
          </Menu.Item>
        </DropMenu>
      </div>
      <div className='flex w-full'>
        <SideBar />
        <div className='flex w-full'>
          <Switch>
            <Route path='/blooway/:blooway/area/:area' component={AreaPage} />
            <Route path='/blooway/:blooway/private/:id' component={PrivatePage} />
          </Switch>
        </div>
      </div>
      <Modal
        modalType={0}
        modalTitle='새로운 블루웨이 생성하기'
        show={showCreateBloowayModal}
        onCloseModal={onCloseModal}
      >
        <form id='create-blooway-modal' className='w-full' onSubmit={handleSubmit(onCreateBlooway)}>
          <div className='w-full my-4'>
            <div className='mb-4'>
              <span className='mb-2'>블루웨이 이름</span>
              <input
                id='bloowayName'
                type='text'
                className='relative block w-full appearance-none rounded-md  border border-slate-300 px-3 py-2 text-slate-600 placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
                placeholder='30자 이내로 설정해주세요'
                {...register('bloowayName', {
                  required: '사용자명은 필수 입력입니다',
                  minLength: {
                    value: 4,
                    message: '2자 이상의 블루웨이 이름을 입력해주세요',
                  },
                  maxLength: {
                    value: 10,
                    message: '30자 이하의 블루웨이 이름을 입력해주세요',
                  },
                })}
              />
            </div>
            <div>
              <span className='mb-2'>키워드 링크</span>
              <input
                id='bloowayLink'
                type='text'
                className='relative block w-full appearance-none rounded-md  border border-slate-300 px-3 py-2 text-slate-600 placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
                placeholder='30자 이내로 설정해주세요'
                {...register('bloowayLink', {
                  required: '사용자명은 필수 입력입니다',
                  minLength: {
                    value: 2,
                    message: '2자 이상의 키워드를 입력해주세요',
                  },
                  maxLength: {
                    value: 30,
                    message: '30자 이내의 키워드를 입력해주세요',
                  },
                })}
              />
            </div>
          </div>
          <p className='mt-6 h-8 text-sm text-center text-amber-400'>{errorMessage}</p>
          <div className=' flex justify-center gap-2 '>
            <button
              disabled={isSubmitting}
              type='submit'
              className='inline-flex justify-center rounded-md border border-transparent bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2'
            >
              생성하기
            </button>
          </div>
        </form>
      </Modal>
      <AddAreaModal
        show={showAddAreaModal}
        onCloseModal={onCloseModal}
        setShowAddAreaModal={setShowAddAreaModal}
      />
      <InviteBloowayModal
        show={showInviteBloowayModal}
        onCloseModal={onCloseModal}
        setShowInviteBloowayModal={setShowInviteBloowayModal}
      />
      <ToastContainer position='bottom-center' />
    </div>
  );
};

export default Blooway;

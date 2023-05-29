import AddAreaModal from '@components/AddAreaModal';
import InviteBloowayModal from '@components/InviteBloowayModal';
import DropMenu from '@components/DropMenu';
import Modal from '@components/Modal';
import ApiFetcher from '@functions/ApiFetcher';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import useSocket from '@hooks/useSocket';
import AreaPage from '@pages/AreaPage';
import PrivatePage from '@pages/PrivatePage';
import { Area, User, UserWithOnline } from '@typings/types';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Menu } from '@headlessui/react';
import SideBar from '@components/SideBar';
import { toastConfig } from '@functions/global';
import AreaItem from '@components/AreaItem';
import PrivateItem from '@components/PrivateItem';

const Blooway = () => {
  const params = useParams<{ blooway?: string }>();
  const { blooway } = params;
  const [socket, disconnectSocket] = useSocket(blooway);
  const { data: userData, mutate: revalidateUser } = useSWR<User | false>('/api/users', ApiFetcher);
  const { data: areaData } = useSWR<Area[]>(userData ? `/api/blooways/${blooway}/areas` : null, ApiFetcher);
  const { data: memberData } = useSWR<UserWithOnline[]>(
    userData ? `/api/blooways/${blooway}/members` : null,
    ApiFetcher,
  );
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const [showCreateBloowayModal, setShowCreateBloowayModal] = useState(false);
  const [showInviteBloowayModal, setShowInviteBloowayModal] = useState(false);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);

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
        return toast.error('블루웨이 이름을 입력해주세요', toastConfig);
      }
      if (!bloowayLink || !bloowayLink.trim()) {
        return toast.error('키워드 링크를 입력해주세요', toastConfig);
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
          toast.error(error.response?.data, toastConfig);
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
    socket?.on('onlineList', (data: number[]) => {
      console.log('온라인리스트', data);
      setOnlineList(data);
    });
    console.log('socket on private', socket?.hasListeners('private'), socket);
    return () => {
      console.log('socket off private', socket?.hasListeners('private'));
      socket?.off('onlineList');
    };
  }, [socket]);

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
    <div
      id='blooway-layout'
      className='pt-14 pb-2 h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-slate-700'
    >
      <div className='pt-2.5 h-9 border-b-amber-500 border-b p-2 justify-between text-base font-semibold flex items-center'>
        <div className='flex z-20 items-center'>
          <DropMenu
            menuTitle={userData?.Blooways.find((v) => v.link === blooway)?.name}
            chevron={true}
            direction='left'
          >
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onClickInviteBlooway}
                  className={`${
                    active ? 'bg-amber-500 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <span className='text-ellipsis overflow-hidden max-w-[70px]'>
                    {userData?.Blooways.find((v) => v.link === blooway)?.name}
                  </span>
                  에 멤버 초대
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  type='button'
                  onClick={onClickAddArea}
                  className={`${
                    active ? 'bg-amber-500 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <span className='text-ellipsis overflow-hidden max-w-[70px]'>
                    {userData?.Blooways.find((v) => v.link === blooway)?.name}
                  </span>
                  에 에리어 추가
                </button>
              )}
            </Menu.Item>
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
              Base
            </span>
          )}
        </div>
        <div className='flex md:hidden items-center gap-2.5'>
          <DropMenu menuTitle='에리어' chevron={true} direction='right'>
            {areaData?.map((area) => {
              return (
                <Menu.Item>
                  <button className=' group flex w-full items-center rounded-md px-2 py-2 text-sm'>
                    <AreaItem area={area} />
                  </button>
                </Menu.Item>
              );
            })}
          </DropMenu>
          <DropMenu menuTitle='프라이빗 토크' chevron={true} direction='right'>
            {memberData?.map((member) => {
              const isOnline = onlineList.includes(member.id);
              return (
                <Menu.Item>
                  <button className=' group flex w-full items-center rounded-md px-2 py-2 text-sm'>
                    <PrivateItem member={member} isOnline={isOnline} />
                  </button>
                </Menu.Item>
              );
            })}
          </DropMenu>
        </div>
      </div>
      <div id='blooway-side-splitter' className='flex w-full h-full'>
        <SideBar />
        <div className='flex w-full md:w-[75%]'>
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
            <div>
              <span>블루웨이 이름</span>
              <input
                id='bloowayName'
                type='text'
                className='mt-2 relative block w-full appearance-none rounded-md  border border-slate-300 px-3 py-2 text-slate-600 placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
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
            <div className='mt-2'>
              <span>키워드 링크</span>
              <input
                id='bloowayLink'
                type='text'
                className='mt-2 relative block w-full appearance-none rounded-md  border border-slate-300 px-3 py-2 text-slate-600 placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
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
          <div className='flex justify-center'>
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

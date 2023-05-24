import AreaList from '@components/AreaList';
import AddAreaModal from '@components/AddAreaModal';
import PrivateList from '@components/PrivateList';
import InviteBloowayModal from '@components/InviteBloowayModal';
import Menu from '@components/Menu';
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
import Avvvatars from 'avvvatars-react';

const Blooway = () => {
  const params = useParams<{ blooway?: string }>();
  const { blooway } = params;
  const [socket, disconnectSocket] = useSocket(blooway);
  const { data: userData, mutate: revalidateUser } = useSWR<User | false>('/api/users', ApiFetcher);
  const { data: areaData } = useSWR<Area[]>(userData ? `/api/blooways/${blooway}/areas` : null, ApiFetcher);
  const [showCreateBloowayModal, setShowCreateBloowayModal] = useState(false);
  const [showInviteBloowayModal, setShowInviteBloowayModal] = useState(false);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBloowayModal, setShowBloowayModal] = useState(false);

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

  interface CreateBloowayValues {
    bloowayName: string;
    bloowayLink: string;
  }
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateBloowayValues>();

  const onCreateBlooway: SubmitHandler<CreateBloowayValues> = useCallback(
    (formData) => {
      const { bloowayName, bloowayLink } = formData;
      if (!bloowayName || !bloowayName.trim()) {
        return;
      }
      if (!bloowayLink || !bloowayLink.trim()) {
        return;
      }
      axios
        .post('/api/blooways', {
          blooway: bloowayName,
          link: bloowayLink,
        })
        .then(() => {
          revalidateUser();
          setShowCreateBloowayModal(false);
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [revalidateUser],
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

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const toggleBloowayModal = useCallback(() => {
    setShowBloowayModal((prev) => !prev);
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
    <div>
      <div className='h-5 bg-indigo-500 text-white p-2 text-center'>
        {userData && (
          <div className='float-right'>
            <span onClick={onClickUserProfile}>
              <Avvvatars size={16} style='shape' value={userData.email} />
            </span>
            {showUserMenu && (
              <Menu show={showUserMenu} onCloseModal={onClickUserProfile}>
                <div className='flex p-2'>
                  <Avvvatars size={16} style='shape' value={userData.email} />
                  <div>
                    <span>{userData.username}</span>
                    <span>Active</span>
                  </div>
                </div>
                <button className='w-full' onClick={onSignOut}>
                  로그아웃
                </button>
              </Menu>
            )}
          </div>
        )}
      </div>
      <div className='flex w-full'>
        <div className='w-8 inline-flex flex-col items-center bg-indigo-600 text-center'>
          {userData?.Blooways.map((blooway) => {
            return (
              <Link key={blooway.id} to={`/blooway/${blooway.link}/area/전체`}>
                <button className='inline-block w-10 h-10'>{blooway.name.slice(0, 1).toUpperCase()}</button>
              </Link>
            );
          })}
          <button className='inline-block w-10 h-10' onClick={onClickCreateBlooway}>
            +
          </button>
        </div>
        <div className='w-[260px] inline-flex flex-col bg-red-200 align-top'>
          <button
            className='text-ellipsis overflow-hidden whitespace-nowrap pl-2 '
            onClick={toggleBloowayModal}
          >
            {userData?.Blooways.find((v) => v.link === blooway)?.name}
          </button>
          <div className='overflow-y-auto h-screen'>
            <Menu show={showBloowayModal} onCloseModal={toggleBloowayModal}>
              <div className=''>
                <h2>{userData?.Blooways.find((v) => v.link === blooway)?.name}</h2>
                <button onClick={onClickInviteBlooway}>블루웨이에 멤버 초대</button>
                <button onClick={onClickAddArea}>새 에리어 생성</button>
                <button onClick={onSignOut}>로그아웃</button>
              </div>
            </Menu>
            <AreaList />
            <PrivateList />
          </div>
        </div>
        <div className='flex w-full'>
          <Switch>
            <Route path='/blooway/:blooway/area/:area' component={AreaPage} />
            <Route path='/blooway/:blooway/private/:id' component={PrivatePage} />
          </Switch>
        </div>
      </div>
      <Modal show={showCreateBloowayModal} onCloseModal={onCloseModal}>
        <form onSubmit={handleSubmit(onCreateBlooway)}>
          <label htmlFor='bloowayName' className='sr-only'>
            <span>새 블루웨이 이름</span>
            <input
              id='bloowayName'
              type='text'
              className='relative block w-full appearance-none rounded-t-md  border border-slate-300 px-3 py-2 text-slate-600 placeholder-slate-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
              placeholder='블루웨이 이름'
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
          </label>
          <label htmlFor='bloowayLink' className='sr-only'>
            <span>새 블루웨이 링크 키워드</span>
            <input
              id='bloowayLink'
              type='text'
              className='relative block w-full appearance-none rounded-t-md  border border-slate-300 px-3 py-2 text-slate-600 placeholder-slate-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
              placeholder='링크 키워드'
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
          </label>
          <button disabled={isSubmitting} type='submit'>
            생성하기
          </button>
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

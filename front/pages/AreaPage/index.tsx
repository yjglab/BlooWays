import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import { Area, Talk, User } from '@typings/types';
import ApiFetcher from '@functions/ApiFetcher';
import makeSection from '@functions/makeSection';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import TalkForm from '@components/TalkForm';
import TalkList from '@components/TalkList';
import { ChatBubbleOvalLeftEllipsisIcon, CubeIcon, UserPlusIcon } from '@heroicons/react/20/solid';
import InviteAreaModal from '@components/InviteAreaModal';

const PAGE_SIZE = 20;
const AreaPage = () => {
  const { blooway, area } = useParams<{ blooway: string; area: string }>();
  const [socket] = useSocket(blooway);
  const { data: userData } = useSWR<User>('/api/users', ApiFetcher);
  const { data: areasData } = useSWR<Area[]>(`/api/blooways/${blooway}/areas`, ApiFetcher);
  const areaData = areasData?.find((v) => v.name === area);

  const {
    data: talkData,
    mutate: mutateTalk,
    setSize,
  } = useSWRInfinite<Talk[]>(
    (index) => `/api/blooways/${blooway}/areas/${area}/talks?perPage=${PAGE_SIZE}&page=${index + 1}`,
    ApiFetcher,
    {
      onSuccess(data) {
        if (data?.length === 1) {
          setTimeout(() => {
            scrollbarRef.current?.scrollToBottom();
          }, 100);
        }
      },
    },
  );
  const { data: areaMembersData } = useSWR<User[]>(
    userData ? `/api/blooways/${blooway}/areas/${area}/members` : null,
    ApiFetcher,
  );
  const [talk, onChangeTalk, setTalk] = useInput('');
  const [talkArrived, setTalkArrived] = useState(false);
  const scrollbarRef = useRef<Scrollbars>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showInviteAreaModal, setShowInviteAreaModal] = useState(false);
  const isEmpty = talkData?.[0]?.length === 0;
  const isDataEnd = isEmpty || (talkData && talkData[talkData.length - 1]?.length < PAGE_SIZE);

  const onSubmitForm = useCallback(
    (e: any) => {
      e.preventDefault();
      if (talk?.trim() && talkData && areaData && userData) {
        const savedTalk = talk;
        mutateTalk((prevTalkData) => {
          prevTalkData?.[0].unshift({
            id: (talkData[0][0]?.id || 0) + 1,
            content: savedTalk,
            UserId: userData.id, // Sender, 에리어에서는 받는 사람은 필요없고 보내는 사람만 있어도 ok.
            User: userData,
            createdAt: new Date(),
            AreaId: areaData.id,
            Area: areaData,
          });
          return prevTalkData;
        }, false).then(() => {
          localStorage.setItem(`${blooway}-${area}`, new Date().getTime().toString());
          setTalk('');
          setTalkArrived(false);
          if (scrollbarRef.current) {
            scrollbarRef.current.scrollToBottom();
          }
        });
        axios
          .post(`/api/blooways/${blooway}/areas/${area}/talks`, {
            content: savedTalk,
          })
          .catch(console.error);
      }
    },
    [talk, blooway, area, areaData, userData, talkData, mutateTalk, setTalk],
  );

  const onMessage = useCallback(
    (data: Talk) => {
      if (
        data.Area.name === area &&
        (data.content.startsWith('uploads\\') ||
          data.content.startsWith('uploads/') ||
          data.UserId !== userData?.id)
      ) {
        mutateTalk((talkData) => {
          talkData?.[0].unshift(data);
          return talkData;
        }, false).then(() => {
          if (scrollbarRef.current) {
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              setTalkArrived(false);
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 100);
            } else {
              setTalkArrived(true);
            }
          }
        });
      }
    },
    [area, userData, mutateTalk],
  );

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  useEffect(() => {
    localStorage.setItem(`${blooway}-${area}`, new Date().getTime().toString());
  }, [blooway, area]);

  const onDrop = useCallback(
    (e: any) => {
      e.preventDefault();
      console.log(e);
      const formData = new FormData();
      if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          console.log(e.dataTransfer.items[i]);
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            console.log(e, '.... file[' + i + '].name = ' + file.name);
            formData.append('image', file);
          }
        }
      } else {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          console.log(e, '... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
          formData.append('image', e.dataTransfer.files[i]);
        }
      }
      axios.post(`/api/blooways/${blooway}/areas/${area}/images`, formData).then(() => {
        setDragOver(false);
        localStorage.setItem(`${blooway}-${area}`, new Date().getTime().toString());
      });
    },
    [blooway, area],
  );
  const onClickInviteArea = useCallback(() => {
    setShowInviteAreaModal(true);
  }, []);
  const onTalkArrivedConfirmed = useCallback(() => {
    setTalkArrived(false);
    scrollbarRef.current?.scrollToBottom();
  }, []);
  const onDragOver = useCallback((e: any) => {
    e.preventDefault();
    console.log(e);
    setDragOver(true);
  }, []);
  const onCloseModal = useCallback(() => {
    setShowInviteAreaModal(false);
  }, []);
  if (areasData && !areaData) {
    return <Redirect to={`/blooway/${blooway}/area/전체`} />;
  }

  const talkSections = makeSection(talkData ? ([] as Talk[]).concat(...talkData).reverse() : []);

  return (
    <div
      id='area-page'
      className='flex flex-col overflow-x-hidden w-full h-full relative '
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div
        id='mobile-area-pointer'
        className='flex items-center w-full justify-between absolute top-2 md:top-3 left-1 text-sm z-10'
      >
        <div className='flex items-center bg-amber-500 text-white px-1.5 py-0.5 rounded-md '>
          <CubeIcon className='w-4 mr-0.5' />
          <span className='max-w-[65px] md:max-w-[150px] text-ellipsis overflow-hidden'>{area}</span>
        </div>
        <button
          onClick={onClickInviteArea}
          type='button'
          className='hover:bg-slate-900 flex items-center bg-slate-700 text-white px-1.5 relative right-2 py-0.5 rounded-md '
        >
          <UserPlusIcon className='w-4' />
          <span className='max-w-[65px] md:max-w-[150px] ml-0.5 text-ellipsis overflow-hidden'>멤버</span>
        </button>
      </div>
      {isEmpty && (
        <div className='relative text-sm text-center w-full h-full flex items-center justify-center'>
          내용이 없습니다
          <br />
          토크를 보내서 멤버들과 대화를 시작해보세요!
        </div>
      )}
      {talkArrived && (
        <button
          type='button'
          onClick={onTalkArrivedConfirmed}
          className=' hover:bg-amber-600 absolute bottom-40 animate-bounce mx-auto z-10 left-0 right-0 px-2 py-0.5 w-[85px] flex items-center justify-center text-sm font-medium bg-amber-500 text-white rounded-md'
        >
          <ChatBubbleOvalLeftEllipsisIcon className=' w-4 mr-0.5' />새 토크
        </button>
      )}

      <TalkList
        scrollbarRef={scrollbarRef}
        isDataEnd={isDataEnd}
        isEmpty={isEmpty}
        talkSections={talkSections}
        setSize={setSize}
      />
      <TalkForm
        onSubmitForm={onSubmitForm}
        talk={talk}
        onChangeTalk={onChangeTalk}
        placeholder={`${area} 에리어에 토크`}
        data={areaMembersData}
        inPage='area'
      />

      {dragOver && (
        <div className='absolute top-5 left-0 w-full h-full bg-white opacity-60 flex items-center justify-center '>
          Upload
        </div>
      )}
      <InviteAreaModal
        show={showInviteAreaModal}
        onCloseModal={onCloseModal}
        setShowInviteAreaModal={setShowInviteAreaModal}
      />
    </div>
  );
};

export default AreaPage;

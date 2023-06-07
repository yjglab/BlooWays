import TalkForm from '@components/TalkForm';
import TalkList from '@components/TalkList';
import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import { Private } from '@typings/types';
import ApiFetcher from '@functions/ApiFetcher';
import axios from 'axios';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useParams } from 'react-router';
import makeSection from '@functions/makeSection';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { ChatBubbleOvalLeftEllipsisIcon, EyeSlashIcon } from '@heroicons/react/20/solid';

const PAGE_SIZE = 20;
const PrivatePage: FC = () => {
  const { blooway, id } = useParams<{ blooway: string; id: string }>();
  const [socket] = useSocket(blooway);
  const { data: meData } = useSWR('/api/users', ApiFetcher);
  const { data: userData } = useSWR(`/api/blooways/${blooway}/users/${id}`, ApiFetcher);
  const {
    data: talkData,
    mutate: mutateTalk,
    setSize, // setSize: 페이지 수를 변경
  } = useSWRInfinite<Private[]>(
    (index) => `/api/blooways/${blooway}/privates/${id}/talks?perPage=${PAGE_SIZE}&page=${index + 1}`,
    ApiFetcher,
    {
      onSuccess(data) {
        console.log('data', data.length, data);
        if (data?.length === 1) {
          setTimeout(() => {
            scrollbarRef.current?.scrollToBottom();
          }, 100);
        }
      },
    },
  );
  const [talk, onChangeTalk, setTalk] = useInput('');
  const [talkArrived, setTalkArrived] = useState(false);
  const scrollbarRef = useRef<Scrollbars>(null);
  const [, setDragOver] = useState(false);
  const isEmpty = talkData?.[0]?.length === 0;
  const isDataEnd = isEmpty || (talkData && talkData[talkData.length - 1]?.length < PAGE_SIZE);

  const onSubmitForm = useCallback(
    (e: any) => {
      e.preventDefault();
      if (talk?.trim() && talkData) {
        const savedTalk = talk;
        // optimistic ui, optimistic ui 사용 후에는 shouldRevalidate가 false여야 함.
        mutateTalk((prevTalkData) => {
          prevTalkData?.[0].unshift({
            id: (talkData[0][0]?.id || 0) + 1,
            content: savedTalk,
            SenderId: meData.id,
            Sender: meData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevTalkData;
        }, false).then(() => {
          localStorage.setItem(`${blooway}-${id}`, new Date().getTime().toString());
          setTalk('');
          setTalkArrived(false);
          if (scrollbarRef.current) {
            scrollbarRef.current.scrollToBottom();
          }
        });
        axios
          .post(`/api/blooways/${blooway}/privates/${id}/talks`, {
            content: talk,
          })
          .catch(console.error);
      }
    },
    [talk, blooway, id, meData, userData, talkData, mutateTalk, setTalk],
  );

  const onMessage = useCallback(
    (data: Private) => {
      // id는 상대방 id
      if (data.SenderId === Number(id) && meData.id !== Number(id)) {
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
    [id, meData, mutateTalk],
  );

  useEffect(() => {
    socket?.on('private', onMessage);
    return () => {
      socket?.off('private', onMessage);
    };
  }, [socket, onMessage]);

  useEffect(() => {
    localStorage.setItem(`${blooway}-${id}`, new Date().getTime().toString());
  }, [blooway, id]);

  const onDrop = useCallback(
    (e: any) => {
      e.preventDefault();
      const formData = new FormData();
      if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            // console.log('... file[' + i + '].name = ' + file.name);
            formData.append('image', file);
          }
        }
      } else {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          // console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
          formData.append('image', e.dataTransfer.files[i]);
        }
      }
      axios.post(`/api/blooways/${blooway}/privates/${id}/images`, formData).then(() => {
        setDragOver(false);
        localStorage.setItem(`${blooway}-${id}`, new Date().getTime().toString());
        mutateTalk();
      });
    },
    [blooway, id, mutateTalk],
  );
  const onImageUpload = useCallback(
    (e: any) => {
      e.preventDefault();
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append('image', e.target.files[i]);
      }
      axios.post(`/api/blooways/${blooway}/privates/${id}/images`, formData).then(() => {
        localStorage.setItem(`${blooway}-${id}`, new Date().getTime().toString());
        mutateTalk();
      });
    },
    [blooway, id, mutateTalk],
  );
  const onTalkArrivedConfirmed = useCallback(() => {
    setTalkArrived(false);
    scrollbarRef.current?.scrollToBottom();
  }, []);
  const onDragOver = useCallback((e: any) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  if (!userData || !meData) {
    return null;
  }

  const talkSections = makeSection(talkData ? ([] as Private[]).concat(...talkData).reverse() : []);

  return (
    <div
      className='flex flex-col overflow-x-hidden w-full h-full relative '
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div
        id='mobile-private-pointer'
        className='flex items-center absolute top-2 md:top-3 left-1 text-sm z-10 rounded-md px-1.5 py-0.5 bg-amber-500 text-white'
      >
        <EyeSlashIcon className='w-4 mr-0.5' />
        <span className='max-w-[65px] md:max-w-[150px] text-ellipsis overflow-hidden'>
          {userData.username}
        </span>
      </div>
      {isEmpty && (
        <div className='relative text-sm text-center w-full h-full text-slate-500 flex items-center justify-center'>
          내용이 없습니다
          <br />
          메시지를 보내서 멤버들과 토크를 시작해보세요!
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
        placeholder={`${userData.username}에게 프라이빗 토크`}
        data={[]}
        inPage='private'
        onImageUpload={onImageUpload}
      />
    </div>
  );
};

export default PrivatePage;

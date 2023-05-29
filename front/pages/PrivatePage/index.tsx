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
import { toast } from 'react-toastify';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import Avvvatars from 'avvvatars-react';

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
        if (data?.length === 1) {
          setTimeout(() => {
            scrollbarRef.current?.scrollToBottom();
          }, 100);
        }
      },
    },
  );
  const [talk, onChangeTalk, setTalk] = useInput('');
  const scrollbarRef = useRef<Scrollbars>(null);
  const [dragOver, setDragOver] = useState(false);

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
          if (scrollbarRef.current) {
            console.log('scrollToBottom...', scrollbarRef.current?.getValues());
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
              console.log('scrollToBottom...', scrollbarRef.current?.getValues());
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 100);
            } else {
              toast.success('새 토크 확인', {
                onClick() {
                  scrollbarRef.current?.scrollToBottom();
                },
                closeOnClick: true,
              });
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
      console.log(e);
      const formData = new FormData();
      if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            console.log('... file[' + i + '].name = ' + file.name);
            formData.append('image', file);
          }
        }
      } else {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
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

  const onDragOver = useCallback((e: any) => {
    e.preventDefault();
    console.log(e);
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
      {/* <div className='h-8 flex w-full p-4 items-center'>
        <Avvvatars size={32} style='shape' value={userData.email} />
        <span>{userData.username}</span>
      </div> */}
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
      />
      {dragOver && (
        <div className='absolute top-5 left-0 w-full h-full bg-white opacity-60 flex items-center justify-center '>
          Upload
        </div>
      )}
    </div>
  );
};

export default PrivatePage;

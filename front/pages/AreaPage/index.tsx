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
import { toast } from 'react-toastify';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import TalkForm from '@components/TalkForm';
import TalkList from '@components/TalkList';

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

  const scrollbarRef = useRef<Scrollbars>(null);
  const [dragOver, setDragOver] = useState(false);

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
          if (scrollbarRef.current) {
            console.log('scrollToBottom!', scrollbarRef.current?.getValues());
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
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 100);
            } else {
              toast.success('새 메시지가 도착했습니다.', {
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
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          console.log(e.dataTransfer.items[i]);
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            console.log(e, '.... file[' + i + '].name = ' + file.name);
            formData.append('image', file);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
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

  const onDragOver = useCallback((e: any) => {
    e.preventDefault();
    console.log(e);
    setDragOver(true);
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
      <div className='md:hidden absolute top-2 overflow-hidden text-ellipsis max-w-[80px] left-1 text-sm z-10 rounded-md px-1.5 py-0.5 bg-amber-500 text-white'>
        {area}
      </div>
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

      {/* <ToastContainer position='bottom-center' />
      {dragOver && (
        <div className='absolute top-5 left-0 w-full h-full bg-white opacity-60 flex items-center justify-center '>
          Upload
        </div>
      )} */}
    </div>
  );
};

export default AreaPage;

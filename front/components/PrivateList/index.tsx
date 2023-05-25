import PrivateItem from '@components/PrivateItem';
import useSocket from '@hooks/useSocket';
import { User, UserWithOnline } from '@typings/types';
import ApiFetcher from '@functions/ApiFetcher';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

const PrivateList: FC = () => {
  const { blooway } = useParams<{ blooway?: string }>();
  const { data: userData } = useSWR<User>('/api/users', ApiFetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<UserWithOnline[]>(
    userData ? `/api/blooways/${blooway}/members` : null,
    ApiFetcher,
  );
  const [socket] = useSocket(blooway);
  const [hideArea, setHideArea] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleHideArea = useCallback(() => {
    setHideArea((prev) => !prev);
  }, []);

  useEffect(() => {
    setOnlineList([]);
  }, [blooway]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    console.log('socket on private', socket?.hasListeners('private'), socket);
    return () => {
      console.log('socket off private', socket?.hasListeners('private'));
      socket?.off('onlineList');
    };
  }, [socket]);

  return (
    <>
      <h2>
        <button onClick={toggleHideArea}>
          <i
            className={`${hideArea && 'transform-none'}`}
            data-qa='area-section-collapse'
            aria-hidden='true'
          />
        </button>
        <span>프라이빗 메시지</span>
      </h2>
      <div>
        {!hideArea &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return <PrivateItem key={member.id} member={member} isOnline={isOnline} />;
          })}
      </div>
    </>
  );
};

export default PrivateList;

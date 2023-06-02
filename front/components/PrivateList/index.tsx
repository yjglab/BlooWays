import PrivateItem from '@components/PrivateItem';
import useSocket from '@hooks/useSocket';
import { User, UserWithOnline } from '@typings/types';
import ApiFetcher from '@functions/ApiFetcher';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Disclosure } from '@headlessui/react';

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
  const [onlineList, setOnlineList] = useState<number[]>([]);

  useEffect(() => {
    setOnlineList([]);
  }, [blooway]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    // console.log('socket on private', socket?.hasListeners('private'), socket);
    return () => {
      // console.log('socket off private', socket?.hasListeners('private'));
      socket?.off('onlineList');
    };
  }, [socket]);

  return (
    <>
      <div>
        {memberData?.map((member) => {
          const isOnline = onlineList.includes(member.id);
          return (
            <Disclosure.Panel key={member.id} className='px-4 py-1.5 text-sm'>
              <PrivateItem member={member} isOnline={isOnline} />
            </Disclosure.Panel>
          );
        })}
      </div>
    </>
  );
};

export default PrivateList;

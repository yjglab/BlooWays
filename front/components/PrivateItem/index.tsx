import { User } from '@typings/types';
import ApiFetcher from '@functions/ApiFetcher';
import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import useSWR from 'swr';
import Avvvatars from 'avvvatars-react';

interface PrivateItemProps {
  member: User;
  isOnline: boolean;
}
const PrivateItem: FC<PrivateItemProps> = ({ member, isOnline }) => {
  const { blooway } = useParams<{ blooway?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<User>('/api/users', ApiFetcher, {
    dedupingInterval: 2000,
  });
  const date = localStorage.getItem(`${blooway}-${member.id}`) || 0;
  const { data: unreadCount, mutate } = useSWR<number>(
    userData ? `/api/blooways/${blooway}/privates/${member.id}/unreads?after=${date}` : null,
    ApiFetcher,
  );

  useEffect(() => {
    if (location.pathname === `/blooway/${blooway}/private/${member.id}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, blooway, member]);

  return (
    <NavLink
      key={member.id}
      className='flex items-center w-full'
      activeClassName='text-amber-500 font-semibold'
      to={`/blooway/${blooway}/private/${member.id}`}
    >
      <div className='relative'>
        <Avvvatars size={24} shadow={true} style='shape' value={member.email} />
        <div
          className={`${
            isOnline ? 'bg-emerald-400' : 'bg-slate-400'
          } absolute right-0 bottom-0 border border-white w-[9px] h-[9px] rounded-full`}
        ></div>
      </div>
      <span className='hover:text-amber-500 ml-1.5 overflow-hidden text-ellipsis max-w-[120px]'>
        {member.username}
      </span>
      {member.id === userData?.id && <span className='ml-0.5'>(나)</span>}
      {unreadCount !== undefined && unreadCount > 0 && (
        <div
          id='unread-count'
          className='bg-amber-500 text-white ml-1.5 rounded-full w-4 h-4 text-[6px] p-1 flex justify-center items-center'
        >
          {unreadCount}
        </div>
      )}
    </NavLink>
  );
};

export default PrivateItem;

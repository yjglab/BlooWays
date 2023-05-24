import { User } from '@typings/types';
import ApiFetcher from '@functions/ApiFetcher';
import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import useSWR from 'swr';

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
      // className={({ isActive, isPending }) => (isPending ? '' : isActive ? 'text-white' : '')}
      to={`/blooway/${blooway}/private/${member.id}`}
    >
      <span>인디케이터 {isOnline ? 'on' : 'off'}</span>
      <span className={unreadCount && unreadCount > 0 ? 'bold' : undefined}>{member.username}</span>
      {member.id === userData?.id && <span> (나)</span>}
      {(unreadCount && unreadCount > 0 && <span className='unreadCount'>{unreadCount}</span>) || null}
    </NavLink>
  );
};

export default PrivateItem;

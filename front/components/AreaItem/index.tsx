import { Area, User } from '@typings/types';
import ApiFetcher from '@functions/ApiFetcher';
import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import useSWR from 'swr';

interface AreaItemProps {
  area: Area;
}
const AreaItem: FC<AreaItemProps> = ({ area }) => {
  const { blooway } = useParams<{ blooway?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<User>('/api/users', ApiFetcher, {
    dedupingInterval: 2000,
  });
  const date = localStorage.getItem(`${blooway}-${area.name}`) || 0;
  const { data: unreadCount, mutate } = useSWR<number>(
    userData ? `/api/blooways/${blooway}/areas/${area.name}/unreads?after=${date}` : null,
    ApiFetcher,
  );

  useEffect(() => {
    if (location.pathname === `/blooway/${blooway}/area/${area.name}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, blooway, area]);

  return (
    <NavLink
      key={area.name}
      // className={({ isActive, isPending }) => (isPending ? '' : isActive ? 'text-white' : '')}
      to={`/blooway/${blooway}/area/${area.name}`}
    >
      <span className={unreadCount !== undefined && unreadCount > 0 ? 'font-bold' : undefined}>
        # {area.name}
      </span>
      {unreadCount !== undefined && unreadCount > 0 && <span>{unreadCount}</span>}
    </NavLink>
  );
};

export default AreaItem;

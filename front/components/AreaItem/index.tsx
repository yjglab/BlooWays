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
      className='w-full flex items-center'
      activeClassName='text-amber-500 font-semibold'
      to={`/blooway/${blooway}/area/${area.name}`}
    >
      <div className='hover:text-amber-500  flex items-center overflow-hidden text-ellipsis max-w-[120px]'>
        {area.name}
      </div>
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

export default AreaItem;

import AreaItem from '@components/AreaItem';
import { Area, User } from '@typings/types';
import ApiFetcher from '@functions/ApiFetcher';
import React, { FC } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Disclosure } from '@headlessui/react';

const AreaList: FC = () => {
  const { blooway } = useParams<{ blooway?: string }>();
  const { data: userData } = useSWR<User>('/api/users', ApiFetcher, {
    dedupingInterval: 2000,
  });
  const { data: areaData } = useSWR<Area[]>(userData ? `/api/blooways/${blooway}/areas` : null, ApiFetcher);

  return (
    <>
      {areaData?.map((area) => {
        return (
          <Disclosure.Panel key={area.id} className='px-4 py-1.5 text-sm'>
            <AreaItem area={area} />
          </Disclosure.Panel>
        );
      })}
    </>
  );
};

export default AreaList;

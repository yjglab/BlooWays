import AreaItem from '@components/AreaItem';
import { Area, User } from '@typings/types';
import ApiFetcher from '@functions/ApiFetcher';
import React, { FC, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

const AreaList: FC = () => {
  const { blooway } = useParams<{ blooway?: string }>();
  const [hideArea, setHideArea] = useState(false);
  const { data: userData } = useSWR<User>('/api/users', ApiFetcher, {
    dedupingInterval: 2000,
  });
  const { data: areaData } = useSWR<Area[]>(userData ? `/api/blooways/${blooway}/areas` : null, ApiFetcher);

  const toggleHideArea = useCallback(() => {
    setHideArea((prev) => !prev);
  }, []);

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
        <span>Areas</span>
      </h2>
      <div>
        {!hideArea &&
          areaData?.map((area) => {
            return <AreaItem key={area.id} area={area} />;
          })}
      </div>
    </>
  );
};

export default AreaList;

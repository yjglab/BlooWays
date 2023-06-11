import { backUrl } from '@functions/global';
import { Talk, Private, User } from '@typings/types';
import Avvvatars from 'avvvatars-react';
import dayjs from 'dayjs';
import React, { FC, useMemo, memo, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import regexifyString from 'regexify-string';

interface TalkFieldProps {
  data: Private | Talk;
}
const TalkField: FC<TalkFieldProps> = memo(({ data }) => {
  const [showCarousel, setShowCarousel] = useState(false);
  const { blooway } = useParams<{ blooway: string; area: string }>();
  const user: User = 'Sender' in data ? data.Sender : data.User;
  const result = useMemo<(string | JSX.Element)[] | JSX.Element>(
    () =>
      data.content.startsWith('uploads\\') ||
      data.content.startsWith('uploads/') ||
      data.content.startsWith('https://bloowaysbucket') ? (
        <img
          id='image'
          src={process.env.NODE_ENV === 'production' ? `${data.content}` : `${backUrl + '/' + data.content}`}
          className='max-h-52 rounded-md'
        />
      ) : (
        regexifyString({
          pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
          decorator(match, index) {
            const matched: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
            if (matched) {
              return (
                <Link key={match + index} to={`/blooway/${blooway}/private/${matched[2]}`}>
                  <span className='text-amber-500 font-semibold hover:text-amber-600'>@{matched[1]}</span>
                </Link>
              );
            }
            return <br key={index} />;
          },
          input: data.content,
        })
      ),
    [blooway, data.content],
  );
  const onShowCarousel = useCallback((e: any) => {
    if (e.target.id === 'image') {
      setShowCarousel(true);
    }
  }, []);
  const onCloseCarousel = useCallback(() => {
    setShowCarousel(false);
  }, []);
  return (
    <div className='my-1 pt-1.5 pb-3.5 px-2 pr-6 duration-200 rounded-lg hover:bg-slate-100 flex w-full flex-col'>
      <div className='flex w-full justify-between items-center'>
        <NavLink
          className='flex items-center'
          activeClassName='text-amber-500 font-semibold'
          to={`/blooway/${blooway}/private/${user.id}`}
        >
          <Avvvatars size={32} style='shape' value={user.email} />
          <div className='ml-2 text-md font-semibold text-slate-800'>{user.username}</div>
        </NavLink>
        <div className='flex items-center mt-1 text-xs leading-5 text-slate-400'>
          <span>{dayjs(data.createdAt).format('A h:mm')}</span>
        </div>
      </div>

      <p onClick={onShowCarousel} className='break-words whitespace-pre-line ml-10 text-sm'>
        {result}
      </p>
      {showCarousel && (
        <div
          onClick={onCloseCarousel}
          className='p-3 z-40 bg-slate-800/70  fixed w-full h-full top-0 left-0 flex items-center [&>img]:w-full [&>img]:h-auto [&>img]:shadow-lg [&>img]:shadow-slate-800/80 [&>img]:max-h-full'
        >
          {result}
        </div>
      )}
    </div>
  );
});

export default TalkField;

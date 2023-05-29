import { backUrl } from '@functions/global';
import { Talk, Private, User } from '@typings/types';
import Avvvatars from 'avvvatars-react';
import dayjs from 'dayjs';
import React, { FC, useMemo, memo } from 'react';
import { useParams } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import regexifyString from 'regexify-string';

interface TalkFieldProps {
  data: Private | Talk;
}
const TalkField: FC<TalkFieldProps> = memo(({ data }) => {
  const { blooway } = useParams<{ blooway: string; area: string }>();
  const user: User = 'Sender' in data ? data.Sender : data.User;
  const result = useMemo<(string | JSX.Element)[] | JSX.Element>(
    () =>
      data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') ? (
        <img src={`${backUrl}/${data.content}`} style={{ maxHeight: 200 }} />
      ) : (
        regexifyString({
          pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
          decorator(match, index) {
            const matched: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
            if (matched) {
              return (
                <Link key={match + index} to={`/blooway/${blooway}/private/${matched[2]}`}>
                  @{matched[1]}
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

  return (
    <div className='my-1 pt-1.5 pb-3.5 px-2 pr-6 duration-200 rounded-lg hover:bg-slate-100 flex w-full flex-col'>
      <div className='flex w-full justify-between items-center'>
        <NavLink
          className='flex items-center'
          activeClassName='text-amber-500 font-semibold'
          to={`/blooway/${blooway}/private/${user.id}`}
        >
          <Avvvatars size={32} style='shape' value={user.email} />
          <div className='ml-2 text-md font-semibold text-gray-900'>{user.username}</div>
        </NavLink>
        <div className='flex items-center mt-1 text-xs leading-5 text-slate-500'>
          <span>{dayjs(data.createdAt).format('A h:mm')}</span>
        </div>
      </div>

      <p className='break-words whitespace-pre-line ml-10 text-sm'>{result}</p>
    </div>
  );
});

export default TalkField;

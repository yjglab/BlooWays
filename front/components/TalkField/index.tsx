import { backUrl } from '@functions/global';
import { Talk, Private, User } from '@typings/types';
import Avvvatars from 'avvvatars-react';
import dayjs from 'dayjs';
import React, { FC, useMemo, memo } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
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
    <div className='flex p-4 hover:bg-slate-200'>
      <div className='flex w-5 mr-2'>
        <Avvvatars size={16} style='shape' value={user.email} />
      </div>
      <div className='flex flex-wrap w-full'>
        <div className='flex flex-[0,0,100%] items-center'>
          <b className='mr-2'>{user.username}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p className='m-0 flex-[0,0,100%]'>{result}</p>
      </div>
    </div>
  );
});

export default TalkField;

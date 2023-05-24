import TalkField from '@components/TalkField';
import { Talk, Private } from '@typings/types';
import React, { FC, RefObject, useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface TalkListProps {
  scrollbarRef: RefObject<Scrollbars>;
  isDataEnd?: boolean;
  isEmpty: boolean;
  talkSections: { [key: string]: (Private | Talk)[] };
  setSize: (f: (size: number) => number) => Promise<(Private | Talk)[][] | undefined>;
}
const TalkList: FC<TalkListProps> = ({ scrollbarRef, isDataEnd, isEmpty, talkSections, setSize }) => {
  const onScroll = useCallback(
    (e: any) => {
      if (e.scrollTop === 0 && !isDataEnd && !isEmpty) {
        setSize((size) => size + 1).then(() => {
          scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - e.scrollHeight);
        });
      }
    },
    [setSize, scrollbarRef, isDataEnd, isEmpty],
  );

  return (
    <div id='talk-list' className='w-full flex'>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(talkSections).map(([date, talks]) => {
          return (
            <section className={`section-${date}`} key={date}>
              <div className='flex justify-center flex-[1] w-full sticky top-[14px]'>
                <button>{date}</button>
              </div>
              {talks.map((talk) => (
                <TalkField key={talk.id} data={talk} />
              ))}
            </section>
          );
        })}
      </Scrollbars>
    </div>
  );
};

export default TalkList;

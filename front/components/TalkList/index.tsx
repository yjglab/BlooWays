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
    <div id='talk-list' className='overflow-x-hidden w-full h-full flex'>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(talkSections).map(([date, talks]) => {
          return (
            <section className={`section-${date}`} key={date}>
              <div
                id='talklist-bar'
                className='flex items-center overflow-x-hidden justify-center flex-[1] w-full sticky top-[7px] md:top-[12px]'
              >
                <div className='absolute left-2'>{}</div>
                <div className='ml-2 inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-500/10'>
                  {date}
                </div>
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

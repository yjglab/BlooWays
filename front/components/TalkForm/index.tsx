import { User } from '@typings/types';
import autosize from 'autosize';
import Avvvatars from 'avvvatars-react';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';

interface TalkFormProps {
  onSubmitForm: (e: any) => void;
  talk?: string;
  onChangeTalk: (e: any) => void;
  placeholder: string;
  data?: User[];
}
const TalkForm: FC<TalkFormProps> = ({ onSubmitForm, talk, onChangeTalk, placeholder, data }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  const onKeydownTalk = useCallback(
    (e: any) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm],
  );

  const renderUserSuggestion: (
    suggestion: SuggestionDataItem,
    search: string,
    highlightedDisplay: React.ReactNode,
    index: number,
    focused: boolean,
  ) => React.ReactNode = useCallback(
    (member, search, highlightedDisplay, index, focus) => {
      if (!data) {
        return null;
      }
      return (
        <button className={`${focus && 'bg-red-400 text-white'} p-2 flex border-none items-center w-full`}>
          <Avvvatars size={32} style='shape' value={data[index].email} />
          <span>{highlightedDisplay}</span>
        </button>
      );
    },
    [data],
  );

  return (
    <div id='talk-form' className='flex w-full p-2 pt-0'>
      <form className='w-full rounded-md border border-black' onSubmit={onSubmitForm}>
        <MentionsInput
          id='talk'
          value={talk}
          onChange={onChangeTalk}
          onKeyPress={onKeydownTalk}
          placeholder={placeholder}
          inputRef={textareaRef}
          forceSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger='@'
            data={data?.map((v) => ({ id: v.id, display: v.username })) || []}
            renderSuggestion={renderUserSuggestion}
          />
        </MentionsInput>
        <div className='relative h-6 flex items-center rounded-b-md'>
          <button
            className={`absolute ${talk?.trim() ? '' : 'bg-emerald-400'}`}
            type='submit'
            disabled={!talk?.trim()}
          >
            <i className='c-icon c-icon--paperplane-filled' aria-hidden='true' />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TalkForm;

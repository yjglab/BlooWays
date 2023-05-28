import { User } from '@typings/types';
import Avvvatars from 'avvvatars-react';
import React, { FC, useCallback } from 'react';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';
import styled from 'styled-components';

export const MentionsInputText = styled(MentionsInput)`
  padding: 10px;

  & textarea {
    height: 80px;
    padding: 9px 10px !important;
    outline: none !important;
    border-radius: 4px !important;
    resize: none !important;
    line-height: 22px;
    border: none;
  }
`;

interface TalkFormProps {
  onSubmitForm: (e: any) => void;
  talk?: string;
  onChangeTalk: (e: any) => void;
  placeholder: string;
  data?: User[];
}
const TalkForm: FC<TalkFormProps> = ({ onSubmitForm, talk, onChangeTalk, placeholder, data }) => {
  // const textareaRef = useRef<HTMLTextAreaElement>(null);
  // useEffect(() => {
  //   if (textareaRef.current) {
  //     autosize(textareaRef.current);
  //   }
  // }, []);

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
    <div id='talk-form' className='w-full flex p-2 pt-0'>
      <form onSubmit={onSubmitForm} className='w-full border rounded-md'>
        <MentionsInputText
          id='talk'
          value={talk}
          onChange={onChangeTalk}
          onKeyPress={onKeydownTalk}
          placeholder={placeholder}
          // inputRef={textareaRef}
          wrap='hard'
          forceSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger='@'
            data={data?.map((v) => ({ id: v.id, display: v.username })) || []}
            renderSuggestion={renderUserSuggestion}
          />
        </MentionsInputText>
        <div className='flex relative items-center h-14'>
          <button type='submit' className={`${talk?.trim() ? '' : 'bg-emerald-400'} absolute right-2 top-2`}>
            Post comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default TalkForm;

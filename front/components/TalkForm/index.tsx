import InviteAreaModal from '@components/InviteAreaModal';
import { RocketLaunchIcon, UserPlusIcon } from '@heroicons/react/20/solid';
import { User } from '@typings/types';
import Avvvatars from 'avvvatars-react';
import React, { FC, useCallback, useState } from 'react';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';
import styled from 'styled-components';

export const MentionsInputText = styled(MentionsInput)`
  padding: 10px;

  & textarea {
    height: 80px;
    padding: 9px 10px !important;
    outline: none !important;
    border-top-left-radius: 10px !important;
    border-top-right-radius: 10px !important;
    resize: none !important;
    line-height: 22px;
    border: none;
    ::placeholder {
      color: #b4b4b4;
      font-size: 14px;
    }
    &:focus {
      border-color: #cccccc;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
  }
`;

interface TalkFormProps {
  onSubmitForm: (e: any) => void;
  talk?: string;
  onChangeTalk: (e: any) => void;
  placeholder: string;
  data?: User[];
  inPage: string;
}
const TalkForm: FC<TalkFormProps> = ({ onSubmitForm, talk, onChangeTalk, placeholder, data, inPage }) => {
  const [showInviteAreaModal, setShowInviteAreaModal] = useState(false);

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
        <button
          className={`${
            focus && 'bg-amber-500 text-white'
          } gap-1 text-xs rounded-md px-1 relative bottom-1 py-1 flex border-none items-center w-full`}
        >
          <Avvvatars size={18} style='shape' value={data[index].email} />
          <span>{highlightedDisplay}</span>
        </button>
      );
    },
    [data],
  );

  const onClickInviteArea = useCallback(() => {
    setShowInviteAreaModal(true);
  }, []);
  const onCloseModal = useCallback(() => {
    setShowInviteAreaModal(false);
  }, []);

  return (
    <div id='talk-form' className='pb-5 w-full flex pt-0'>
      <form onSubmit={onSubmitForm} className='w-full border rounded-lg'>
        <MentionsInputText
          id='talk'
          value={talk}
          onChange={onChangeTalk}
          onKeyPress={onKeydownTalk}
          placeholder={placeholder}
          wrap='hard'
          forceSuggestionsAboveCursor
          className='h-20 text-sm md:text-base'
          // inputRef={textareaRef}
        >
          <Mention
            appendSpaceOnAdd
            trigger='@'
            data={data?.map((v) => ({ id: v.id, display: v.username })) || []}
            renderSuggestion={renderUserSuggestion}
          />
        </MentionsInputText>
        <div className='flex justify-between relative items-center px-2 h-9 bg-slate-100'>
          {inPage === 'area' && (
            <button
              type='button'
              onClick={onClickInviteArea}
              className='flex justify-center items-center p-1 rounded-md duration-200'
            >
              <UserPlusIcon className='text-slate-700 hover:text-amber-500 w-5' />
            </button>
          )}
          {inPage === 'private' && (
            <div className='flex justify-center items-center p-1 text-slate-700 rounded-md duration-200'></div>
          )}
          <button
            type='submit'
            className={`${
              talk?.trim() && 'bg-amber-500 shadow '
            } flex justify-center items-center p-1 rounded-md  duration-200`}
          >
            <RocketLaunchIcon
              className={`${talk?.trim() ? 'hover:scale-105 text-white' : 'text-slate-300'}  w-5 `}
            />
          </button>
        </div>
      </form>
      {inPage === 'area' && (
        <InviteAreaModal
          show={showInviteAreaModal}
          onCloseModal={onCloseModal}
          setShowInviteAreaModal={setShowInviteAreaModal}
        />
      )}
    </div>
  );
};

export default TalkForm;

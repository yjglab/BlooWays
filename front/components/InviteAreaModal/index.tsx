import Modal from '@components/Modal';
import { User } from '@typings/types';
import ApiFetcher from '@functions/ApiFetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { SubmitHandler, useForm } from 'react-hook-form';

interface InviteAreaModalProps {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteAreaModal: (flag: boolean) => void;
}
const InviteAreaModal: FC<InviteAreaModalProps> = ({ show, onCloseModal, setShowInviteAreaModal }) => {
  const { blooway, area } = useParams<{ blooway: string; area: string }>();
  const { data: userData } = useSWR<User>('/api/users', ApiFetcher);
  const { mutate: revalidateMembers } = useSWR<User[]>(
    userData ? `/api/blooways/${blooway}/areas/${area}/members` : null,
    ApiFetcher,
  );

  interface InviteMemberValues {
    memberEmail: string;
  }
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InviteMemberValues>();
  const onInviteMember: SubmitHandler<InviteMemberValues> = useCallback(
    (formData) => {
      const { memberEmail } = formData;
      if (!memberEmail || !memberEmail.trim()) {
        return;
      }
      axios
        .post(`/api/blooways/${blooway}/areas/${area}/members`, {
          email: memberEmail,
        })
        .then(() => {
          revalidateMembers();
          setShowInviteAreaModal(false);
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [area, revalidateMembers, setShowInviteAreaModal, blooway],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={handleSubmit(onInviteMember)}>
        <label htmlFor='memberEmail' className='sr-only'>
          <span>에리어 멤버 초대</span>
          <input
            id='memberEmail'
            type='text'
            className='relative block w-full appearance-none rounded-t-md  border border-slate-300 px-3 py-2 text-slate-600 placeholder-slate-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            placeholder='이메일 주소'
            {...register('memberEmail', {
              required: '이메일은 필수 입력입니다',
              maxLength: 100,
              pattern: {
                value: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                message: '이메일 형식에 맞지 않습니다',
              },
            })}
          />
        </label>
        <button disabled={isSubmitting} type='submit'>
          초대하기
        </button>
      </form>
    </Modal>
  );
};

export default InviteAreaModal;

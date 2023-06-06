import Modal from '@components/Modal';
import { User } from '@typings/types';
import ApiFetcher from '@functions/ApiFetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toastConfig } from '@functions/global';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteBloowayModal: (flag: boolean) => void;
}
const InviteBloowayModal: FC<Props> = ({ show, onCloseModal, setShowInviteBloowayModal }) => {
  const { blooway } = useParams<{ blooway: string; area: string }>();
  const { data: userData } = useSWR<User>('/api/users', ApiFetcher);
  const { mutate: revalidateMember } = useSWR<User[]>(
    userData ? `/api/blooways/${blooway}/members` : null,
    ApiFetcher,
  );

  interface InviteMemberValues {
    memberEmail: string;
  }
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<InviteMemberValues>();
  const onInviteMember: SubmitHandler<InviteMemberValues> = useCallback(
    (formData) => {
      const { memberEmail } = formData;
      if (!memberEmail || !memberEmail.trim()) {
        return toast.error('초대할 멤버의 이메일을 입력해주세요', toastConfig);
      }
      axios
        .post(`/api/blooways/${blooway}/members`, {
          email: memberEmail,
        })
        .then(() => {
          revalidateMember();
          setShowInviteBloowayModal(false);
          toast.success(`${memberEmail}님을 ${blooway} 블루웨이에 초대했습니다.`, toastConfig);
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, toastConfig);
        });
    },
    [blooway, revalidateMember, setShowInviteBloowayModal],
  );

  return (
    <Modal modalType={0} modalTitle='블루웨이에 멤버 초대하기' show={show} onCloseModal={onCloseModal}>
      <form id='invite-blooway-modal' className='w-full' onSubmit={handleSubmit(onInviteMember)}>
        <div className='w-full my-4'>
          <span>멤버 이메일</span>
          <input
            id='memberEmail'
            type='text'
            className='mt-2 relative block w-full appearance-none rounded-md  border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
            placeholder='이메일 주소'
            {...register('memberEmail', {
              maxLength: 100,
              pattern: {
                value: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                message: '이메일 형식에 맞지 않습니다',
              },
            })}
          />
        </div>
        <div className='flex justify-center flex-col'>
          <span className='text-xs mx-auto text-amber-500 mb-3'>
            {errors.memberEmail && errors.memberEmail.message}
          </span>
          <button
            disabled={isSubmitting}
            type='submit'
            className='inline-flex justify-center rounded-md border border-transparent bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2'
          >
            초대하기
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InviteBloowayModal;

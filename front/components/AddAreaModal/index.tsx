import Modal from '@components/Modal';
import { Area, User } from '@typings/types';
import ApiFetcher from '@functions/ApiFetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { PencilIcon } from '@heroicons/react/20/solid';
import { SubmitHandler, useForm } from 'react-hook-form';

interface AddAreaModalProps {
  show: boolean;
  onCloseModal: () => void;
  setShowAddAreaModal: (flag: boolean) => void;
}
const AddAreaModal: FC<AddAreaModalProps> = ({ show, onCloseModal, setShowAddAreaModal }) => {
  const params = useParams<{ blooway?: string }>();
  const { blooway } = params;
  const { data: userData } = useSWR<User | false>('/api/users', ApiFetcher);
  const { mutate: revalidateArea } = useSWR<Area[]>(
    userData ? `/api/blooways/${blooway}/areas` : null,
    ApiFetcher,
  );
  interface onAddAreaValues {
    areaName: string;
  }
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<onAddAreaValues>();

  const onAddArea: SubmitHandler<onAddAreaValues> = useCallback(
    (formData) => {
      const { areaName } = formData;
      if (!areaName || !areaName.trim()) {
        return setError('areaName', {
          message: '빈 이름의 에리어를 생성할 수 없습니다.',
        });
      }
      axios
        .post(`/api/blooways/${blooway}/areas`, {
          name: areaName,
        })
        .then(() => {
          revalidateArea();
          setShowAddAreaModal(false);
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [setShowAddAreaModal, blooway, revalidateArea, setError],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form id='add-area-modal' className='mt-8 space-y-3' onSubmit={handleSubmit(onAddArea)}>
        <input type='hidden' name='remember' defaultValue='true' />
        <div className='-space-y-px rounded-md '>
          <div>
            <label htmlFor='areaName' className='sr-only' />
            <input
              id='areaName'
              type='text'
              className='relative block w-full appearance-none rounded-t-md  border border-slate-300 px-3 py-2 text-slate-600 placeholder-slate-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
              placeholder='사용자명 (4~10자)'
              {...register('areaName', {
                required: '사용자명은 필수 입력입니다',
                minLength: {
                  value: 2,
                  message: '2자리 이상의 에리어 이름을 입력해주세요',
                },
                maxLength: {
                  value: 10,
                  message: '10자리 이하의 에리어 이름을 입력해주세요',
                },
              })}
            />
          </div>
        </div>

        <div>
          <div>
            <div className='h-6 flex justify-center text-orange-400 text-xs ' role='alert'>
              {errors.areaName ? errors.areaName.message : null}
            </div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                <PencilIcon
                  className='h-5 w-5 text-indigo-600 group-hover:text-indigo-50'
                  aria-hidden='true'
                />
              </span>
              생성
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddAreaModal;

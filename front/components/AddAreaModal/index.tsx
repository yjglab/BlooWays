import Modal from '@components/Modal';
import { Area, User } from '@typings/types';
import ApiFetcher from '@functions/ApiFetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { toastConfig } from '@functions/global';

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
    formState: { isSubmitting },
  } = useForm<onAddAreaValues>();

  const onAddArea: SubmitHandler<onAddAreaValues> = useCallback(
    (formData) => {
      const { areaName } = formData;
      if (!areaName || !areaName.trim()) {
        return toast.error('에리어 이름을 입력해주세요.', toastConfig);
      }
      axios
        .post(`/api/blooways/${blooway}/areas`, {
          name: areaName,
        })
        .then(() => {
          revalidateArea();
          setShowAddAreaModal(false);
          toast.success(`에리어 ${areaName}를 생성했습니다.`, toastConfig);
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, toastConfig);
        });
    },
    [setShowAddAreaModal, blooway, revalidateArea],
  );

  return (
    <Modal modalType={0} modalTitle='새로운 에리어 추가하기' show={show} onCloseModal={onCloseModal}>
      <form id='add-area-modal' className='w-full' onSubmit={handleSubmit(onAddArea)}>
        <div className='w-full my-4'>
          <span>에리어 이름</span>
          <input
            id='areaName'
            type='text'
            className='mt-2 relative block w-full appearance-none rounded-md  border border-slate-300 px-3 py-2 text-slate-700 placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
            placeholder='10자 이내로 설정해주세요'
            {...register('areaName', {})}
          />
        </div>
        <div className='flex justify-center'>
          <button
            disabled={isSubmitting}
            type='submit'
            className='inline-flex justify-center rounded-md border border-transparent bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2'
          >
            생성하기
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAreaModal;

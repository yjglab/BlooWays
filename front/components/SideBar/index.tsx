import React, { FC, memo, useCallback, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import PrivateList from '@components/PrivateList';
import AreaList from '@components/AreaList';
import { CubeIcon, EyeSlashIcon, MegaphoneIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import AddAreaModal from '@components/AddAreaModal';

interface SideBarProps {}

const SideBar: FC<SideBarProps> = memo(() => {
  const [showCta, setShowCta] = useState(true);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);

  const onRemoveCta = useCallback(() => {
    setShowCta(false);
  }, []);
  const onClickAddArea = useCallback(() => {
    setShowAddAreaModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowAddAreaModal(false);
  }, []);
  return (
    <div className='hidden md:block w-[25%] rounded-md'>
      <div className='overflow-y-auto w-full rounded-2xl bg-white p-2'>
        <Disclosure defaultOpen={true} as='div'>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex w-full justify-between rounded-lg bg-slate-100 px-4 py-2 text-left text-sm font-medium  hover:bg-amber-500 hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-amber-500 focus-visible:ring-opacity-75'>
                <div className='flex items-center'>
                  <CubeIcon className='w-5' />
                  <span className='ml-1'>에리어</span>
                </div>
                <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
              </Disclosure.Button>
              <AreaList />
              <button type='button' onClick={onClickAddArea} className='px-4 py-1.5 text-sm'>
                <div className={`hover:text-amber-500 flex items-center`}>
                  <PlusCircleIcon className='stroke-2 w-5 mr-0.5' />
                  에리어 추가
                </div>
              </button>
            </>
          )}
        </Disclosure>
        <Disclosure defaultOpen={true} as='div' className='mt-2'>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex w-full justify-between rounded-lg bg-slate-100 px-4 py-2 text-left text-sm font-medium  hover:bg-amber-500 hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-amber-500 focus-visible:ring-opacity-75'>
                <div className='flex items-center'>
                  <EyeSlashIcon className='w-5' />
                  <span className='ml-1'>프라이빗 토크</span>
                </div>
                <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
              </Disclosure.Button>
              <PrivateList />
            </>
          )}
        </Disclosure>
        {showCta && (
          <div id='dropdown-cta' className='p-4 mt-6 rounded-lg bg-indigo-50 '>
            <div className='flex items-center mb-3'>
              <div className='bg-indigo-200 flex items-center text-sm font-semibold mr-2 px-2.5 py-0.5 rounded'>
                <MegaphoneIcon className='w-4' />
                <span className='ml-1'>Blooways</span>
              </div>
              <button
                type='button'
                onClick={onRemoveCta}
                className='ml-auto -mx-1.5 -my-1.5 bg-indigo-50  rounded-lg focus:ring-2 p-1 hover:bg-indigo-200 inline-flex h-6 w-6 '
              >
                <svg
                  aria-hidden='true'
                  className='w-4 h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <p className='mb-3 text-sm text-indigo-900'>BlooWays Beta에 오신것을 환영합니다!</p>
            <Link
              to='/version-release'
              className='text-sm text-indigo-900/60 underline font-medium hover:text-indigo-900/80'
            >
              버전 릴리즈 확인
            </Link>
          </div>
        )}
      </div>
      <AddAreaModal
        show={showAddAreaModal}
        onCloseModal={onCloseModal}
        setShowAddAreaModal={setShowAddAreaModal}
      />
    </div>
  );
});

export default SideBar;

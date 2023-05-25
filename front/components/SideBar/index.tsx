import React, { FC, memo } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import PrivateList from '@components/PrivateList';
import AreaList from '@components/AreaList';
import { EyeSlashIcon, GlobeAsiaAustraliaIcon } from '@heroicons/react/20/solid';

interface SideBarProps {}

const SideBar: FC<SideBarProps> = memo(() => {
  return (
    <div className='w-80 rounded-md'>
      <div className='overflow-y-auto h-screen w-full rounded-2xl bg-white p-2'>
        <Disclosure defaultOpen={true} as='div'>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex w-full justify-between rounded-lg bg-slate-100 px-4 py-2 text-left text-sm font-medium  hover:bg-amber-500 hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-amber-500 focus-visible:ring-opacity-75'>
                <div className='flex items-center'>
                  <GlobeAsiaAustraliaIcon className='w-5' />
                  <span className='ml-1'>에리어</span>
                </div>
                <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
              </Disclosure.Button>
              <AreaList />
            </>
          )}
        </Disclosure>
        <Disclosure defaultOpen={true} as='div' className='mt-2'>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex w-full justify-between rounded-lg bg-slate-100 px-4 py-2 text-left text-sm font-medium  hover:bg-amber-500 hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-amber-500 focus-visible:ring-opacity-75'>
                <div className='flex items-center'>
                  <EyeSlashIcon className='w-5' />
                  <span className='ml-1'>프라이빗 메시지</span>
                </div>
                <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
              </Disclosure.Button>
              <PrivateList />
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
});

{
  /* <div className='w-80 rounded-md  flex flex-col '>
      <div className='overflow-y-auto h-screen'>
        <AreaList />
        <PrivateList />
      </div>
    </div> */
}
export default SideBar;

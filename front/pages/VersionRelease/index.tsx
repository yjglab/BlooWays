import { StarIcon, WrenchScrewdriverIcon } from '@heroicons/react/20/solid';
import React, { FC } from 'react';

const VersionRelease: FC = () => {
  return (
    <div className='text-slate-800 bg-white '>
      {/* release-0.0.0 */}
      <div className=' flex relative mt-20 md:mt-24 pb-36 items-center max-w-2xl lg:max-w-4xl px-6 lg:px-8 mx-auto'>
        <div className='lg:pr-8 lg:pt-4'>
          <h2 className='text-base font-semibold leading-7 text-amber-500'>Version Release</h2>
          <p className='mt-2 text-3xl font-bold tracking-tight  sm:text-4xl'>blooways 0.0.0</p>
          <p className='mt-6 text-lg leading-8 '>
            blooways 베타 단계 개발을 완료했습니다. blooways 서비스 버전에 관한 변경 내역을 알려드립니다.
          </p>
          <div className='flex lg:flex-row flex-col mt-10 w-full gap-10 text-base leading-7  lg:max-w-none'>
            <div className='lg:w-1/2 w-full relative pl-9'>
              <div className=' font-semibold '>
                <StarIcon className='absolute top-1 left-1 h-5 w-5 text-amber-500' aria-hidden='true' />
                새로운 기능
              </div>{' '}
              <div className='mb-2'>
                <div className='w-[4px] h-[4px] mr-0.5 bg-slate-800 rounded-full inline-block relative bottom-1' />{' '}
                새롭게 추가되는 내용이 있다면 해당 항목에서 자세히 알려드립니다. 또한 정식 릴리즈 단계인
                1.0에서 많은 것들이 추가되고 업데이트 될 것입니다.
              </div>
              <div className='mb-2'>
                <div className='w-[4px] h-[4px] mr-0.5 bg-slate-800 rounded-full inline-block relative bottom-1' />{' '}
                모든 기능에 관한 검토를 마쳤습니다. 혹시라도 발견하지 못한 오류가 발생하거나 건의하실 의견이
                있으시다면 bloobolt.co@gmail.com 으로 전달해주시면 감사하겠습니다.
              </div>
            </div>
            <div className='lg:w-1/2 w-full relative pl-9'>
              <div className=' font-semibold '>
                <WrenchScrewdriverIcon
                  className='absolute top-1 left-1 h-5 w-5 text-amber-500'
                  aria-hidden='true'
                />
                변경된 내용
              </div>{' '}
              <div className='mb-2'>
                <div className='w-[4px] h-[4px] mr-0.5 bg-slate-800 rounded-full inline-block relative bottom-1' />{' '}
                기능 추가에 따른 사용자 인터페이스와 서비스 안정성을 개선했습니다.
              </div>
            </div>{' '}
          </div>
        </div>
        {/* <div className='w-full mt-8 md:mt-16 mx-auto relative overflow-hidden rounded-xl shadow-xl  justify-center'>
            <Image src={guideShot2} className=' absolute ' />
          </div> */}
      </div>
    </div>
  );
};

export default VersionRelease;

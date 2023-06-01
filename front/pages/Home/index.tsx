import React from 'react';
import { Link } from 'react-router-dom';
import { logoUrl } from '@functions/global';

const Home = () => {
  return (
    <div className='text-slate-700 isolate bg-white min-h-screen'>
      <div className='min-h-screen relative flex items-center justify-center'>
        {/* <div className='absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20' />
        <div className='absolute inset-y-0 right-[43%] -z-10 w-[200%]  skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 mr-16 origin-center' /> */}

        <div className='relative px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'>
            <div className='text-center flex flex-col items-center justify-center'>
              <div className='flex items-center'>
                <img className='h-16 md:h-32 w-auto' src={logoUrl} />
                <span className='text-5xl md:text-8xl text-amber-500 font-bold '>BlooWays</span>
              </div>
              <p className='mt-12 w-[80%] md:w-full text-sm sm:text-base font-medium md:text-lg leading-5 '>
                BlooWays에서 전세계 어디서든 생생한 라이브 토크를 경험하세요.
              </p>
              <div className='mt-5 flex items-center justify-center gap-x-6'>
                <Link to='/signup'>
                  <span className='cursor-pointer rounded-md bg-amber-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'>
                    멤버 가입하기
                  </span>
                </Link>
                <Link to='/guide'>
                  <span className='cursor-pointer text-sm font-semibold leading-6 '>
                    사용자 가이드<span aria-hidden='true'>→</span>
                  </span>
                </Link>
              </div>
              <div className='bg-white text-xs mt-12 sm:text-sm relative rounded-full py-1 px-3 leading-6  ring-1 ring-slate-700/10 hover:ring-slate-700/20'>
                현재 버전은 0.0.0 Beta 입니다.{' '}
                <Link to='/version-release'>
                  <span className='cursor-pointer font-semibold text-amber-500 hover:text-amber-600'>
                    <span className='absolute inset-0' aria-hidden='true' />
                    변경된 내용 알아보기 <span aria-hidden='true'>&rarr;</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

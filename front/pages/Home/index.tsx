import ApiFetcher from '@functions/ApiFetcher';
import { logoUrl } from '@functions/global';
import React from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

const Home = () => {
  const { data: userData } = useSWR('/api/users', ApiFetcher);
  return (
    <div className='text-slate-800 isolate bg-white min-h-screen'>
      <div className='min-h-screen relative flex items-center justify-center'>
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
                {userData ? (
                  <Link to={`/blooway/${userData?.username}/area/전체`}>
                    <span className='cursor-pointer rounded-md bg-amber-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'>
                      나의 블루웨이
                    </span>
                  </Link>
                ) : (
                  <Link to='/signup'>
                    <span className='cursor-pointer rounded-md bg-amber-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'>
                      멤버 가입하기
                    </span>
                  </Link>
                )}

                <a href='https://github.com/yjglab/BlooWays' target='_blank' rel='noreferrer'>
                  <span className='cursor-pointer text-sm font-semibold leading-6 '>
                    GitHub 가이드
                    <span aria-hidden='true'>→</span>
                  </span>
                </a>
              </div>
              <div className='bg-white text-xs mt-12 sm:text-sm relative rounded-full py-1 px-3 leading-6  ring-1 ring-slate-800/10 hover:ring-slate-800/20'>
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

      <footer className='mx-auto mt-32 w-full max-w-container px-4 sm:px-6 lg:px-8'>
        <div className='border-t border-slate-900/5 py-10'>
          <div className='flex w-36 items-center left-0 right-0 mx-auto'>
            <div className='w-7 h-7'>
              <img src={logoUrl} />
            </div>
            <span className='text-[22px] font-bold ml-0.5 text-amber-500'>BlooWays</span>
          </div>
          <p className='mt-3 text-center text-sm leading-6 text-slate-500'>
            © 2023 yjglab. All rights reserved.
          </p>

          <div className='mt-16 flex items-center justify-center space-x-4 text-sm font-semibold leading-6 text-slate-700'>
            <span className='cursor-pointer'>서비스 이용 약관</span>
            <div className='h-4 w-px bg-slate-500/20' />
            <Link to='/version-release'>
              <span className='cursor-pointer'>버전 릴리즈</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

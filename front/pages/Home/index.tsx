import Modal from '@components/Modal';
import TermsContent from '@components/TermsContent';
import ApiFetcher from '@functions/ApiFetcher';
import { bloosLogoUrl, logoUrl } from '@functions/global';
import { Squares2X2Icon, UserIcon } from '@heroicons/react/20/solid';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

const Home = () => {
  const { data: userData } = useSWR('/api/users', ApiFetcher);
  const [toggleTerm, setToggleTerm] = useState(false);

  const onToggleTerms = useCallback(() => {
    setToggleTerm(!toggleTerm);
  }, [toggleTerm]);

  return (
    <div className='font-main text-slate-800 isolate bg-white min-h-screen'>
      <div className='min-h-screen relative flex items-center justify-center'>
        <div className='relative px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'>
            <div className='text-center flex flex-col items-center justify-center'>
              <div className='flex items-center'>
                <img alt='logo' className='h-16 md:h-32 w-auto' src={logoUrl} />
                <span className='text-5xl md:text-8xl text-amber-500 font-semibold '>blooways</span>
              </div>
              <p className='mt-12 w-[80%] md:w-full text-sm sm:text-base font-medium md:text-lg leading-5 '>
                blooways에서 전세계 어디서든 끊김없는 라이브 토크를 시작하세요.
              </p>
              <div className='flex-col md:flex-row mt-5 flex items-center justify-center gap-x-6'>
                <div className='flex gap-4 mb-3 md:mb-0'>
                  {userData ? (
                    <>
                      <Link to={`/blooway/all/area/전체`}>
                        <span className='flex cursor-pointer rounded-md bg-slate-500/80 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'>
                          <Squares2X2Icon className='w-4 mr-1' />
                          전체 블루웨이
                        </span>
                      </Link>
                      <Link to={`/blooway/${userData?.username}/area/전체`}>
                        <span className='flex cursor-pointer rounded-md bg-amber-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'>
                          <UserIcon className='w-4 mr-1' />
                          나의 블루웨이
                        </span>
                      </Link>
                    </>
                  ) : (
                    <Link to='/signup'>
                      <span className='cursor-pointer rounded-md bg-amber-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'>
                        멤버 가입하기
                      </span>
                    </Link>
                  )}
                </div>
                <a
                  href='https://github.com/yjglab/BlooWays/wiki/%EC%A3%BC%EC%9A%94-%EA%B8%B0%EB%8A%A5-%EC%86%8C%EA%B0%9C'
                  target='_blank'
                  rel='noreferrer'
                >
                  <span className=' cursor-pointer text-sm font-semibold leading-6 '>
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
                    무엇이 바뀌었나요? <span aria-hidden='true'>&rarr;</span>
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
              <img alt='logo' src={logoUrl} />
            </div>
            <span className='text-[22px] font-semibold ml-0.5 text-amber-500'>blooways</span>
          </div>
          <p className='mt-3 text-center text-sm leading-6 text-slate-500'>
            © 2023 Jaekyeong Yuk. All rights reserved.
          </p>
          <img
            alt='bloos logo'
            src={bloosLogoUrl}
            className='h-10 w-auto mx-auto opacity-90 relative top-3'
          />
          <div className='mt-12 flex items-center justify-center space-x-4 text-sm font-semibold leading-6 text-slate-700'>
            <button type='button' onClick={onToggleTerms} className='cursor-pointer'>
              서비스 이용 약관
            </button>
            <div className='h-4 w-px bg-slate-500/20' />
            <Link to='/version-release'>
              <span className='cursor-pointer'>버전 릴리즈</span>
            </Link>
          </div>
        </div>
      </footer>
      {toggleTerm && (
        <Modal modalType={0} modalTitle='' show={true} onCloseModal={() => {}}>
          <div className='bottom-6 group relative h-96 overflow-y-scroll  w-full justify-center rounded-md border border-transparent ring-1 ring-slate-300 py-2 px-4 text-sm '>
            <div className='mx-auto max-w-2xl text-center relative top-14'>
              <h2 className='text-sm font-semibold leading-6 text-amber-500'>blooways</h2>
              <p className=' text-2xl font-bold tracking-tight  sm:text-2xl '>서비스 이용 약관</p>
              <p className='mt-1 text-sm leading-6 '>
                공정거래위원회 표준약관 제10023호 <br />
                (2015. 6. 26. 개정)
              </p>
            </div>

            <TermsContent />
          </div>
          <div className='w-full h-8'>
            <button
              onClick={onToggleTerms}
              type='button'
              className='group mt-1.5 relative flex w-1/5 mx-auto justify-center rounded-md border border-transparent bg-amber-500 py-2 px-4 text-sm font-medium text-white hover:bg-amber-600'
            >
              확인
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;

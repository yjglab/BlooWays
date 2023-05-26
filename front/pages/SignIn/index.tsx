import ApiFetcher from '@functions/ApiFetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import { SubmitHandler, useForm } from 'react-hook-form';
import { logoUrl } from '@functions/global';

const SignIn = () => {
  const { data: userData, error: apiError, mutate } = useSWR('/api/users', ApiFetcher);
  const [signInError, setSignInError] = useState(false);

  interface SignInValues {
    email: string;
    password: string;
  }
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInValues>();

  const onSignIn: SubmitHandler<SignInValues> = useCallback(
    (formData) => {
      const { email, password } = formData;
      setSignInError(false);
      axios
        .post(
          '/api/users/signin',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate();
        })
        .catch((error) => {
          console.dir(error);
          setSignInError(error.response?.status === 401);
        });
    },
    [mutate],
  );

  console.log('apiError, userData', apiError, userData);
  if (!apiError && userData) {
    // signIn ok
    return <Redirect to={`/blooway/${userData.username}/area/전체`} />;
  }

  return (
    <div className='h-screen text-slate-700'>
      <div className='flex h-full  items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-8'>
          <div>
            <div className='mx-auto h-24 w-24  relative'>
              <img className='aspect-square cursor-pointer' src={logoUrl} alt='logo-image' />
            </div>
            <h2 className='mt-5 text-center text-2xl font-bold tracking-tight '>
              보유한 계정으로 로그인하세요
            </h2>
            <p className='mt-2 text-center text-sm '>
              BlooWays 멤버가 아니신가요?{' '}
              <Link key={''} to='/signup'>
                <span className='underline cursor-pointer font-medium text-amber-500 hover:text-amber-600'>
                  가입하기
                </span>
              </Link>
            </p>
          </div>

          <div className='w-full flex relative top-3 justify-between h-0.5 items-center'>
            <div className='w-full  bg-slate-200 h-[1.5px]' />
            <div className='text-slate-400 text-xs w-full text-center'>일반 계정 로그인</div>
            <div className='w-full  bg-slate-200 h-[1.5px]' />
          </div>

          <form className='mt-8 space-y-3' onSubmit={handleSubmit(onSignIn)}>
            <input type='hidden' name='remember' defaultValue='true' />
            <div className='-space-y-px rounded-md '>
              <div>
                <label htmlFor='email' className='sr-only'>
                  Email address
                </label>
                <input
                  id='email'
                  type='text'
                  placeholder='이메일 주소'
                  className='relative block w-full appearance-none rounded-none rounded-t-md border border-slate-300 px-3 py-2  placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
                  {...register('email', {
                    required: '이메일은 필수 입력입니다',
                    pattern: {
                      value:
                        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                      message: '이메일 형식에 맞지 않습니다',
                    },
                  })}
                />
              </div>
              <div>
                <label htmlFor='password' className='sr-only'>
                  Password
                </label>
                <input
                  id='password'
                  type='password'
                  placeholder='비밀번호'
                  className='relative block w-full appearance-none rounded-none rounded-b-md border border-slate-300 px-3 py-2 placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
                  {...register('password', {
                    required: '비밀번호를 입력해주세요',
                  })}
                />
              </div>
            </div>

            {/* <div className='flex items-center justify-between'>
                <div className='text-sm'>
                  <Link href='/support'>
                    <span className='cursor-pointer font-medium text-amber-500 hover:text-amber-600'>
                      비밀번호를 잊으셨나요?
                    </span>
                  </Link>
                </div>
              </div> */}

            <div>
              <div>
                <div className='h-6 flex justify-center text-orange-400 text-xs ' role='alert'>
                  {errors.email
                    ? errors.email.message
                    : errors.password
                    ? errors.password.message
                    : signInError}
                </div>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='group relative flex w-full justify-center rounded-md border border-transparent bg-amber-500 py-2 px-4 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2'
                >
                  <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                    <LockClosedIcon
                      className='h-5 w-5 text-amber-600 group-hover:text-amber-50'
                      aria-hidden='true'
                    />
                  </span>
                  로그인
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

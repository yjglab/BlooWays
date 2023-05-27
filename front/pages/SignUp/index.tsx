import ApiFetcher from '@functions/ApiFetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';
import { UserPlusIcon } from '@heroicons/react/20/solid';
import { SubmitHandler, useForm } from 'react-hook-form';
import TermsContent from '@components/TermsContent';
import { logoUrl, toastConfig } from '@functions/global';
import { toast } from 'react-toastify';

const SignUp = () => {
  const { data: userData } = useSWR('/api/users', ApiFetcher);
  const [signUpError, setSignUpError] = useState(false);
  const [signUpDone, setSignUpDone] = useState(false);
  const [toggleTerm, setToggleTerm] = useState(false);

  interface SignUpValues {
    email: string;
    username: string;
    password: string;
    passwordCheck: string;
    term: boolean;
  }
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<SignUpValues>();

  const onSignUp: SubmitHandler<SignUpValues> = useCallback(
    (formData) => {
      const { email, username, password, passwordCheck } = formData;
      const slCheck = /[{}[\]/?.,;:|)*~`!^\-+<>@#$%&\\=('"]/g;
      if (username.search(/\s/) !== -1 || slCheck.test(username)) {
        return setError('username', {
          message: '사용자명에 공백 또는 특수문자가 들어갈 수 없습니다.',
        });
      }
      if (password.indexOf(' ') !== -1) {
        return setError('password', {
          message: '비밀번호에 빈칸을 넣을 수 없습니다',
        });
      }
      if (password !== passwordCheck) {
        return setError('passwordCheck', {
          message: '비밀번호 확인이 일치하지 않습니다',
        });
      }
      setSignUpError(false);
      setSignUpDone(false);
      axios
        .post('/api/users', { email, username, password })
        .then(() => {
          setSignUpDone(true);
          toast.success(`멤버에 가입되셨습니다! 로그인 페이지로 이동해주세요.`, toastConfig);
        })
        .catch((error) => {
          console.log(error.response?.data);
          setSignUpError(error.response?.data?.code === 403);
        });
    },
    [setError],
  );
  const onToggleTerms = useCallback(() => {
    setToggleTerm(!toggleTerm);
  }, [toggleTerm]);

  if (userData) {
    return <Redirect to={`/blooway/${userData.username}`} />;
  }

  return (
    <div className='h-full text-slate-700'>
      <div className='flex h-full justify-center items-center  px-4 sm:px-6 lg:px-8 relative'>
        <div className='w-full max-w-md space-y-8 '>
          <div>
            <div className='mx-auto h-24 w-24  relative'>
              <img className='aspect-square cursor-pointer' src={logoUrl} alt='logo-image' />
            </div>
            <h2 className='mt-6 text-center text-2xl font-bold  '>환영합니다</h2>
            <p className='mt-2 text-center text-sm '>
              <span className='font-medium  '>BlooWays에서 전세계 어디든지 Live Talk를 체험하세요.</span>
            </p>
          </div>

          <div className='w-full flex relative top-3 justify-between h-0.5 items-center'>
            <div className='w-full  bg-slate-200 h-[1.5px]' />
            <div className=' text-xs w-full text-center'>일반 계정 회원가입</div>
            <div className='w-full  bg-slate-200 h-[1.5px]' />
          </div>
          <form className='mt-8 space-y-2' onSubmit={handleSubmit(onSignUp)}>
            <input type='hidden' name='remember' defaultValue='true' />
            <div className='-space-y-px rounded-md '>
              <div>
                <label htmlFor='email' className='sr-only' />
                <input
                  id='email'
                  type='text'
                  placeholder='이메일 주소'
                  className='relative block w-full appearance-none rounded-none rounded-t-md border border-slate-300 px-3 py-2  placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
                  {...register('email', {
                    required: '이메일은 필수 입력입니다',
                    maxLength: 100,
                    pattern: {
                      value:
                        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                      message: '이메일 형식에 맞지 않습니다',
                    },
                  })}
                />
              </div>
              <div>
                <label htmlFor='username' className='sr-only' />
                <input
                  id='username'
                  type='text'
                  className='relative block w-full appearance-none rounded-none  border border-slate-300 px-3 py-2  placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
                  placeholder='사용자명 (4~10자)'
                  {...register('username', {
                    required: '사용자명은 필수 입력입니다',
                    minLength: {
                      value: 4,
                      message: '4자리 이상의 사용자명을 입력해주세요',
                    },
                    maxLength: {
                      value: 10,
                      message: '10자리 이하의 사용자명을 입력해주세요',
                    },
                  })}
                />
              </div>
              <div>
                <label htmlFor='password' className='sr-only' />
                <input
                  id='password'
                  type='password'
                  placeholder='비밀번호 (영문/숫자/특수기호 조합 8자 이상)'
                  className='relative block w-full appearance-none rounded-none  border border-slate-300 px-3 py-2  placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
                  {...register('password', {
                    required: '비밀번호를 입력해주세요',
                    // pattern: {
                    //   value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    //   message: '비밀번호는 영문, 숫자, 특수기호를 조합한 8자 이상이어야 합니다.',
                    // },
                  })}
                />
              </div>
              <div className='relative flex items-center'>
                <label htmlFor='passwordCheck' className='sr-only' />
                <input
                  id='passwordCheck'
                  type='password'
                  placeholder='비밀번호 확인'
                  className='relative block w-full rounded-b-md appearance-none rounded-none  border border-slate-300 px-3 py-2  placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
                  {...register('passwordCheck', {
                    required: '',
                  })}
                />
              </div>
            </div>

            <div className='flex items-center justify-between '>
              <div className='flex items-center'>
                <input
                  id='term'
                  type='checkbox'
                  className='h-4 w-4 rounded-md border-slate-300 text-amber-500 focus:ring-amber-500'
                  {...register('term', {
                    required: '서비스 약관에 동의해주세요',
                  })}
                />
                <label htmlFor='term' className='ml-2 block text-sm '>
                  <button
                    type='button'
                    onClick={onToggleTerms}
                    className='cursor-pointer underline  hover:text-amber-500'
                  >
                    BlooWays 서비스 이용 약관
                  </button>
                  에 동의합니다.
                </label>
              </div>
              <Link to='/signin'>
                <span className='underline mb-4 cursor-pointer text-sm text-amber-500 hover:text-amber-600'>
                  이미 회원입니다
                </span>
              </Link>
            </div>

            {toggleTerm && (
              <div className='group relative h-96 overflow-y-scroll  w-full justify-center rounded-md border border-transparent ring-1 ring-slate-300 py-2 px-4 text-sm '>
                <div className='mx-auto max-w-2xl text-center relative top-14'>
                  <h2 className='text-sm font-semibold leading-6 text-amber-500'>BlooWays</h2>
                  <p className=' text-2xl font-bold tracking-tight  sm:text-2xl '>서비스 이용 약관</p>
                  <p className='mt-1 text-sm leading-8 '>
                    공정거래위원회 표준약관 제10023호 (2015. 6. 26. 개정)
                  </p>
                </div>

                <TermsContent />
              </div>
            )}

            <div>
              <div className='h-6 flex justify-center text-orange-400 text-xs ' role='alert'>
                {errors.email
                  ? errors.email.message
                  : errors.username
                  ? errors.username.message
                  : errors.password
                  ? errors.password.message
                  : errors.passwordCheck
                  ? errors.passwordCheck.message
                  : errors.term
                  ? errors.term.message
                  : signUpError
                  ? '이미 존재하는 이메일입니다'
                  : signUpDone
                  ? '회원가입 성공.'
                  : null}
              </div>

              <button
                type='submit'
                disabled={isSubmitting}
                className='group mt-1.5 relative flex w-full justify-center rounded-md border border-transparent bg-amber-500 py-2 px-4 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2'
              >
                <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                  <UserPlusIcon
                    className='h-5 w-5 text-amber-600 group-hover:text-amber-50'
                    aria-hidden='true'
                  />
                </span>
                {/* {signUpLoading ? (
                  <ArrowPathIcon className='w-5 left-0 right-0 mx-auto animate-spin' />
                ) : (
                  '회원가입'
                )} */}
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

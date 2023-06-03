import ApiFetcher from '@functions/ApiFetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';
import { ArrowPathIcon, UserPlusIcon } from '@heroicons/react/20/solid';
import { SubmitHandler, useForm } from 'react-hook-form';
import TermsContent from '@components/TermsContent';
import { backUrl, logoUrl } from '@functions/global';
import Modal from '@components/Modal';

const SignUp = () => {
  const { data: userData, error } = useSWR('/api/users', ApiFetcher);
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
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<SignUpValues>();

  const onSignGoogle = useCallback(() => {
    window.location.href = `${backUrl}/api/auth/google`;
  }, []);
  const onSignKakao = useCallback(() => {
    window.location.href = `${backUrl}/api/auth/kakao`;
  }, []);

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
          setValue('email', '');
          setValue('username', '');
          setValue('password', '');
          setValue('passwordCheck', '');
        })
        .catch((error) => {
          setError('email', { message: error.response?.data });
        });
    },
    [setError, setValue],
  );
  const onToggleTerms = useCallback(() => {
    setToggleTerm(!toggleTerm);
  }, [toggleTerm]);

  if (userData) {
    return <Redirect to={`/blooway/${userData.username}`} />;
  }

  return (
    <div className='h-full text-slate-800'>
      <div className='flex h-full justify-center items-center  px-4 sm:px-6 lg:px-8 relative'>
        <div className='w-full max-w-md space-y-8 '>
          <div>
            <div className='mx-auto h-24 w-24  relative'>
              <img className='aspect-square cursor-pointer' src={logoUrl} alt='logo-image' />
            </div>
            <h2 className='mt-6 text-center text-2xl font-bold  '>환영합니다</h2>
            <div className='mt-2 text-center text-sm '>
              <div className='text-center mx-auto w-[80%] md:w-full font-medium  '>
                BlooWays에서 전세계 어디서든 생생한 라이브 토크를 경험하세요.
              </div>
            </div>
          </div>

          <div className='w-full flex relative top-3 justify-between h-0.5 items-center'>
            <div className='w-full  bg-slate-200 h-[1.5px]' />
            <div className='text-slate-400 text-xs w-full text-center'>소셜 계정 가입</div>
            <div className='w-full  bg-slate-200 h-[1.5px]' />
          </div>
          <div>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={onSignGoogle}
                className='group  relative flex w-full justify-center rounded-md border border-transparent ring-1 ring-slate-300  hover:bg-slate-100 py-2 px-4 text-sm font-medium'
              >
                <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                  <img
                    alt=''
                    className='w-5 grayscale'
                    src='https://cdn.cdnlogo.com/logos/g/35/google-icon.svg'
                  />
                </span>
                Google
              </button>
              <button
                type='button'
                onClick={onSignKakao}
                className='group  relative flex w-full justify-center rounded-md border border-transparent ring-1 ring-slate-300  hover:bg-slate-100 py-2 px-4 text-sm font-medium'
              >
                <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                  <img
                    alt=''
                    className='w-8 grayscale'
                    src='https://developers.kakao.com/static/images/pc/product/icon/kakaoTalk.png'
                  />
                </span>
                Kakao
              </button>
            </div>
          </div>

          <div className='w-full text-slate-400 flex relative top-3 justify-between h-0.5 items-center'>
            <div className='w-full  bg-slate-200 h-[1.5px]' />
            <div className=' text-xs w-full text-center'>일반 계정 가입</div>
            <div className='w-full  bg-slate-200 h-[1.5px]' />
          </div>
          <form className='mt-8 space-y-2' onSubmit={handleSubmit(onSignUp)}>
            <input type='hidden' name='remember' defaultValue='true' />
            <div className='-space-y-px rounded-md '>
              <div>
                <input
                  id='email'
                  type='text'
                  placeholder='이메일 주소'
                  className='relative block w-full appearance-none rounded-none rounded-t-md border border-slate-300 px-3 py-2  placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
                  {...register('email', {
                    required: '이메일은 필수 입력입니다',
                    maxLength: 30,
                    pattern: {
                      value:
                        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                      message: '이메일 형식에 맞지 않습니다',
                    },
                  })}
                />
              </div>
              <div>
                <input
                  id='username'
                  type='text'
                  className='relative block w-full appearance-none rounded-none  border border-slate-300 px-3 py-2  placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
                  placeholder='사용자명 (4-16자)'
                  {...register('username', {
                    required: '사용자명은 필수 입력입니다',
                    minLength: {
                      value: 4,
                      message: '4자리 이상의 사용자명을 입력해주세요',
                    },
                    maxLength: {
                      value: 16,
                      message: '16자리 이하의 사용자명을 입력해주세요',
                    },
                  })}
                />
              </div>
              <div>
                <input
                  id='password'
                  type='password'
                  placeholder='비밀번호 (영문/숫자/특수기호 조합 8-14자)'
                  className='relative block w-full appearance-none rounded-none  border border-slate-300 px-3 py-2  placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm'
                  {...register('password', {
                    required: '비밀번호를 입력해주세요',
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                      message: '영문, 숫자, 특수기호를 조합한 8-14자 이내로 입력해주세요.',
                    },
                    minLength: {
                      value: 8,
                      message: '영문, 숫자, 특수기호를 조합한 8-14자 이내로 입력해주세요.',
                    },
                    maxLength: {
                      value: 14,
                      message: '영문, 숫자, 특수기호를 조합한 8-14자 이내로 입력해주세요.',
                    },
                  })}
                />
              </div>
              <div className='relative flex items-center'>
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
              <Modal modalType={0} modalTitle='' show={true} onCloseModal={() => {}}>
                <div className='bottom-6 group relative h-96 overflow-y-scroll  w-full justify-center rounded-md border border-transparent ring-1 ring-slate-300 py-2 px-4 text-sm '>
                  <div className='mx-auto max-w-2xl text-center relative top-14'>
                    <h2 className='text-sm font-semibold leading-6 text-amber-500'>BlooWays</h2>
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

            <div>
              <div
                className={`${
                  signUpDone ? 'text-emerald-500 font-medium' : 'text-orange-400'
                } h-6 flex justify-center  text-xs`}
                role='alert'
              >
                {errors.email ? (
                  errors.email.message
                ) : errors.username ? (
                  errors.username.message
                ) : errors.password ? (
                  errors.password.message
                ) : errors.passwordCheck ? (
                  errors.passwordCheck.message
                ) : errors.term ? (
                  errors.term.message
                ) : signUpError ? (
                  '이미 존재하는 이메일입니다'
                ) : signUpDone ? (
                  <Link to='/signin'>
                    멤버로 가입되었습니다. 로그인 페이지로 이동<span aria-hidden='true'>&rarr;</span>
                  </Link>
                ) : null}
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
                {!error && !userData && isSubmitting && <ArrowPathIcon className='w-5 mr-1 animate-spin' />}{' '}
                가입하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

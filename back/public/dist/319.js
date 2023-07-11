"use strict";(self.webpackChunkblooways_front=self.webpackChunkblooways_front||[]).push([[319],{56319:function(e,t,a){a.r(t);var r=a(53380),l=a(52861),n=a(67294),s=a(16550),o=a(73727),c=a(8100),m=a(7219),i=a(6558),u=a(87536),d=a(57713),p=a(11749),f=a(89540);function b(){return b=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},b.apply(this,arguments)}function x(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var a=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=a){var r,l,n,s,o=[],c=!0,m=!1;try{if(n=(a=a.call(e)).next,0===t){if(Object(a)!==a)return;c=!1}else for(;!(c=(r=n.call(a)).done)&&(o.push(r.value),o.length!==t);c=!0);}catch(e){m=!0,l=e}finally{try{if(!c&&null!=a.return&&(s=a.return(),Object(s)!==s))return}finally{if(m)throw l}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return g(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?g(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function g(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,r=new Array(t);a<t;a++)r[a]=e[a];return r}t.default=function(){var e=(0,c.ZP)("/api/users",r.Z).data,t=x((0,n.useState)(!1),2),a=t[0],g=t[1],v=x((0,n.useState)(!1),2),h=v[0],w=v[1],E=x((0,n.useState)(!1),2),y=E[0],N=E[1],k=x((0,n.useState)(!1),2),C=k[0],j=k[1],A=(0,u.cI)(),z=A.register,Z=A.handleSubmit,S=A.setError,O=A.setValue,q=A.formState,I=q.isSubmitting,M=q.errors,T=(0,n.useCallback)((function(){window.location.href="".concat(p.TA,"/api/auth/google")}),[]),B=(0,n.useCallback)((function(){window.location.href="".concat(p.TA,"/api/auth/kakao")}),[]),L=(0,n.useCallback)((function(e){var t=e.email,a=e.username,r=e.password,n=e.passwordCheck;return-1!==a.search(/\s/)?S("username",{message:"사용자명에 공백이 들어갈 수 없습니다."}):-1!==r.indexOf(" ")?S("password",{message:"비밀번호에 빈칸을 넣을 수 없습니다"}):r!==n?S("passwordCheck",{message:"비밀번호 확인이 일치하지 않습니다"}):(N(!0),g(!1),w(!1),void l.Z.post("/api/users",{email:t,username:a,password:r}).then((function(){w(!0),N(!1),O("email",""),O("username",""),O("password",""),O("passwordCheck","")})).catch((function(e){var t;N(!1),S("email",{message:null===(t=e.response)||void 0===t?void 0:t.data})})))}),[S,O]),_=(0,n.useCallback)((function(){j(!C)}),[C]);return e?n.createElement(s.l_,{to:"/blooway/".concat(e.username)}):n.createElement("div",{className:"h-full text-slate-800"},n.createElement("div",{className:"flex h-full justify-center items-center  px-4 sm:px-6 lg:px-8 relative"},n.createElement("div",{className:"w-full max-w-md space-y-8 "},n.createElement("div",null,n.createElement("div",{className:"mx-auto h-24 w-24  relative"},n.createElement("img",{className:"aspect-square cursor-pointer",src:p.pt,alt:"logo-image"})),n.createElement("h2",{className:"mt-6 text-center text-2xl font-bold  "},"환영합니다"),n.createElement("div",{className:"mt-2 text-center text-sm "},n.createElement("div",{className:"text-center mx-auto w-[80%] md:w-full font-medium  "},"BlooWays에서 전세계 어디서든 끊김없는 라이브 토크를 시작하세요."))),n.createElement("div",{className:"w-full flex relative top-3 justify-between h-0.5 items-center"},n.createElement("div",{className:"w-full  bg-slate-200 h-[1.5px]"}),n.createElement("div",{className:"text-slate-400 text-xs w-full text-center"},"소셜 계정 가입"),n.createElement("div",{className:"w-full  bg-slate-200 h-[1.5px]"})),n.createElement("div",null,n.createElement("div",{className:"flex gap-2"},n.createElement("button",{type:"button",onClick:T,className:"group  relative flex w-full justify-center rounded-md border border-transparent ring-1 ring-slate-300  hover:bg-slate-100 py-2 px-4 text-sm font-medium"},n.createElement("span",{className:"absolute inset-y-0 left-0 flex items-center pl-3"},n.createElement("img",{alt:"",className:"w-5 grayscale",src:"https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"})),"Google"),n.createElement("button",{type:"button",onClick:B,className:"group  relative flex w-full justify-center rounded-md border border-transparent ring-1 ring-slate-300  hover:bg-slate-100 py-2 px-4 text-sm font-medium"},n.createElement("span",{className:"absolute inset-y-0 left-0 flex items-center pl-3"},n.createElement("img",{alt:"",className:"w-8 grayscale",src:"https://developers.kakao.com/static/images/pc/product/icon/kakaoTalk.png"})),"Kakao"))),n.createElement("div",{className:"w-full text-slate-400 flex relative top-3 justify-between h-0.5 items-center"},n.createElement("div",{className:"w-full  bg-slate-200 h-[1.5px]"}),n.createElement("div",{className:" text-xs w-full text-center"},"일반 계정 가입"),n.createElement("div",{className:"w-full  bg-slate-200 h-[1.5px]"})),n.createElement("form",{className:"mt-8 space-y-2",onSubmit:Z(L)},n.createElement("input",{type:"hidden",name:"remember",defaultValue:"true"}),n.createElement("div",{className:"-space-y-px rounded-md "},n.createElement("div",null,n.createElement("input",b({id:"email",type:"text",placeholder:"이메일 주소",className:"relative block w-full appearance-none rounded-none rounded-t-md border border-slate-300 px-3 py-2  placeholder-slate-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"},z("email",{required:"이메일은 필수 입력입니다",maxLength:30,pattern:{value:/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,message:"이메일 형식에 맞지 않습니다"}})))),n.createElement("div",null,n.createElement("input",b({id:"username",type:"text",className:"relative block w-full appearance-none rounded-none  border border-slate-300 px-3 py-2  placeholder-slate-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm",placeholder:"사용자명 (4-16자)"},z("username",{required:"사용자명은 필수 입력입니다",minLength:{value:4,message:"4자리 이상의 사용자명을 입력해주세요"},maxLength:{value:16,message:"16자리 이하의 사용자명을 입력해주세요"}})))),n.createElement("div",null,n.createElement("input",b({id:"password",type:"password",placeholder:"비밀번호 (8-14자)",className:"relative block w-full appearance-none rounded-none  border border-slate-300 px-3 py-2  placeholder-slate-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"},z("password",{required:"비밀번호를 입력해주세요",minLength:{value:8,message:"8-14자 이내로 입력해주세요."},maxLength:{value:14,message:"8-14자 이내로 입력해주세요."}})))),n.createElement("div",{className:"relative flex items-center"},n.createElement("input",b({id:"passwordCheck",type:"password",placeholder:"비밀번호 확인",className:"relative block w-full rounded-b-md appearance-none rounded-none  border border-slate-300 px-3 py-2  placeholder-slate-400 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"},z("passwordCheck",{required:""}))))),n.createElement("div",{className:"flex items-center justify-between "},n.createElement("div",{className:"flex items-center"},n.createElement("input",b({id:"term",type:"checkbox",className:"h-4 w-4 rounded-md border-slate-300 text-amber-500 focus:ring-amber-500"},z("term",{required:"서비스 약관에 동의해주세요"}))),n.createElement("label",{htmlFor:"term",className:"ml-2 block text-sm "},n.createElement("button",{type:"button",onClick:_,className:"cursor-pointer underline  hover:text-amber-500"},"BlooWays 서비스 이용 약관"),"에 동의합니다.")),n.createElement(o.rU,{to:"/signin"},n.createElement("span",{className:"underline mb-4 cursor-pointer text-sm text-amber-500 hover:text-amber-600"},"이미 회원입니다"))),C&&n.createElement(f.Z,{modalType:0,modalTitle:"",show:!0,onCloseModal:function(){}},n.createElement("div",{className:"bottom-6 group relative h-96 overflow-y-scroll  w-full justify-center rounded-md border border-transparent ring-1 ring-slate-300 py-2 px-4 text-sm "},n.createElement("div",{className:"mx-auto max-w-2xl text-center relative top-14"},n.createElement("h2",{className:"text-sm font-semibold leading-6 text-amber-500"},"BlooWays"),n.createElement("p",{className:" text-2xl font-bold tracking-tight  sm:text-2xl "},"서비스 이용 약관"),n.createElement("p",{className:"mt-1 text-sm leading-6 "},"공정거래위원회 표준약관 제10023호 ",n.createElement("br",null),"(2015. 6. 26. 개정)")),n.createElement(d.Z,null)),n.createElement("div",{className:"w-full h-8"},n.createElement("button",{onClick:_,type:"button",className:"group mt-1.5 relative flex w-1/5 mx-auto justify-center rounded-md border border-transparent bg-amber-500 py-2 px-4 text-sm font-medium text-white hover:bg-amber-600"},"확인"))),n.createElement("div",null,n.createElement("div",{className:"".concat(h?"text-emerald-500 font-medium":"text-orange-400"," h-6 flex justify-center  text-xs"),role:"alert"},M.email?M.email.message:M.username?M.username.message:M.password?M.password.message:M.passwordCheck?M.passwordCheck.message:M.term?M.term.message:a?"이미 존재하는 이메일입니다":h?n.createElement(o.rU,{to:"/signin"},"멤버로 가입되었습니다. 로그인 페이지로 이동",n.createElement("span",{"aria-hidden":"true"},"→")):null),n.createElement("button",{type:"submit",disabled:I,className:"group mt-1.5 relative flex w-full justify-center rounded-md border border-transparent bg-amber-500 py-2 px-4 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"},n.createElement("span",{className:"absolute inset-y-0 left-0 flex items-center pl-3"},n.createElement(m.Z,{className:"h-5 w-5 text-amber-600 group-hover:text-amber-50","aria-hidden":"true"})),y?n.createElement(i.Z,{className:"w-5 mr-1 animate-spin"}):"가입하기"))))))}},6558:function(e,t,a){var r=a(67294);const l=r.forwardRef((function({title:e,titleId:t,...a},l){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:l,"aria-labelledby":t},a),e?r.createElement("title",{id:t},e):null,r.createElement("path",{fillRule:"evenodd",d:"M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z",clipRule:"evenodd"}))}));t.Z=l},7219:function(e,t,a){var r=a(67294);const l=r.forwardRef((function({title:e,titleId:t,...a},l){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:l,"aria-labelledby":t},a),e?r.createElement("title",{id:t},e):null,r.createElement("path",{d:"M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 018 18a9.953 9.953 0 01-5.385-1.572zM16.25 5.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z"}))}));t.Z=l}}]);
"use strict";(self.webpackChunkblooways_front=self.webpackChunkblooways_front||[]).push([[192],{18192:function(e,t,a){a.r(t),a.d(t,{default:function(){return v}});var r=a(53380),l=a(52861),n=a(67294),s=a(16550),o=a(73727),c=a(8100),i=n.forwardRef((function({title:e,titleId:t,...a},r){return n.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:r,"aria-labelledby":t},a),e?n.createElement("title",{id:t},e):null,n.createElement("path",{fillRule:"evenodd",d:"M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z",clipRule:"evenodd"}))})),m=a(6558),u=a(87536),d=a(11749);function f(){return f=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},f.apply(this,arguments)}function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var a=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=a){var r,l,n,s,o=[],c=!0,i=!1;try{if(n=(a=a.call(e)).next,0===t){if(Object(a)!==a)return;c=!1}else for(;!(c=(r=n.call(a)).done)&&(o.push(r.value),o.length!==t);c=!0);}catch(e){i=!0,l=e}finally{try{if(!c&&null!=a.return&&(s=a.return(),Object(s)!==s))return}finally{if(i)throw l}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return b(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?b(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function b(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,r=new Array(t);a<t;a++)r[a]=e[a];return r}var v=function(){var e=(0,c.ZP)("/api/users",r.Z),t=e.data,a=e.error,b=e.mutate,v=p((0,n.useState)(!1),2),g=v[0],h=v[1],x=p((0,n.useState)(!1),2),w=x[0],y=x[1],E=(0,u.cI)(),N=E.register,k=E.handleSubmit,j=E.formState,A=j.isSubmitting,z=j.errors,C=(0,n.useCallback)((function(e){var t=e.email,a=e.password;h(!1),y(!0),l.Z.post("/api/users/signin",{email:t,password:a},{withCredentials:!0}).then((function(){b(),y(!1)})).catch((function(e){var t;console.dir(e),y(!1),h(401===(null===(t=e.response)||void 0===t?void 0:t.status))}))}),[b]),S=(0,n.useCallback)((function(){window.location.href="".concat(d.TA,"/api/auth/google")}),[]),O=(0,n.useCallback)((function(){window.location.href="".concat(d.TA,"/api/auth/kakao")}),[]);return!a&&t?n.createElement(s.l_,{to:"/blooway/".concat(t.username,"/area/전체")}):n.createElement("div",{className:"h-screen text-slate-800"},n.createElement("div",{className:"flex h-full  items-center justify-center py-12 px-4 sm:px-6 lg:px-8"},n.createElement("div",{className:"w-full max-w-md space-y-8"},n.createElement("div",null,n.createElement("div",{className:"mx-auto h-24 w-24  relative"},n.createElement("img",{className:"aspect-square cursor-pointer",src:d.pt,alt:"logo-image"})),n.createElement("h2",{className:"mt-5 text-center text-2xl font-bold tracking-tight "},"보유한 계정으로 로그인하세요"),n.createElement("p",{className:"mt-2 text-center text-sm "},"BlooWays 멤버가 아니신가요?"," ",n.createElement(o.rU,{key:"",to:"/signup"},n.createElement("span",{className:"underline cursor-pointer font-medium text-amber-500 hover:text-amber-600"},"가입하기")))),n.createElement("div",{className:"w-full flex relative top-3 justify-between h-0.5 items-center"},n.createElement("div",{className:"w-full  bg-slate-200 h-[1.5px]"}),n.createElement("div",{className:"text-slate-400 text-xs w-full text-center"},"소셜 계정 로그인"),n.createElement("div",{className:"w-full  bg-slate-200 h-[1.5px]"})),n.createElement("div",null,n.createElement("div",{className:"flex gap-2"},n.createElement("button",{type:"button",onClick:S,className:"group  relative flex w-full justify-center rounded-md border border-transparent ring-1 ring-slate-300  hover:bg-slate-100 py-2 px-4 text-sm font-medium"},n.createElement("span",{className:"absolute inset-y-0 left-0 flex items-center pl-3"},n.createElement("img",{className:"w-5 grayscale",src:"https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"})),"Google"),n.createElement("button",{type:"button",onClick:O,className:"group  relative flex w-full justify-center rounded-md border border-transparent ring-1 ring-slate-300  hover:bg-slate-100 py-2 px-4 text-sm font-medium"},n.createElement("span",{className:"absolute inset-y-0 left-0 flex items-center pl-3"},n.createElement("img",{className:"w-8 grayscale",src:"https://developers.kakao.com/static/images/pc/product/icon/kakaoTalk.png"})),"Kakao"))),n.createElement("div",{className:"w-full flex relative top-3 justify-between h-0.5 items-center"},n.createElement("div",{className:"w-full  bg-slate-200 h-[1.5px]"}),n.createElement("div",{className:"text-slate-400 text-xs w-full text-center"},"일반 계정 로그인"),n.createElement("div",{className:"w-full  bg-slate-200 h-[1.5px]"})),n.createElement("form",{className:"mt-8 space-y-3",onSubmit:k(C)},n.createElement("input",{type:"hidden",name:"remember",defaultValue:"true"}),n.createElement("div",{className:"-space-y-px rounded-md "},n.createElement("div",null,n.createElement("input",f({id:"email",type:"text",placeholder:"이메일 주소",className:"relative block w-full appearance-none rounded-none rounded-t-md border border-slate-300 px-3 py-2  placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"},N("email",{required:"이메일은 필수 입력입니다",pattern:{value:/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,message:"이메일 형식에 맞지 않습니다"}})))),n.createElement("div",null,n.createElement("input",f({id:"password",type:"password",placeholder:"비밀번호",className:"relative block w-full appearance-none rounded-none rounded-b-md border border-slate-300 px-3 py-2 placeholder-slate-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"},N("password",{required:"비밀번호를 입력해주세요"}))))),n.createElement("div",null,n.createElement("div",null,n.createElement("div",{className:"h-6 flex justify-center text-orange-400 text-xs ",role:"alert"},z.email?z.email.message:z.password?z.password.message:g),n.createElement("button",{type:"submit",disabled:A,className:"group relative flex w-full justify-center rounded-md border border-transparent bg-amber-500 py-2 px-4 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"},n.createElement("span",{className:"absolute inset-y-0 left-0 flex items-center pl-3"},n.createElement(i,{className:"h-5 w-5 text-amber-600 group-hover:text-amber-50","aria-hidden":"true"})),w?n.createElement(m.Z,{className:"w-5 mr-1 animate-spin"}):"로그인")))))))}},6558:function(e,t,a){var r=a(67294);const l=r.forwardRef((function({title:e,titleId:t,...a},l){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:l,"aria-labelledby":t},a),e?r.createElement("title",{id:t},e):null,r.createElement("path",{fillRule:"evenodd",d:"M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z",clipRule:"evenodd"}))}));t.Z=l}}]);
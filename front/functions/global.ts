import { ToastPosition } from 'react-toastify';

export const backUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:4094' : 'https://blooways.com';
export const logoUrl = '/images/blooways_logo.png';
interface ToastConfig {
  position: ToastPosition | undefined;
  autoClose: number;
  hideProgressBar: boolean;
  closeOnClick: boolean;
  rtl: boolean;
  pauseOnFocusLoss: boolean;
  draggable: boolean;
  pauseOnHover: boolean;
}
export const toastConfig: ToastConfig = {
  position: 'bottom-center',
  autoClose: 1500,
  hideProgressBar: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
};

import { ToastPosition } from 'react-toastify';
const isProdiction = process.env.NODE_ENV === 'production';
export const backUrl = isProdiction ? 'http://blooways.online' : 'http://localhost:4094';
export const logoUrl = '/public/images/blooways_logo.png';
export const yjglabLogoUrl = '/public/images/yjglab_logo_slate500.png';
export const blooboltFullLogoUrl = '/public/images/bloobolt-full-logo.png';

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

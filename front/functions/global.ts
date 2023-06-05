import { ToastPosition } from 'react-toastify';
const isProdiction = process.env.NODE_ENV === 'production';
export const backUrl = isProdiction ? 'https://blooways.online' : 'http://localhost:4094';
export const logoUrl = isProdiction ? '/images/blooways_logo.png' : '/public/images/blooways_logo.png';
export const yjglabLogoUrl = isProdiction
  ? '/images/yjglab_logo_slate500.png'
  : '/public/images/yjglab_logo_slate500.png';
export const blooboltFullLogoUrl = isProdiction
  ? '/images/bloobolt-full-logo.png'
  : '/public/images/bloobolt-full-logo.png';

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

import { ToastPosition } from 'react-toastify';
const isProdiction = process.env.NODE_ENV === 'production';
export const backUrl = isProdiction ? 'https://blooways.online' : 'http://localhost:4094';
export const logoUrl = isProdiction ? '/images/blooways_logo.png' : '/public/images/blooways_logo.png';
export const bloosLogoUrl = isProdiction ? '/images/bloos_logo.png' : '/public/images/bloos_logo.png';
export const bloosLogoBUrl = isProdiction ? '/images/bloos_logo_b.png' : '/public/images/bloos_logo_b.png';

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

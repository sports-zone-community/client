import { ToastOptions, Bounce } from 'react-toastify';

export const configToast = () => 'relative flex p-4 min-h-[64px] rounded-xl justify-between overflow-hidden cursor-pointer bg-white m-2 shadow-lg max-w-sm mx-auto transition-all duration-300 ease-out';   

export const toastConfig: ToastOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "dark",
  icon: false,
  transition: Bounce
};   

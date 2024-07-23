import { Slide } from "react-toastify";
import { ToastTransitionProps } from "react-toastify";
import { ToastPosition } from "react-toastify";

interface toastType {
  position: ToastPosition | undefined;
  autoClose: number;
  hideProgressBar: boolean;
  newestOnTop: false;
  closeOnClick: boolean;
  rtl: false;
  pauseOnFocusLoss: boolean;
  raggable: boolean;
  pauseOnHover: boolean;
  theme: string;
  transition: ({
    children,
    position,
    preventExitTransition,
    done,
    nodeRef,
    isIn,
    playToast,
  }: ToastTransitionProps) => React.JSX.Element;
}

export const toastConfig: toastType = {
  position: "top-right",
  autoClose: 1000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnFocusLoss: true,
  raggable: true,
  pauseOnHover: false,
  newestOnTop: false,
  rtl: false,
  theme: "light",
  transition: Slide,
};

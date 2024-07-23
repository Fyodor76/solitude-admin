import { toast } from "react-toastify";

export const showToast = {
  showSuccessToast: (title: string) => {
    return toast.success(title);
  },
  showErrorToast: (title: string) => {
    return toast.error(title);
  },
};
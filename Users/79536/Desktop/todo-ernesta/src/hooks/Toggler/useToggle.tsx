import { useState } from "react";

interface UseToggleType {
  isShow: boolean;
  toggleAddTodo: () => void;
}

export const useToggler = (): UseToggleType => {
  const [isShow, setisShow] = useState<boolean>(false);

  const toggleAddTodo = () => {
    setisShow((prev) => !prev);
  };

  return { isShow, toggleAddTodo };
};

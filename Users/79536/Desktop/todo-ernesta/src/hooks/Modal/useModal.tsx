import { ReactElement, useState } from "react";

interface State {
  isOpen: boolean;
  template: JSX.Element | null;
}

interface ModalHook {
  modalState: State;
  openModal: (template: ReactElement) => void;
  closeModal: () => void;
}

export const useModal = (): ModalHook => {
  const [modalState, setModalState] = useState<State>({
    isOpen: false,
    template: null,
  });

  const openModal = (template: ReactElement) => {
    setModalState({ isOpen: true, template: template });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, template: null });
  };

  return {
    modalState,
    openModal,
    closeModal,
  };
};

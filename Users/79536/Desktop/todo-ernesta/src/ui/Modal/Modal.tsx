import { FC, ReactElement, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";

interface ModalType {
  closeModal: () => void;
  template?: ReactElement | null;
}

export const Modal: FC<ModalType> = ({ closeModal, template }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal]);

  return (
    <div className="modal">
      <div className="modal-wrapper">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-button" onClick={closeModal}>
            <RxCross2 />
          </button>
          {template}
        </div>
      </div>
    </div>
  );
};

import { TodosApi } from "../../../../../api/Todos";
import { TodoContext, deleteTodo } from "../../../../../context/TodoContext";
import { TodoType } from "../../../../../types/TodoType";
import { Button } from "../../../../../ui/Button/Button";
import { useContext } from "react";
import { showToast } from "../../../../../helpers/showToast";
import { IoCreateOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { Modal } from '../../../../../ui/Modal/Modal';
import { useModal } from "../../../../../hooks/Modal/useModal";
import { ModalTemplate } from "../../ModalTemplate/ModalTemplate";
import { Transition } from "react-transition-group";
import { useRef } from 'react';

interface TodoProps {
  todo: TodoType;
}

export const Todo = ({ todo }: TodoProps) => {
  const { dispatch } = useContext(TodoContext);
  const { closeModal, openModal, modalState } = useModal();
  const nodeRef = useRef(null)

  const handleDeleteTodo = async (id: number | string) => {
    try {
      await TodosApi.deleteTodo(id);
      dispatch(deleteTodo(id));
      showToast.showSuccessToast("Задача успешно удалена!");
    } catch (error) {
      console.error("Ошибка при удалении задачи!");
      showToast.showErrorToast("Ошибка при удалении!");
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-content">
        <p className="todo-title">{todo.title}</p>
        <div>
          <Button
            size="miniature"
            color="bark"
            backgroung="transparent"
            onClick={() =>
              openModal(
                <ModalTemplate
                  todo={todo}
                  closeModal={closeModal}
                ></ModalTemplate>
              )
            }
          >
            <IoCreateOutline />
          </Button>
          <Button
            size="miniature"
            backgroung="transparent"
            color="accent"
            onClick={() => handleDeleteTodo(todo?.id || "")}
          >
            <FaRegTrashAlt />
          </Button>
        </div>
      </div>
      <Transition
          in={modalState.isOpen}
          timeout={300}
          mountOnEnter
          unmountOnExit
          nodeRef={nodeRef}
        >
          {(state) => (
            <div ref={nodeRef} className={`block-modal ${state}`}>
              <Modal closeModal={closeModal} template={modalState.template} />
            </div>
          )}
        </Transition>
    </div>
  );
};

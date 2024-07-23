import { Button } from "../../../../ui/Button/Button.tsx";
import { useToggler } from "../../../../hooks/Toggler/useToggle.tsx";
import { useState } from "react";
import { useContext, useEffect } from "react";
import { TodoType } from "../../../../types/TodoType.ts";
import { TodoContext, addTodo } from "../../../../context/TodoContext.tsx";
import { TodosApi } from "../../../../api/Todos.ts";
import { Transition } from "react-transition-group";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../../../../helpers/showToast.ts";
import { useRef } from "react";
import { Input } from "../../../../ui/Input/Input.tsx";

const initialTodo: TodoType = {
  completed: false,
  title: "",
  checked: false,
  type: "Запланированно",
};

interface AddTodo {
  boardId: string | number;
}

export const AddTodo: React.FC<AddTodo> = ({ boardId }) => {
  const { dispatch } = useContext(TodoContext);
  const { isShow, toggleAddTodo } = useToggler();
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<
    "Запланированно" | "В процессе" | "Выполнено"
  >("Запланированно");
  const nodeRef = useRef(null);

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleInputValue = (value: string) => {
    setInputValue(value);
  };

  const hideModal = (value: string) => {
    setInputValue(value);
    toggleAddTodo();
  };

  useEffect(() => {
    const keyEnter = async (event: KeyboardEvent) => {
      if (event.key === "Enter" && inputValue) {
        const response = await TodosApi.addTodo({
          ...initialTodo,
          title: inputValue,
          boardId: boardId,
          type: selectedValue,
        });
        dispatch(addTodo(response.data));
        setInputValue("");
        showToast.showSuccessToast("Задача успешно добавлена!");
      }
    };

    document.addEventListener("keydown", keyEnter);

    return () => {
      document.removeEventListener("keydown", keyEnter);
    };
  }, [inputValue]);

  const createTodo = async () => {
    if (inputValue) {
      const response = await TodosApi.addTodo({
        ...initialTodo,
        title: inputValue,
        boardId: boardId,
        type: selectedValue,
      });

      dispatch(addTodo(response.data));
      setInputValue("");
      showToast.showSuccessToast("Задача успешно добавлена!");
      toggleAddTodo();
    }
  };

  return (
    <div>
      <div className="btn-container">
        <Button
          size="large"
          color="bark"
          backgroung="transparent"
          onClick={toggleAddTodo}
        >
          <div className="content-add-btn">
            <span>
              <img width="15px" src="src\assets\plus-btn.svg" alt="добавить" />
            </span>
            Создать задачу
          </div>
        </Button>
      </div>

      <Transition
        nodeRef={nodeRef}
        in={isShow}
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <div ref={nodeRef} className={`block-input ${state}`}>
            <div className="select-content">
              <div className="input-todo">
                <Input
                  placeholder={"Название задачи"}
                  value={inputValue}
                  onChange={(e) => handleInputValue(e.target.value)}
                  border="primary"
                  size="large"
                  background="basic"
                  outline="none"
                  padding="small"
                  borderRadius="small"
                />
              </div>

              <div>
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <Select
                    value={selectedValue}
                    className="sel"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="Запланированно">Запланировано</MenuItem>
                    <MenuItem value="В процессе">В процессе</MenuItem>
                    <MenuItem value="Выполнено">Выполнено</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <span className="filter-todo">{selectedValue}</span>

            <div className="btn-container">
              {inputValue && (
                <Button
                  size="medium"
                  backgroung="secondary"
                  color="basic"
                  onClick={() => handleInputValue("")}
                >
                  Очистить
                </Button>
              )}

              <Button
                size="medium"
                backgroung="secondary"
                color="basic"
                onClick={() => hideModal("")}
              >
                Отмена
              </Button>

              <Button
                onClick={createTodo}
                size="large"
                backgroung="primary"
                color="basic"
                disabled={!inputValue}
              >
                Добавить задачу
              </Button>
            </div>
          </div>
        )}
      </Transition>
    </div>
  );
};

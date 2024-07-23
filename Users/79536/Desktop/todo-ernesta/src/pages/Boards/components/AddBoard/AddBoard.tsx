import { useContext, useState } from "react";
import { Button } from "../../../../ui/Button/Button";
import { BoardContext, addBoard } from "../../../../context/BoardContext";
import { BoardType } from "../../../../types/BoardType";
import { BoardsApi } from "../../../../api/Boards";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../../../../helpers/showToast";
import { Input } from '../../../../ui/Input/Input';

const initialBoard = {
  date: new Date().getTime().toString(),
  boardName: "",
};

export const AddBoard = () => {
  const [boardName, setBoardName] = useState<string>("");
  const { dispatch } = useContext(BoardContext);

  const handleAddBoard = async (board: BoardType) => {
    try {
      if (boardName) {
        const response = await BoardsApi.addBoard(board);
        dispatch(addBoard(response.data));
        setBoardName("");
        showToast.showSuccessToast("Доска успешно добавлена!");
      }
    } catch (error) {
      console.error("Ошибка при добавлении доски", error);
      showToast.showErrorToast("Ошибка при добавлении!");
    }
  };

  return (
    <>
      <div className="container-create-board">
        <div className="input-create-board">
          <Input
            placeholder={"Напиши свою доску"}
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            border="primary"
            size="large"
            background="basic"
            outline="none"
            padding="small"
            borderRadius="small"
          />
        </div>
        <Button
          size="large"
          backgroung="secondary"
          color="basic"
          disabled={!boardName}
          onClick={() =>
            handleAddBoard({
              ...initialBoard,
              date: new Date().getTime().toString(),
              boardName: boardName,
            })
          }
        >
          Создать
        </Button>
      </div>
    </>
  );
};

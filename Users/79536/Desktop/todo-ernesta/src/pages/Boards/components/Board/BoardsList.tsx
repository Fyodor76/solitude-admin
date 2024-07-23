import { useContext } from "react";
import { BoardContext, deleteBoard } from "../../../../context/BoardContext";
import { AddTodo } from "../AddTodo/AddTodo";
import { Button } from "../../../../ui/Button/Button";
import { AddBoard } from "../AddBoard/AddBoard";
import { BoardsApi } from "../../../../api/Boards";
import { formatTimeStamp } from "../../../../helpers/formatTimeStamp";
import { TransitionGroup } from "react-transition-group";
import { CSSTransition } from "react-transition-group";
import { showToast } from "../../../../helpers/showToast";
import { TodosOnBoard } from "./TodosOnBoard/TodosOnBoard";
import { useRef } from "react";
import { statusTodoOnBoard } from "../../helpers/statusTodoOnBoard";


export const BoardsList = () => {
  const { state: boardState, dispatch } = useContext(BoardContext);
  const nodeRef = useRef(null);
  

  const handleDeleteBoard = async (id: number | string) => {
    try {
      await BoardsApi.deleteBoard(id);
      dispatch(deleteBoard(id));
    } catch (error) {
      console.error("Ошибка при удалении доски", error);
      showToast.showErrorToast("Ошибка при удалении!");
    }
  };

  return (
    <div className="boards-list">
      <AddBoard />
      <TransitionGroup>
        {boardState.boards?.map((board) => (
          <CSSTransition
            nodeRef={nodeRef}
            key={board.id}
            timeout={300}
            unmountOnExit
          >
            <div ref={nodeRef} key={board.id} className="board">
              <div>{formatTimeStamp(board?.date)}</div>
              <div>
                <h2>{board.boardName}</h2>
              </div>
              <div className="container-blocks">
                {statusTodoOnBoard.map((status) => (
                  <TodosOnBoard
                    key={status}
                    type={status}
                    board={board}
                  ></TodosOnBoard>
                ))}
              </div>
              <div>
                <AddTodo boardId={board?.id || ""} />
              </div>
              <div className="container-btn-del-board">
                <Button
                  size="large"
                  backgroung="transparent"
                  color="accent"
                  onClick={() => handleDeleteBoard(board.id || "")}
                >
                  Удалить доску
                </Button>
              </div>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

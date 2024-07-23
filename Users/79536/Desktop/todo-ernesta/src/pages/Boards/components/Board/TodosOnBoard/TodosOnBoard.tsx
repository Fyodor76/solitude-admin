import { useContext } from "react";
import { TodoContext } from "../../../../../context/TodoContext";
import { TransitionGroup } from "react-transition-group";
import { CSSTransition } from "react-transition-group";
import { filterTodosByType } from "../../../helpers/filterTodosByType";
import { Todo } from "../Todo/Todo";
import { BoardType } from "../../../../../types/BoardType";
import { useRef } from "react";
import { Draggable } from "react-beautiful-dnd";

interface TypeTodoOnBoardProps {
  type: string;
  board: BoardType;
}

export const TodosOnBoard = ({ type, board }: TypeTodoOnBoardProps) => {
  const { state: todoState } = useContext(TodoContext);
  const nodeRef = useRef(null);

  return (
    <div className="block-todos-onBoard">
      <h3>{type} :</h3>
          <div
            className="tasks"
          >
            <TransitionGroup>
              {filterTodosByType(todoState.todos, board?.id || "", type).map(
                (todo, index) => (
                  <CSSTransition
                    key={todo.id}
                    timeout={250}
                    classNames="todo"
                    nodeRef={nodeRef}
                  >
                    <Draggable
                      key={todo.id}
                      draggableId={`${todo.id}`} 
                      index={index}
                    >
                      {(provided) => (
                        <div ref={nodeRef}>
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <Todo todo={todo} />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  </CSSTransition>
                )
              )}
            </TransitionGroup>
          </div>
    </div>
  );
};

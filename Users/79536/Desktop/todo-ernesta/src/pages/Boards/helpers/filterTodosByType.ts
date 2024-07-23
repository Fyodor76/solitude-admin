import { TodoType } from "../../../types/TodoType";

export const filterTodosByType = (
  todos: TodoType[],
  boardId: number | string,
  type: string
) => {
  return todos.filter((todo) => todo.boardId === boardId && todo.type === type);
};

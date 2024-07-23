import axios from "axios";
import { TodoType } from "../types/TodoType";
import { urlBase } from "../const/urls";

export const TodosApi = {
  getTodos: async () => {
    return await axios.get<TodoType[]>(`${urlBase}/todos`);
  },
  addTodo: async (todo: TodoType) => {
    return await axios.post<TodoType>(`${urlBase}/todos`, todo);
  },
  deleteTodo: async (id: number | string) => {
    return await axios.delete(`${urlBase}/todos/${id}`);
  },
  changeTodo: async (todo: TodoType) => {
    return await axios.put(`${urlBase}/todos/${todo.id}`, { ...todo });
  },
};

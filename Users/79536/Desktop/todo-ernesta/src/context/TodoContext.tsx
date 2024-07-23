import React, { createContext, useReducer, useEffect } from "react";
import { TodoType } from "../types/TodoType";
import { TodosApi } from "../api/Todos";

type State = {
  todos: TodoType[];
};

type Action =
  | { type: "SET_TODOS"; payload: TodoType[] }
  | { type: "ADD_TODO"; payload: TodoType }
  | { type: "CHANGE_TODO"; payload: TodoType }
  | { type: "DELETE_TODO"; payload: number | string };

const initialState: State = {
  todos: [],
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_TODOS":
      return { ...state, todos: action.payload };
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case "CHANGE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === action.payload.id) {
            return action.payload;
          }
          return todo;
        }),
      };
    default:
      return state;
  }
};

export const TodoContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getTodos = async () => {
      const response = await TodosApi.getTodos();
      dispatch(setTodos(response.data));
    };
    getTodos();
  }, []);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

export const setTodos = (todos: TodoType[]): Action => ({
  type: "SET_TODOS",
  payload: todos,
});

export const addTodo = (todo: TodoType): Action => ({
  type: "ADD_TODO",
  payload: todo,
});

export const deleteTodo = (id: number | string): Action => ({
  type: "DELETE_TODO",
  payload: id,
});

export const changeTodo = (todo: TodoType): Action => ({
  type: "CHANGE_TODO",
  payload: todo,
});

import React, { createContext, useReducer, useEffect } from "react";
import { BoardType } from "../types/BoardType";
import { BoardsApi } from "../api/Boards";

type State = {
  boards: BoardType[];
};

type Action =
  | { type: "SET_BOARDS"; payload: BoardType[] }
  | { type: "ADD_BOARD"; payload: BoardType }
  | { type: "DELETE_BOARD"; payload: number | string };

const initialState: State = {
  boards: [],
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_BOARDS":
      return { ...state, boards: action.payload };
    case "ADD_BOARD":
      return { ...state, boards: [...state.boards, action.payload] };
    case "DELETE_BOARD":
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.payload),
      };
    default:
      return state;
  }
};

export const BoardContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getBoards = async () => {
      const response = await BoardsApi.getBoards();
      dispatch(setBoards(response.data));
    };
    getBoards();
  }, []);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

export const setBoards = (boards: BoardType[]): Action => ({
  type: "SET_BOARDS",
  payload: boards,
});

export const addBoard = (board: BoardType): Action => ({
  type: "ADD_BOARD",
  payload: board,
});

export const deleteBoard = (id: number | string): Action => ({
  type: "DELETE_BOARD",
  payload: id,
});

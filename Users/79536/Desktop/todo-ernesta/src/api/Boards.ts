import { urlBase } from "../const/urls.ts";
import { BoardType } from "../types/BoardType.ts";
import axios from "axios";

export const BoardsApi = {
  getBoards: async () => {
    return await axios.get<BoardType[]>(`${urlBase}/boards`);
  },

  addBoard: async (board: BoardType) => {
    return await axios.post(`${urlBase}/boards`, board);
  },

  deleteBoard: async (id: number | string) => {
    return await axios.delete<BoardType[]>(`${urlBase}/boards/${id}`);
  },
};

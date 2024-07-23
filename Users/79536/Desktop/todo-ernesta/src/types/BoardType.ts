import { TodoType } from "./TodoType";

export interface BoardType {
  id?: number | string;
  date: string;
  boardName: string;
  todos?: TodoType[];
}

export interface TodoType {
  id?: number | string;
  boardId?: number | string;
  title: string;
  completed: boolean;
  checked?: boolean;
  type?: "Выполнено" | "В процессе" | "Запланированно";
}

import { BoardsList } from "./components/Board/BoardsList";

export const Boards = () => {
  return (
    <div className="boards-container">
      <div className="boards-title">
        <h1>Доски</h1>
      </div>
      <BoardsList />
    </div>
  );
};

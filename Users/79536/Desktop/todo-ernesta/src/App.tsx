import "./App.scss";
import { BoardProvider } from "./context/BoardContext.tsx";
import { TodoProvider } from "./context/TodoContext.tsx";
import { Boards } from "./pages/Boards/Boards.tsx";
import { ToastContainer } from "react-toastify";
import { toastConfig } from "./const/toastConfig.ts";

function App() {
  return (
    <div className="app-container">
        <BoardProvider>
          <TodoProvider>
            <Boards />
          </TodoProvider>
        </BoardProvider>
        <ToastContainer {...toastConfig} />
    </div>
  );
}

export default App;

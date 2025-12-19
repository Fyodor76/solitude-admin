import { RouteObject } from "react-router-dom";
import App from "../App";
import RouterErrorElement from "./RouterErrorElement";
import MainPage from "../components/MainPage";
//import ProtectedRouter from "./ProtectedRouter";

export const Router: RouteObject[] = [
  {
    path: '/',
    element: <App />, //обёртка
    errorElement: <RouterErrorElement />,

    children: [
      {
        index: true, // главная
        element: (
        /*  <ProtectedRouter>*/
            <MainPage />
         /* </ProtectedRouter>*/
        ),
      }
      /*{
        path: "authorisation",
        // element: <Authorisation/>
      },
      {
        path: 'registration',
        // element: <Registration/>
      },*/
    ],
  },
];

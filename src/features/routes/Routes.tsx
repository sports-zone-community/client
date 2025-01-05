import { createBrowserRouter } from "react-router";
import Home from "../../pages/home/Home.tsx";
import Login from "../auth/login/Login.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
]);

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";
import Login from "./components/auth/login/Login";
import Register from "./components/auth/register/Register";
import AuthProvider from "./components/auth/context/AuthProvider";
import ProtectedRoute from "./components/auth/route/ProtectedRoute";
import Home from "./components/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import Inbox from "./pages/inbox/Inbox";
import AddPost from "./pages/addPost/AddPost";
import Profile from "./pages/profile/Profile";
import AddGroup from "./pages/addGroup/AddGroup";
import { configToast } from "./shared/functions/toastConfig";
import Explore from "./pages/explore/Explore";

const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
];

const protectedRoutes = [
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/inbox", element: <Inbox /> },
    { path: "/explore", element: <Explore /> },
    { path: "/add-post", element: <AddPost /> },
    { path: "/profile", element: <Profile /> },
    { path: "/add-group", element: <AddGroup /> },
];

const App = () => {
    return (
        <>
            <ToastContainer
                position="top-center"
                theme="light"
                className="!transform-gpu"
                toastClassName={configToast}
            />
            <BrowserRouter>
                <AuthProvider>
                    <Layout>
                        <Routes>
                            {/* Public Routes */}
                            {publicRoutes.map(({ path, element }) => (
                                <Route
                                    key={path}
                                    path={path}
                                    element={element}
                                />
                            ))}

                            {/* Protected Routes */}
                            {protectedRoutes.map(({ path, element }) => (
                                <Route
                                    key={path}
                                    path={path}
                                    element={
                                        <ProtectedRoute>
                                            {element}
                                        </ProtectedRoute>
                                    }
                                />
                            ))}
                        </Routes>
                    </Layout>
                </AuthProvider>
            </BrowserRouter>
        </>
    );
};

export default App;

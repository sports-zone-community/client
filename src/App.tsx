import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./features/auth/login/Login.tsx";
import Layout from "./components/layout/Layout.tsx";
import Home from "./components/home/Home.tsx";
import Register from "./features/auth/register/Register.tsx";
import AuthProvider from "./features/auth/context/AuthProvider.tsx";
import Dashboard from "./components/dashboard/Dashboard.tsx";
import ProtectedRoute from "./features/auth/route/ProtectedRoute.tsx";
import Inbox from "./pages/inbox/inbox.tsx";
import AddPost from "./pages/addPost/addPost.tsx";
import Explore from "./pages/explore/explore.tsx";
import Profile from "./pages/profile/profile.tsx";
import AddGroup from "./pages/addGroup/addGroup.tsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout.tsx";
import { configToast } from "./shared/functions/toastConfig.ts";

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
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <AuthenticatedLayout>
                                            <Dashboard />
                                        </AuthenticatedLayout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/inbox" element={<ProtectedRoute><AuthenticatedLayout><Inbox /></AuthenticatedLayout></ProtectedRoute>} />
                            <Route path="/explore" element={<ProtectedRoute><AuthenticatedLayout><Explore /></AuthenticatedLayout></ProtectedRoute>} />
                            <Route path="/add-post" element={<ProtectedRoute><AuthenticatedLayout><AddPost /></AuthenticatedLayout></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><AuthenticatedLayout><Profile /></AuthenticatedLayout></ProtectedRoute>} />
                            <Route path="/add-group" element={<ProtectedRoute><AuthenticatedLayout><AddGroup /></AuthenticatedLayout></ProtectedRoute>} />
                        </Routes>
                    </Layout>
                </AuthProvider>
            </BrowserRouter>
        </>
    );
};

export default App;

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

const App = () => {
    return (
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
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
                        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
                        <Route path="/add-post" element={<ProtectedRoute><AddPost /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    </Routes>
                </Layout>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;

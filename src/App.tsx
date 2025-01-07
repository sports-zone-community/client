import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./features/auth/login/Login.tsx";
import Layout from "./components/layout/Layout.tsx";
import Home from "./pages/home/Home.tsx";
import Register from "./features/auth/register/Register.tsx";
import AuthProvider from "./features/auth/context/AuthProvider.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import ProtectedRoute from "./features/auth/route/ProtectedRoute.tsx";

const App = () => {
    return (
        <BrowserRouter>
            <Layout>
                <AuthProvider>
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
                    </Routes>
                </AuthProvider>
            </Layout>
        </BrowserRouter>
    );
};

export default App;

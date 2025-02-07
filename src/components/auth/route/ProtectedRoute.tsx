import { ReactNode } from "react";
import { useAuth } from "../../../shared/hooks/useAuth.ts";
import { Navigate } from "react-router-dom";
import Loading from "../../common/Loading.tsx";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return <Loading />;
    }
    if (!user) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;

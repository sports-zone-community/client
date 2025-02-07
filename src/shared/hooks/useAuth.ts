import { useContext } from "react";
import { AuthContextType } from "../models";
import AuthContext from "../../components/auth/context/AuthContext.tsx";

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

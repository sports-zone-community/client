import { createContext } from "react";
import { AuthContextType } from "../../../shared/models";

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;

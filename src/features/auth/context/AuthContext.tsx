import { createContext } from "react";
import { AuthContextType } from "../../../shared/models/Auth.ts";

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;

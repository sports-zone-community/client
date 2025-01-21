import { useLocation } from "react-router-dom";
import CoolBlur from "./CoolBlur";
import Sidebar from "./Sidebar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const publicRoutes: string[] = ["/", "/login", "/register"];
    const isPublicRoute: boolean = publicRoutes.includes(location.pathname);

    return (
        <div className="bg-blue-950 min-h-screen flex">
            {!isPublicRoute && <Sidebar />}
            <div className="flex-1 relative">
                {isPublicRoute && <CoolBlur />}
                {children}
            </div>
        </div>
    );
};

export default Layout;

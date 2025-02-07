import { useAuth } from "../../shared/hooks/useAuth.ts";
import Sidebar from "./Sidebar.tsx";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { user } = useAuth();

    return (
        <div className="bg-blue-950 min-h-screen flex">
            {user && <Sidebar />}
            <div
                id="scrollableDiv"
                className={`flex-1 relative overflow-auto h-screen`}
            >
                <div className="h-full">{children}</div>
            </div>
        </div>
    );
};

export default Layout;

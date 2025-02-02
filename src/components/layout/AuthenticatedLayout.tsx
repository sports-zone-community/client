import Sidebar from "./Sidebar";

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
    return (
        <div className="flex-1 flex h-screen">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
};

export default AuthenticatedLayout; 
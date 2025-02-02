interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {

    return (
        <div className="bg-blue-950 min-h-screen flex">
            <div className="flex-1 relative">
                {children}
            </div>
        </div>
    );
};

export default Layout;

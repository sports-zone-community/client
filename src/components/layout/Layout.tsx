import CoolBlur from "./CoolBlur.tsx";
import * as React from "react";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="bg-blue-950 min-h-screen flex flex-col">
            <CoolBlur />
            {children}
        </div>
    );
};

export default Layout;

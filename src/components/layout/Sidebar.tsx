import {
    Link,
    NavigateFunction,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../../shared/hooks/useAuth";
import { navItems } from "../../shared/consts/NavItems";
import { NavItem } from "../../shared/models";
import Logo from "../../assets/logo.png";

const Sidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate: NavigateFunction = useNavigate();

    const handleLogout = async (): Promise<void> => {
        await logout();
        navigate("/login");
    };

    const isActive = (path: string): boolean => location.pathname === path;

    return (
        <div className="flex flex-col justify-between w-56 bg-black p-4">
            <div className="space-y-6">
                <div className="flex items-center justify-center space-x-2 mb-1">
                    <span className="text-xl font-bold text-white">
                        SportsZone
                    </span>
                </div>
                <div className="flex items-center justify-center space-x-1 mb-8">
                    <img
                        src={Logo}
                        alt="SportsZone"
                        className="w-18 h-14 rounded-full"
                    />
                </div>
                <nav className="space-y-2">
                    {navItems.map((item: NavItem) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                    isActive(item.path)
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:bg-gray-800"
                                }`}
                            >
                                <Icon className="h-6 w-6" aria-hidden="true" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors mt-auto"
            >
                <ArrowRightOnRectangleIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                />
                <span>Log out</span>
            </button>
        </div>
    );
};

export default Sidebar;

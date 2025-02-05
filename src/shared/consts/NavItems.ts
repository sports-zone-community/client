import { 
    HomeIcon,
    InboxIcon,
    MagnifyingGlassIcon,
    PlusCircleIcon,
    UserIcon,
    UserGroupIcon
} from "@heroicons/react/20/solid";

export const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
    { name: "Inbox", path: "/inbox", icon: InboxIcon },
    { name: "Explore", path: "/explore", icon: MagnifyingGlassIcon },
    { name: "Add Post", path: "/add-post", icon: PlusCircleIcon },
    { name: "Profile", path: "/profile", icon: UserIcon },
    { name: "Add Group", path: "/add-group", icon: UserGroupIcon },
];
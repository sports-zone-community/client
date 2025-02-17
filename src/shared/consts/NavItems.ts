import {
    HomeIcon,
    InboxIcon,
    MagnifyingGlassIcon,
    PlusCircleIcon,
    UserGroupIcon,
    UserIcon,
} from "@heroicons/react/20/solid";

export const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
    { name: "Explore", path: "/explore", icon: MagnifyingGlassIcon },
    { name: "Add Post", path: "/add-post", icon: PlusCircleIcon },
    { name: "Add Group", path: "/add-group", icon: UserGroupIcon },
    { name: "Inbox", path: "/inbox", icon: InboxIcon },
    { name: "Profile", path: "/profile", icon: UserIcon },
];

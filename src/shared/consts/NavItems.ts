import { MdAddCircle, MdExplore, MdGroupAdd, MdInbox } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { NavItem } from "../models/NavItem";

export const navItems: NavItem[] = [
    { name: "Home", path: "/dashboard", icon: AiFillHome },
    { name: "Inbox", path: "/inbox", icon: MdInbox },
    { name: "Explore", path: "/explore", icon: MdExplore },
    { name: "Add Post", path: "/add-post", icon: MdAddCircle },
    { name: "Profile", path: "/profile", icon: CgProfile },
    { name: "Add Group", path: "/add-group", icon: MdGroupAdd },
];
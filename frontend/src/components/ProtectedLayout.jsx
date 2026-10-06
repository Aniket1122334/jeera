import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Navbar from "./Dashboard/Navbar";
import Sidebar from "./Dashboard/Sidebar";

import {
  LayoutDashboard,
  CheckSquare,
  Users,
  UserRound,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

const ProtectedLayout = () => {
  const user = useSelector((state) => state.user.user.data);

  const ownerNavItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/organizations",
      label: "Organizations",
      icon: Users,
    },
    { path: "/admins", label: "Admins", icon: UserRound },
  ];

  const adminNavItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/tasks",
      label: "Tasks",
      icon: CheckSquare,
    },
    {
      path: "/teams",
      label: "Teams",
      icon: Users,
    },
    {
      path: "/employees",
      label: "Employees",
      icon: UserRound,
    },
    {
      path: "/chat",
      label: "Team Chat",
      icon: MessageSquare,
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const employeeNavItems = [
    { path: "/dashboard", label: "My tasks", icon: LayoutDashboard },
    { path: "/chat", label: "Team chat", icon: MessageSquare },
    { path: "/settings", label: "Profile", icon: Settings },
  ];

  const navItems =
    user?.role === "owner"
      ? ownerNavItems
      : user?.role === "admin"
        ? adminNavItems
        : employeeNavItems;

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <Navbar user={user} />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar navItems={navItems} />

        <main className="min-w-0 flex-1 pb-20 lg:pb-0 lg:pl-[72px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;

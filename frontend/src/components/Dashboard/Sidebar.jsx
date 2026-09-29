import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  CheckSquare,
  Users,
  UserRound,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  const navItems = [
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
  ];

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        fixed
        z-50
        border-slate-200
        bg-white

        /* =====================================
           MOBILE + TABLET
        ====================================== */

        bottom-0
        left-0
        flex
        h-16
        w-full
        flex-row
        items-center
        justify-around
        border-t
        shadow-[0_-2px_10px_rgba(0,0,0,0.04)]

        /* =====================================
           DESKTOP
        ====================================== */

        lg:bottom-auto
        lg:left-0
        lg:top-16
        lg:h-[calc(100vh-4rem)]
        lg:flex-col
        lg:items-stretch
        lg:justify-start
        lg:border-r
        lg:border-t-0
        lg:shadow-none

        ${expanded ? "lg:w-[220px]" : "lg:w-[72px]"}

        transition-all
        duration-300
        ease-in-out
      `}
    >
      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          flex
          h-full
          w-full
          items-center
          justify-around

          lg:flex-1
          lg:flex-col
          lg:items-stretch
          lg:justify-start
          lg:px-3
          lg:py-5
        "
      >
        {/* =================================================
            WORKSPACE
        ================================================== */}

        <div
          className={`
            hidden
            px-2

            lg:mb-5
            lg:block

            ${expanded ? "lg:opacity-100" : "lg:opacity-0"}

            transition-opacity
            duration-200
          `}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        <nav
          className="
            flex
            h-full
            w-full
            items-center
            justify-around

            lg:h-auto
            lg:w-full
            lg:flex-col
            lg:items-stretch
            lg:justify-start
            lg:gap-2
          "
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={!expanded ? item.label : undefined}
                className={({ isActive }) => `
                  group
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  /* Desktop expanded */
                  lg:w-full
                  ${
                    expanded
                      ? "lg:justify-start lg:gap-3 lg:px-3"
                      : "lg:justify-center"
                  }

                  ${
                    isActive
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2 : 1.8}
                        className={`
                          transition-colors

                          ${
                            isActive
                              ? "text-slate-950"
                              : "text-slate-400 group-hover:text-slate-700"
                          }
                        `}
                      />
                    </span>

                    {/* Desktop label only */}
                    <span
                      className={`
                        hidden
                        overflow-hidden
                        whitespace-nowrap
                        transition-all
                        duration-200

                        ${
                          expanded
                            ? "lg:block lg:opacity-100"
                            : "lg:hidden lg:opacity-0"
                        }
                      `}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* =================================================
            DESKTOP MANAGE SECTION
        ================================================== */}

        <div
          className={`
            hidden

            lg:mt-5
            lg:mb-2
            lg:block
            lg:border-t
            lg:border-slate-100
            lg:pt-5

            ${expanded ? "lg:opacity-100" : "lg:opacity-0"}

            transition-opacity
            duration-200
          `}
        >
          <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Manage
          </p>
        </div>

        {/* =================================================
            SETTINGS
        ================================================== */}

        <NavLink
          to="/settings"
          title={!expanded ? "Settings" : undefined}
          className={({ isActive }) => `
            hidden

            lg:flex
            lg:h-10
            lg:w-full
            lg:items-center
            lg:justify-center
            lg:rounded-lg
            lg:px-3
            lg:text-sm
            lg:font-medium

            ${expanded ? "lg:justify-start lg:gap-3" : "lg:justify-center"}

            ${
              isActive
                ? "bg-slate-100 text-slate-950"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            }

            transition-all
            duration-200
          `}
        >
          {({ isActive }) => (
            <>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                <Settings
                  size={19}
                  strokeWidth={isActive ? 2 : 1.8}
                  className={`
                    ${isActive ? "text-slate-950" : "text-slate-400"}
                  `}
                />
              </span>

              <span
                className={`
                  hidden
                  overflow-hidden
                  whitespace-nowrap

                  ${
                    expanded
                      ? "lg:block lg:opacity-100"
                      : "lg:hidden lg:opacity-0"
                  }
                `}
              >
                Settings
              </span>
            </>
          )}
        </NavLink>
      </div>

      {/* =====================================================
          DESKTOP BOTTOM SECTION
          Hidden completely on mobile/tablet
      ====================================================== */}

      <div
        className="
          hidden

          lg:block
          lg:border-t
          lg:border-slate-200
          lg:px-3
          lg:py-3
        "
      >
        {/* Profile */}
        <div
          className={`
            mb-2
            flex
            items-center
            justify-center
            rounded-xl
            bg-slate-50
            p-2

            ${expanded ? "lg:justify-start lg:gap-3" : ""}
          `}
        >
          {/* Avatar */}
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-slate-900
              text-sm
              font-semibold
              text-white
            "
          >
            A
          </div>

          {/* Profile details */}
          <div
            className={`
              hidden
              min-w-0
              overflow-hidden
              whitespace-nowrap

              ${expanded ? "lg:block lg:opacity-100" : "lg:hidden lg:opacity-0"}
            `}
          >
            <p className="truncate text-sm font-semibold text-slate-900">
              Aniket
            </p>

            <p className="text-xs text-slate-500">Admin</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            console.log("Logout");
          }}
          title="Logout"
          className={`
            group
            flex
            h-10
            w-full
            items-center
            justify-center
            rounded-lg
            px-3
            text-sm
            font-medium
            text-slate-500
            transition-all
            duration-200

            ${expanded ? "lg:justify-start lg:gap-3" : "lg:justify-center"}

            hover:bg-red-50
            hover:text-red-600
          `}
        >
          <LogOut size={19} strokeWidth={1.8} className="shrink-0" />

          <span
            className={`
              hidden
              overflow-hidden
              whitespace-nowrap

              ${expanded ? "lg:block lg:opacity-100" : "lg:hidden lg:opacity-0"}
            `}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import { useState } from "react";
import { Menu, Search, Bell, LogOut } from "lucide-react";

const Navbar = ({ user }) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [search, setSearch] = useState("");

  console.log(user);

  const handleLogout = () => {
    console.log("Logout");
    // Add logout API here later
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="relative mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ================= LOGO ================= */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black">
              <span className="text-lg font-bold text-white">J</span>
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-950">
              jeera
            </span>
          </div>

          {/* ================= DESKTOP SEARCH ================= */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <div className="relative">
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search..."
                className="
                  h-10
                  w-80
                  rounded-lg
                  bg-slate-100
                  px-4
                  pr-10
                  text-[1.1rem]
                  text-slate-900
                  placeholder:text-slate-400
                  outline-none
                  transition
                  focus:outline-none
                  focus:ring-0
                  lg:w-96
                  xl:w-105
                "
              />

              <Search
                size={17}
                strokeWidth={1.8}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />
            </div>
          </div>

          {/* ================= DESKTOP RIGHT SECTION ================= */}
          <div className="ml-auto hidden items-center gap-3 md:flex">
            {/* Notification */}
            <button
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                text-slate-600
                transition
                hover:bg-slate-100
                hover:text-slate-950
              "
            >
              <Bell size={19} />

              <span
                className="
                  absolute
                  right-2.5
                  top-2.5
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-indigo-600
                "
              />
            </button>

            {/* Divider */}
            <div className="mx-1 h-6 w-px bg-slate-200" />

            {/* Profile */}
            <button
              className="
                flex
                items-center
                gap-2
                rounded-lg
                px-2
                py-1.5
                transition
                hover:bg-slate-100
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-900
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {user?.name?.slice(0, 1).toUpperCase()}
              </div>

              <div className="hidden text-left xl:block">
                <p className="text-sm font-semibold leading-4 text-slate-900">
                  {user?.name}
                </p>

                <p className="text-[11px] text-slate-500">{user?.role}</p>
              </div>
            </button>
          </div>

          {/* ================= MOBILE / TABLET CONTROLS ================= */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Search */}
            <button
              onClick={() => setMobileSearch(!mobileSearch)}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                text-slate-600
                transition
                hover:bg-slate-100
              "
            >
              <Search size={19} />
            </button>

            {/* Notification */}
            <button
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                text-slate-600
                transition
                hover:bg-slate-100
              "
            >
              <Bell size={19} />

              <span
                className="
                  absolute
                  right-2
                  top-2
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-indigo-600
                "
              />
            </button>

            {/* Menu */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >
              <Menu size={21} />
            </button>
          </div>
        </div>

        {/* ================= MOBILE SEARCH ================= */}
        {mobileSearch && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <div
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                px-3
                focus-within:border-slate-400
                focus-within:bg-white
              "
            >
              <Search size={17} className="shrink-0 text-slate-400" />

              <input
                type="text"
                placeholder="Search..."
                autoFocus
                className="
                  w-full
                  bg-transparent
                  text-sm
                  text-slate-900
                  outline-none
                  placeholder:text-slate-400
                "
              />
            </div>
          </div>
        )}

        {/* ================= MOBILE MENU ================= */}
        {mobileMenu && (
          <div
            className="
              border-t
              border-slate-200
              bg-white
              px-4
              pb-5
              pt-3
              md:hidden
            "
          >
            {/* Mobile Profile */}
            <div
              className="
                mt-4
                flex
                items-center
                gap-3
                border-t
                border-slate-200
                pt-4
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-900
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {user.name.slice(0, 1).toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {user.name}
                </p>

                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
            </div>

            {/* ================= LOGOUT ================= */}
            <button
              onClick={handleLogout}
              className="
                mt-3
                flex
                w-full
                items-center
                gap-3
                rounded-lg
                px-3
                py-2.5
                text-sm
                font-medium
                text-slate-600
                transition
                hover:bg-red-50
                hover:text-red-600
              "
            >
              <LogOut size={18} strokeWidth={1.8} />
              Logout
            </button>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;

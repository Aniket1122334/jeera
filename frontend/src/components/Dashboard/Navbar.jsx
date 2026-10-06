import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navbar = ({ user }) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      setMobileMenu(false);
      navigate("/login", { replace: true });
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to sign out");
    }
  };

  return <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
      <a href="/dashboard" className="flex items-center gap-2.5" aria-label="Jeera dashboard">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-lg font-bold text-white shadow-sm">J</span>
        <span className="text-xl font-bold tracking-tight text-slate-950">jeera</span>
      </a>
      <div className="hidden items-center gap-3 md:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">{user?.name?.slice(0, 1).toUpperCase()}</span>
        <div className="max-w-48"><p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p><p className="text-xs capitalize text-slate-500">{user?.role}</p></div>
        <button onClick={handleLogout} title="Sign out" className="ml-2 flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Sign out"><LogOut size={18}/></button>
      </div>
      <button onClick={()=>setMobileMenu(v=>!v)} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 md:hidden" aria-label={mobileMenu?"Close account menu":"Open account menu"} aria-expanded={mobileMenu}>{mobileMenu?<X size={20}/>:<Menu size={20}/>}</button>
    </div>
    {mobileMenu&&<div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">{user?.name?.slice(0,1).toUpperCase()}</span><div><p className="text-sm font-semibold text-slate-900">{user?.name}</p><p className="text-xs capitalize text-slate-500">{user?.role}</p></div></div><button onClick={handleLogout} className="mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"><LogOut size={17}/>Sign out</button></div>}
  </header>;
};

export default Navbar;

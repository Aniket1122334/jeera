import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
  Clock3,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const email = useRef(null);
  const password = useRef(null);

  useEffect(() => {
    email?.current?.focus();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        email: email.current.value,
        password: password.current.value,
      };

      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/login",
        formData,
        {
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ================================================= */}
        {/* LEFT SIDE - LOGIN FORM */}
        {/* ================================================= */}

        <div className="flex min-h-screen flex-col">
          {/* Logo */}
          <div className="px-6 py-6 sm:px-10 lg:px-12">
            <a href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 shadow-lg shadow-slate-950/10">
                <span className="text-lg font-bold text-white">J</span>
              </div>

              <span className="text-xl font-bold tracking-tight">jeera</span>
            </a>
          </div>

          {/* Form Container */}
          <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
            <div className="w-full max-w-105">
              {/* Heading */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Welcome back
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Sign in to your Jeera workspace and continue managing your
                  team's work.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-md font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="group relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-indigo-600"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      ref={email}
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-md font-semibold text-slate-700 "
                    >
                      Password
                    </label>
                  </div>

                  <div className="group relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-indigo-600"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      ref={password}
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Security */}
              <div className="mt-7 flex items-center justify-center gap-2 text-center">
                <ShieldCheck size={15} className="text-emerald-500" />

                <p className="text-xs text-slate-400">
                  Your workspace is protected with secure authentication.
                </p>
              </div>

              {/* Footer */}
              <div className="mt-10 border-t border-slate-200 pt-6 text-center">
                <p className="text-xs text-slate-400">
                  Don't have access to a workspace?
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Contact your organization administrator.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="px-6 py-5 sm:px-10 lg:px-12">
            <p className="text-xs text-slate-400">
              © 2026 Jeera. All rights reserved.
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* RIGHT SIDE - PRODUCT SHOWCASE */}
        {/* ================================================= */}

        <div className="relative hidden overflow-hidden bg-slate-950 lg:flex">
          {/* Background glow */}
          <div className="absolute -left-40 -top-40 h-125 w-125 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Top */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2">
                <Sparkles size={14} className="text-indigo-400" />

                <span className="text-xs font-medium text-slate-300">
                  Your team's workspace
                </span>
              </div>

              <h2 className="mt-8 max-w-xl text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Everything your team needs,
                <span className="text-indigo-400"> in one place.</span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">
                Plan work, manage teams and stay connected with a workspace
                designed to keep everyone moving forward.
              </p>
            </div>

            {/* Dashboard Visual */}
            <div className="my-10">
              <div className="rounded-2xl border border-white/10 bg-white/4 p-3 shadow-2xl backdrop-blur-xl">
                <div className="rounded-xl border border-white/10 bg-[#0f172a] p-5">
                  {/* Mini top bar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-medium uppercase tracking-widest text-slate-500">
                        Overview
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        Team performance
                      </p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-[9px] font-bold text-indigo-400">
                      AV
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <DarkStat icon={Zap} label="Tasks" value="128" />

                    <DarkStat icon={Users} label="Members" value="24" />

                    <DarkStat icon={Clock3} label="Completed" value="55" />
                  </div>

                  {/* Progress */}
                  <div className="mt-5 rounded-xl border border-white/5 bg-white/2.5 p-4">
                    <div className="flex justify-between">
                      <span className="text-[10px] font-medium text-slate-400">
                        Weekly progress
                      </span>

                      <span className="text-[10px] font-bold text-indigo-400">
                        72%
                      </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[72%] rounded-full bg-linear-to-r from-indigo-500 to-violet-500" />
                    </div>

                    <div className="mt-4 flex justify-between">
                      <span className="text-[9px] text-slate-500">
                        18 completed
                      </span>

                      <span className="text-[9px] text-slate-500">
                        25 total tasks
                      </span>
                    </div>
                  </div>

                  {/* Team activity */}
                  <div className="mt-4">
                    <p className="text-[10px] font-semibold text-slate-400">
                      Recent activity
                    </p>

                    <div className="mt-3 space-y-2">
                      <DarkActivity
                        initials="RS"
                        text="Rahul completed a task"
                      />

                      <DarkActivity
                        initials="PM"
                        text="Priya joined Frontend Team"
                      />

                      <DarkActivity
                        initials="AK"
                        text="Aman created a new task"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom feature row */}
            <div className="grid grid-cols-3 gap-5 border-t border-white/10 pt-7">
              <DarkFeature icon={Users} title="Teams" text="Stay organized" />

              <DarkFeature icon={Zap} title="Tasks" text="Move work forward" />

              <DarkFeature
                icon={ShieldCheck}
                title="Secure"
                text="Role-based access"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================= */
/*                    SMALL COMPONENTS                      */
/* ========================================================= */

function DarkStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/2.5 p-3">
      <Icon size={14} className="text-indigo-400" />

      <p className="mt-3 text-lg font-bold text-white">{value}</p>

      <p className="mt-0.5 text-[9px] text-slate-500">{label}</p>
    </div>
  );
}

function DarkActivity({ initials, text }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/2 p-2.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/10 text-[8px] font-bold text-indigo-400">
        {initials}
      </div>

      <span className="text-[9px] text-slate-400">{text}</span>
    </div>
  );
}

function DarkFeature({ icon: Icon, title, text }) {
  return (
    <div>
      <Icon size={16} className="text-indigo-400" />

      <p className="mt-2 text-xs font-semibold text-white">{title}</p>

      <p className="mt-1 text-[9px] text-slate-500">{text}</p>
    </div>
  );
}

export default Login;

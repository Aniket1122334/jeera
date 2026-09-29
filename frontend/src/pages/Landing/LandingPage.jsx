import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleCheck,
  Command,
  MessageSquare,
  Menu,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: CircleCheck,
    title: "Task Management",
    description:
      "Create, assign, prioritize and track tasks from one organized workspace.",
  },
  {
    icon: Users,
    title: "Team Management",
    description:
      "Manage teams and employees with a clear organization hierarchy and role-based access.",
  },
  {
    icon: MessageSquare,
    title: "Team Chat",
    description:
      "Keep conversations connected to your teams with real-time communication.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Give owners, admins and employees the right level of access to their workspace.",
  },
];

const tasks = [
  {
    title: "Fix authentication flow",
    team: "Backend Team",
    priority: "High",
    status: "In Progress",
    avatar: "AK",
  },
  {
    title: "Build dashboard UI",
    team: "Frontend Team",
    priority: "Medium",
    status: "Todo",
    avatar: "RS",
  },
  {
    title: "Update API documentation",
    team: "Backend Team",
    priority: "Low",
    status: "Completed",
    avatar: "PM",
  },
];

function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMobileMenu(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden text-slate-900">
      {/* ================= NAVBAR ================= */}
      <header className="fixed left-0 right-0 top-0 bottom z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-25 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* Logo */}
          <button
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 shadow-lg shadow-slate-950/10">
              <span className="text-lg font-bold text-white cursor-pointer">
                J
              </span>
            </div>

            <span className="text-xl font-bold tracking-tight cursor-pointer">
              jeera
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => scrollTo("features")}
              className="font-medium text-slate-600 transition
              text-xl 
              hover:text-slate-950 cursor-pointer"
            >
              Features
            </button>

            <button
              onClick={() => scrollTo("workflow")}
              className="font-medium text-slate-600 transition 
              text-xl hover:text-slate-950 cursor-pointer"
            >
              How it works
            </button>

            <button
              onClick={() => scrollTo("teams")}
              className="font-medium text-slate-600 transition text-xl 
              hover:text-slate-950 cursor-pointer"
            >
              Teams
            </button>

            <button
              onClick={() => scrollTo("chat")}
              className="font-medium text-slate-600 transition text-xl hover:text-slate-950 cursor-pointer"
            >
              Chat
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 font-semibold text-slate-700 transition text-xl hover:text-slate-950 cursor-pointer"
            >
              Sign in
            </button>

            <button
              onClick={() => navigate("/login")}
              className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 text-md cursor-pointer"
            >
              Get started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg p-2 text-slate-700 md:hidden"
          >
            {mobileMenu ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white px-5 py-5 md:hidden">
            <div className="flex flex-col gap-2">
              {[
                ["Features", "features"],
                ["How it works", "workflow"],
                ["Teams", "teams"],
                ["Chat", "chat"],
              ].map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {label}
                </button>
              ))}

              <div className="mt-3 border-t border-slate-100 pt-4">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  Sign in
                </button>

                <button
                  onClick={() => scrollTo("login")}
                  className="mt-2 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
                >
                  Get started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ================= HERO ================= */}
        <section id="home" className="relative overflow-hidden pt-18">
          {/* Background decorations */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-175 w-225 -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-10 lg:pb-32 lg:pt-32">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3.5 py-2 shadow-sm">
                <Sparkles size={15} className="text-indigo-600" />

                <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                  A smarter workspace for modern teams
                </span>

                <ArrowRight size={14} className="text-slate-400" />
              </div>

              {/* Heading */}
              <h1 className="text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
                Teamwork,
                <br />
                <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  without the chaos.
                </span>
              </h1>

              {/* Description */}
              <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Manage organizations, teams, employees, tasks and conversations
                from one powerful workspace built for productive teams.
              </p>

              {/* Buttons */}
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/login")}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 sm:w-auto cursor-pointer"
                >
                  Get started
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <button
                  onClick={() => scrollTo("features")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
                >
                  Explore features
                </button>
              </div>
            </div>

            {/* ================= DASHBOARD PREVIEW ================= */}
            <div className="relative mx-auto mt-20 max-w-6xl">
              <div className="absolute -inset-5 rounded-[30px] bg-linear-to-r from-indigo-200/50 via-violet-200/40 to-blue-200/50 blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_80px_-25px_rgba(15,23,42,0.25)]">
                {/* Browser top */}
                <div className="flex h-11 items-center border-b border-slate-200 bg-slate-50 px-4">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  </div>

                  <div className="mx-auto hidden h-6 w-72 items-center justify-center rounded-md bg-white text-[10px] text-slate-400 shadow-sm sm:flex">
                    app.jeera.com/dashboard
                  </div>
                </div>

                <div className="flex min-h-105">
                  {/* Sidebar */}
                  <aside className="hidden w-52 shrink-0 border-r border-slate-200 bg-white p-4 sm:block">
                    <div className="mb-7 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
                        J
                      </div>
                      <span className="text-sm font-bold">jeera</span>
                    </div>

                    <div className="space-y-1">
                      <DashboardNav active label="Dashboard" />
                      <DashboardNav label="Tasks" />
                      <DashboardNav label="Teams" />
                      <DashboardNav label="Employees" />
                      <DashboardNav label="Chat" />
                    </div>

                    <div className="mt-8 border-t border-slate-100 pt-5">
                      <p className="px-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        Workspace
                      </p>

                      <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5">
                        <p className="text-xs font-semibold text-slate-700">
                          Acme Workspace
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          Admin
                        </p>
                      </div>
                    </div>
                  </aside>

                  {/* Dashboard */}
                  <div className="min-w-0 flex-1 bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-medium text-slate-400">
                          MONDAY, SEPTEMBER 28
                        </p>

                        <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                          Good morning, Aniket
                        </h2>
                      </div>

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                        AV
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                      <PreviewStat
                        title="Total Tasks"
                        value="128"
                        change="+12%"
                      />

                      <PreviewStat
                        title="In Progress"
                        value="41"
                        change="+8%"
                      />

                      <PreviewStat title="Completed" value="55" change="+18%" />

                      <PreviewStat
                        title="Team Members"
                        value="24"
                        change="+4%"
                      />
                    </div>

                    {/* Content */}
                    <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
                      {/* Tasks */}
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">
                              Recent tasks
                            </h3>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              Keep track of your team's work
                            </p>
                          </div>

                          <button className="text-[10px] font-semibold text-indigo-600">
                            View all
                          </button>
                        </div>

                        <div className="mt-4 space-y-2">
                          {tasks.map((task) => (
                            <TaskPreview key={task.title} task={task} />
                          ))}
                        </div>
                      </div>

                      {/* Activity */}
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Team activity
                          </h3>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            Latest workspace activity
                          </p>
                        </div>

                        <div className="mt-5 space-y-5">
                          <Activity
                            initials="RS"
                            text="Rahul created a new task"
                            time="2 min ago"
                          />

                          <Activity
                            initials="PM"
                            text="Priya completed a task"
                            time="18 min ago"
                          />

                          <Activity
                            initials="AK"
                            text="Aman joined Backend Team"
                            time="42 min ago"
                          />

                          <Activity
                            initials="NV"
                            text="New team created"
                            time="1 hr ago"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust text */}
            <div className="mt-10 text-center">
              <p className="text-xs font-medium text-slate-400">
                ORGANIZE WORK • CONNECT TEAMS • GET THINGS DONE
              </p>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section id="features" className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Everything in one place
              </span>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Built to keep your team moving.
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
                A focused workspace that brings your people, tasks and
                conversations together.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-5 text-base font-bold text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= WORKFLOW ================= */}
        <section id="workflow" className="bg-slate-950">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                  Simple workflow
                </span>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  From people to progress.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  Organize your workspace, create teams, assign work and track
                  progress without jumping between multiple tools.
                </p>

                <div className="mt-9 space-y-6">
                  <WorkflowStep
                    number="01"
                    title="Create your workspace"
                    description="Set up an organization and manage its members from one place."
                  />

                  <WorkflowStep
                    number="02"
                    title="Build your teams"
                    description="Create teams and organize employees around the work they do."
                  />

                  <WorkflowStep
                    number="03"
                    title="Assign and complete work"
                    description="Create tasks, set priorities and follow progress from start to finish."
                  />
                </div>
              </div>

              {/* Workflow Visual */}
              <div className="relative">
                <div className="absolute -inset-5 rounded-3xl bg-indigo-500/10 blur-3xl" />

                <div className="relative rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur">
                  <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-500">
                          BACKEND TEAM
                        </p>

                        <h3 className="mt-1 text-sm font-semibold text-white">
                          Sprint progress
                        </h3>
                      </div>

                      <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                        On track
                      </span>
                    </div>

                    <div className="mt-7">
                      <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-white">
                          72%
                        </span>

                        <span className="text-xs text-slate-500">
                          18 of 25 tasks
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[72%] rounded-full bg-linear-to-r from-indigo-500 to-violet-500" />
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-3">
                      <MiniMetric label="Todo" value="4" />
                      <MiniMetric label="Active" value="7" />
                      <MiniMetric label="Done" value="14" />
                    </div>

                    <div className="mt-6 space-y-2">
                      {[
                        ["Authentication API", "72%"],
                        ["Dashboard API", "48%"],
                        ["Socket integration", "91%"],
                      ].map(([name, progress]) => (
                        <div
                          key={name}
                          className="rounded-lg border border-white/5 bg-white/3 p-3"
                        >
                          <div className="flex justify-between">
                            <span className="text-[11px] font-medium text-slate-300">
                              {name}
                            </span>

                            <span className="text-[10px] text-slate-500">
                              {progress}
                            </span>
                          </div>

                          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-indigo-500"
                              style={{ width: progress }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TEAMS ================= */}
        <section id="teams" className="bg-[#f8fafc]">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              {/* Visual */}
              <div className="order-2 lg:order-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Organization
                      </p>

                      <h3 className="mt-1 text-base font-bold text-slate-900">
                        Acme Technologies
                      </h3>
                    </div>

                    <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      Manage
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    <TeamRow
                      initials="BE"
                      name="Backend Team"
                      members="12 members"
                      tasks="34 tasks"
                    />

                    <TeamRow
                      initials="FE"
                      name="Frontend Team"
                      members="8 members"
                      tasks="27 tasks"
                    />

                    <TeamRow
                      initials="HR"
                      name="HR Team"
                      members="4 members"
                      tasks="12 tasks"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                  Organized teams
                </span>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Everyone knows where they belong.
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
                  Structure your organization around teams and give every person
                  a clear place in the workflow.
                </p>

                <div className="mt-7 space-y-3">
                  {[
                    "Clear team structure",
                    "Employee management",
                    "Role-based permissions",
                    "Organization-level isolation",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <Check size={12} strokeWidth={3} />
                      </div>

                      <span className="text-sm font-medium text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CHAT ================= */}
        <section id="chat" className="overflow-hidden bg-white">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                  Team communication
                </span>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Keep the conversation close to the work.
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
                  Team-based conversations keep everyone connected without
                  separating communication from the work your team is actually
                  doing.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <FeaturePill icon={Zap} text="Real-time" />
                  <FeaturePill icon={Users} text="Team based" />
                  <FeaturePill icon={MessageSquare} text="Simple" />
                </div>
              </div>

              {/* Chat UI */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-xl shadow-slate-200/60 sm:p-5">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <MessageSquare size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Backend Team
                      </p>

                      <p className="text-[10px] text-emerald-500">
                        8 members online
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 p-5">
                    <ChatMessage
                      initials="RS"
                      name="Rahul"
                      message="The authentication API is ready for testing."
                      time="10:42 AM"
                    />

                    <ChatMessage
                      initials="AK"
                      name="Aman"
                      message="Perfect. I'll test it now."
                      time="10:43 AM"
                      own
                    />

                    <ChatMessage
                      initials="PM"
                      name="Priya"
                      message="I've also updated the dashboard task."
                      time="10:44 AM"
                    />
                  </div>

                  <div className="border-t border-slate-100 p-3">
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5">
                      <span className="flex-1 text-xs text-slate-400">
                        Message Backend Team...
                      </span>

                      <button className="rounded-md bg-slate-950 p-1.5 text-white">
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section
          id="login"
          className="bg-[#f8fafc] px-5 pb-20 sm:px-8 lg:px-10"
        >
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-center sm:px-10 sm:py-20">
            <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Command size={22} className="text-indigo-300" />
              </div>

              <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Bring your team and your work together.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                One workspace for organizations, teams, tasks and conversations.
              </p>

              <button
                onClick={() => navigate("/login")}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100 cursor-pointer"
              >
                Get started
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
              J
            </div>

            <span className="text-sm font-bold">jeera</span>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 Jeera. Built for productive teams.
          </p>

          <div className="flex gap-5">
            <button className="text-xs font-medium text-slate-500 hover:text-slate-900">
              Privacy
            </button>

            <button className="text-xs font-medium text-slate-500 hover:text-slate-900">
              Terms
            </button>

            <button className="text-xs font-medium text-slate-500 hover:text-slate-900">
              GitHub
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ========================================================= */
/*                       COMPONENTS                          */
/* ========================================================= */

function DashboardNav({ label, active = false }) {
  return (
    <div
      className={`rounded-lg px-3 py-2 text-[11px] font-medium ${
        active ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-50"
      }`}
    >
      {label}
    </div>
  );
}

function PreviewStat({ title, value, change }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-[9px] font-medium text-slate-400">{title}</p>

      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="text-xl font-bold tracking-tight text-slate-900">
          {value}
        </span>

        <span className="text-[9px] font-semibold text-emerald-500">
          {change}
        </span>
      </div>
    </div>
  );
}

function TaskPreview({ task }) {
  const priorityClass = {
    High: "bg-red-50 text-red-600",
    Medium: "bg-amber-50 text-amber-600",
    Low: "bg-slate-100 text-slate-500",
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 p-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[8px] font-bold text-slate-600">
        {task.avatar}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-semibold text-slate-700">
          {task.title}
        </p>

        <p className="mt-0.5 truncate text-[8px] text-slate-400">{task.team}</p>
      </div>

      <span
        className={`hidden rounded-md px-2 py-1 text-[8px] font-semibold sm:block ${priorityClass[task.priority]}`}
      >
        {task.priority}
      </span>

      <span className="hidden text-[8px] font-medium text-slate-400 lg:block">
        {task.status}
      </span>
    </div>
  );
}

function Activity({ initials, text, time }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[8px] font-bold text-indigo-600">
        {initials}
      </div>

      <div>
        <p className="text-[10px] font-medium leading-4 text-slate-700">
          {text}
        </p>

        <p className="mt-0.5 text-[8px] text-slate-400">{time}</p>
      </div>
    </div>
  );
}

function WorkflowStep({ number, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-indigo-400">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/3 p-3">
      <p className="text-[9px] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function TeamRow({ initials, name, members, tasks }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-indigo-100 hover:bg-indigo-50/30">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600">
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{name}</p>

        <p className="mt-0.5 text-[10px] text-slate-400">
          {members} • {tasks}
        </p>
      </div>

      <ChevronDown size={15} className="-rotate-90 text-slate-300" />
    </div>
  );
}

function FeaturePill({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600">
      <Icon size={14} className="text-indigo-600" />
      {text}
    </div>
  );
}

function ChatMessage({ initials, name, message, time, own = false }) {
  return (
    <div className={`flex gap-3 ${own ? "flex-row-reverse" : ""}`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[9px] font-bold text-indigo-600">
        {initials}
      </div>

      <div className={`max-w-[75%] ${own ? "text-right" : ""}`}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-800">{name}</span>

          <span className="text-[9px] text-slate-400">{time}</span>
        </div>

        <div
          className={`mt-1 rounded-xl px-3 py-2 text-left text-xs leading-5 ${
            own ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-600"
          }`}
        >
          {message}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
